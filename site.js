#!/usr/bin/env node

const fsLib = require("fs");

const configDataText = fsLib.readFileSync("./config.json", "utf8");
const config = JSON.parse(configDataText);

const audioDataText = fsLib.readFileSync("./data.json", "utf8");
const audioData = JSON.parse(audioDataText);
const numAudioFiles = Object.keys(audioData).reduce((prev, cur) => {
  return prev + cur.length;
}, 0);

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const tracksLib = require("./lib/tracks");
const convertLib = require("./lib/convert");

app.use("/static", express.static("static"));
app.use("/lessons", express.static("lessons"));
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
  const formParams = {
    "site_name": config["site name"],
    "num_tracks": numAudioFiles,
    "min_tracks": config["min tracks"],
  };
  const numTracks = req.body.num;
  if (parseInt(numTracks).toString() !== numTracks) {
    formParams.error = "Received an invalid number of tracks.";
  } else {
    const playlist = await tracksLib.getPlaylist(numTracks);
    formParams.playlist = playlist;

    const mergeRs = await convertLib.mergeTracks(playlist, "./lessons", "/tmp");
    formParams.mergedFile = mergeRs.key;
  }

  res.render("generate", formParams);
});

app.listen(config.port, _ => {
  console.log(`Example app listening on port ${config.port}!`);
});
