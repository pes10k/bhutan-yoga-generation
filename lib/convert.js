const cryptoLib = require("crypto");
const fsLib = require("fs");
const pathLib = require("path");
const utilLib = require("util");

const statAsync = utilLib.promisify(fsLib.stat);

const fluentFfmpegLib = require("fluent-ffmpeg");

const inputAudioDir = pathLib.join(__dirname, "..", "audio");

const mergeTracks = async (tracks, cacheDir, tempDir) => {
  const cacheKeyHash = cryptoLib.createHash("sha256");
  for (const aTrack of tracks) {
    cacheKeyHash.update(aTrack[2]);
  }
  const cacheKey = cacheKeyHash.digest("hex") + ".aac";
  const cacheFilePath = pathLib.join(cacheDir, cacheKey);

  try {
    await statAsync(cacheFilePath);
    return {
      path: cacheFilePath,
      key: cacheKey,
    };
  } catch (_) {
    // pass;
  }

  let ffmpegBuilderHandle = fluentFfmpegLib();
  for (const aTrack of tracks) {
    const aTrackPath = pathLib.join(inputAudioDir, aTrack[2] + ".aac");
    ffmpegBuilderHandle = ffmpegBuilderHandle.input(aTrackPath);
  }

  const mergePromise = new Promise((resolve, reject) => {
    ffmpegBuilderHandle
      .on('error', err => {
        reject(err);
      })
      .on('end', _ => {
        resolve();
      })
      .mergeToFile(cacheFilePath, tempDir);
  });

  await mergePromise;
  return {
    path: cacheFilePath,
    key: cacheKey,
  };
};

module.exports = {
  mergeTracks,
};
