$(function () {
  var selectorOptions = {
    jPlayer: "#jp-jplayer-id",
    cssSelectorAncestor: "#jp-container-id"
  };

  var playlistData = window.playlistData.map(function (elm) {
    return {
      title: elm.name,
      m4a: "/audio/" + elm.uuid + ".aac"
    };
  });

  var playlistOptions = {
    playlistOptions: {
      autoPlay: false,
      enableRemoveControls: false
    },  
    solution: "html",
    supplied: "m4a",
    audioFullScreen: false,
    useStateClassSkin: true,
    keyEnabled: true
  };

  new jPlayerPlaylist(selectorOptions, playlistData, playlistOptions);
});