(function () {
  const yoga = window.YOGA
  const $ = window.jQuery

  const selectorOptions = {
    jPlayer: '#jp-jplayer-id',
    cssSelectorAncestor: '#jp-container-id'
  }

  const playlistOptions = {
    playlistOptions: {
      autoPlay: false,
      enableRemoveControls: false
    },
    solution: 'html',
    supplied: 'm4a',
    audioFullScreen: false,
    useStateClassSkin: true,
    keyEnabled: true
  }

  const playlistElm = new jPlayerPlaylist(selectorOptions, [], playlistOptions)
  let currentPlaylist
  const $initialContainer = $('#start-container')
  const $playerContainer = $('#player-container')
  const $submitButton = $('#submit-lesson-btn', $initialContainer)
  const $backButton = $('#start-over-button', $playerContainer)
  const $savePlaylistButton = $('#save-playlist-button', $playerContainer)
  const $numElm = $('#num', $initialContainer)
  $numElm.val(5)

  const defaultPlaylistSaveText = $savePlaylistButton.text()
  const savedPlaylistSaveText = 'Saved!'

  const rebindHistLinks = function () {
    $('.prev-lesson-link').click(function () {
      const clickedElm = this
      const storageIndex = clickedElm.dataset.storageIndex

      const storedHistoryStr = window.localStorage.getItem('history') || '[]'
      const storedHistory = JSON.parse(storedHistoryStr)
      storedHistory.reverse()
      currentPlaylist = storedHistory[storageIndex].playlist
      playlistElm.setPlaylist(currentPlaylist)
      showPlayerContainer()
    })
  }

  $savePlaylistButton.click(function () {
    yoga.addPlaylistToHistory(currentPlaylist)
    $savePlaylistButton.text(savedPlaylistSaveText)
    $savePlaylistButton.prop('disabled', true)
    yoga.updatePlaylistMenu(rebindHistLinks)
  })

  const showInitContainer = function () {
    $initialContainer.show()
    $playerContainer.hide()
  }

  const showPlayerContainer = function () {
    $initialContainer.hide()
    $playerContainer.show()
    $savePlaylistButton.text(defaultPlaylistSaveText)
    $savePlaylistButton.prop('disabled', false)
  }

  $submitButton.click(function () {
    const numTracks = parseInt($numElm.val(), 10)
    currentPlaylist = yoga.getPlaylist(numTracks).map(function (elm) {
      return {
        title: elm.name,
        m4a: '/audio/' + elm.uuid + '.aac'
      }
    })

    playlistElm.setPlaylist(currentPlaylist)
    showPlayerContainer()
  })

  $backButton.click(function () {
    showInitContainer()
  })

  yoga.updatePlaylistMenu(rebindHistLinks)
}())
