$(function () {
  var dateOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  };

  var storageKey = "history";
  var storedHistoryStr = window.localStorage.getItem(storageKey) || "[]";
  var storedHistory = JSON.parse(storedHistoryStr);
  var historyElm = $("li.nav-item.dropdown");
  var prevLessonsElm = historyElm.find(".dropdown-menu");
  var currentPath = window.location.pathname;
  var currentUrlInHistory = false;

  if (currentPath.indexOf("/play/") === 0) {
    currentUrlInHistory = storedHistory.some(function (elm) {
      return elm.url === currentPath;
    });
    if (currentUrlInHistory === false) {
      storedHistory.push({
        url: currentPath,
        date: (new Date()).toISOString(),
        num: window.playlistData.length
      });
      window.localStorage.setItem(storageKey, JSON.stringify(storedHistory));
    }
  }

  if (storedHistory.length  === 0) {
    return;
  }

  storedHistory.reverse();
  historyElm.removeClass("invisible");
  storedHistory.forEach(function (elm) {
    var url = elm.url;
    var date = new Date(elm.date);
    var num = elm.num;
    var dateString = date.toLocaleDateString("default", dateOptions);
    var label = dateString + " (" + String(num) + " lessons)";

    prevLessonsElm.append('<a class="dropdown-item" href="' + url + '">' + label + '</a>');
  });
});