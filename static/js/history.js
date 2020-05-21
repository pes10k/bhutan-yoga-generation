(function () {
  const yoga = window.YOGA
  const $ = window.jQuery

  const dateOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }

  const storageKey = 'history'
  const historyElm = $('li.nav-item.dropdown')
  const prevLessonsElm = historyElm.find('.dropdown-menu')

  yoga.addPlaylistToHistory = function (trackPlaylist) {
    const storedHistoryStr = window.localStorage.getItem(storageKey) || '[]'
    const storedHistory = JSON.parse(storedHistoryStr)
    storedHistory.push({
      date: (new Date()).toISOString(),
      num: trackPlaylist.length,
      playlist: trackPlaylist
    })
    window.localStorage.setItem(storageKey, JSON.stringify(storedHistory))
  }

  yoga.updatePlaylistMenu = function (callback) {
    prevLessonsElm.children().remove()
    const storedHistoryStr = window.localStorage.getItem(storageKey) || '[]'
    const storedHistory = JSON.parse(storedHistoryStr)
    if (storedHistory.length === 0) {
      historyElm.addClass('invisible')
      return
    }

    storedHistory.reverse()
    historyElm.removeClass('invisible')
    storedHistory.forEach(function (elm, index) {
      const date = new Date(elm.date)
      const num = elm.num
      const dateString = date.toLocaleDateString('default', dateOptions)
      const label = dateString + ' (' + (+num) + ' parts)'
      prevLessonsElm.append('<a class="dropdown-item prev-lesson-link" data-storage-index="' + index + '">' + label + '</a>')
    })
    callback()
  }
}())
