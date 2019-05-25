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
      enableRemoveControls: true
    },  
    solution: "html",
    supplied: "m4a",
    audioFullScreen: true,
    useStateClassSkin: true,
    keyEnabled: true
  };

  new jPlayerPlaylist(selectorOptions, playlistData, playlistOptions);
});