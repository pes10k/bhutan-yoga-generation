#!/usr/bin/env node

const fsLib = require("fs");

const configDataText = fsLib.readFileSync("./config.json", "utf8");
const config = JSON.parse(configDataText);

const audioDataText = fsLib.readFileSync("./data.json", "utf8");
const audioData = JSON.parse(audioDataText);
const numAudioFiles = Object.keys(audioData.tracks).reduce((prev, cur) => {
  return prev + cur.length;
}, 0);

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const tracksLib = require("./lib/tracks");

app.use("/static", express.static("static"));
app.use("/audio", express.static("audio"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", {
    "site_name": config["site name"],
    "num_tracks": numAudioFiles,
    "min_tracks": config["min tracks"],
  });
});

app.post("/generate", async (req, res) => {
  const numTracksStr = req.body.num;
  const numTracksInt = parseInt(numTracksStr);
  if (numTracksInt.toString() !== numTracksStr ||
      numTracksInt > numAudioFiles) {
    res.redirect("/");
    return;
  }

  const playlist = await tracksLib.getPlaylist(numTracksInt);
  const trackNums = playlist.map(e => audioData.uuidToNum[e[2]]).filter(e => !!e);
  if (trackNums.length !== numTracksInt) {
    res.redirect("/");
    return;
  }

  res.redirect("/play/" + trackNums.join("+"));
});

app.get("/play/:tracks", async (req, res) => {
  const formParams = {
    "site_name": config["site name"],
  };
  const trackNums = req.params.tracks.split("+");
  const playlist = trackNums.map(e => {
      const trackPath = audioData.numToPath[e];
      if (trackPath === undefined) {
        return false;
      }

      const [trackGroup, trackIndex] = trackPath;
      return audioData.tracks[trackGroup][trackIndex];
    }).filter(e => !!e);

  if (playlist.length !== trackNums.length) {
    formParams.error = "Received invalid tracks, please start over.";
  } else {
    formParams.playlistJSON = JSON.stringify(playlist);
  }

  res.render("play", formParams);
});

app.listen(config.port, _ => {
  console.log(`listening on port ${config.port}!`);
});
