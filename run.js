#!/usr/bin/env node
const convertLib = require("./lib/convert");
const tracksLib = require("./lib/tracks");

const numTracks = process.argv[2];
(async _ => {
    try {
        const playlist = await tracksLib.getPlaylist(numTracks);
        console.log(playlist);
        console.log("Merging tracks: ");
        for (const aTrack of playlist) {
            console.log("\t" + aTrack[1] + ". " + aTrack[0]);
        }
        const mergedFilePath = await convertLib.mergeTracks(playlist, "/tmp/cache", "/tmp");
        console.log("File written to: " + mergedFilePath);
    } catch (_) {
        console.error("Goof up");
        console.error(_);
    }
})();
