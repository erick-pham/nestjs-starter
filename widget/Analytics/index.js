let configs = null;

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
  let name = cname + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function callApi({
  type,
  currentOrigin,
  currentPath,
  currentTitle,
  eventCategory = '',
  eventAction = '',
  eventLabel = ''
}) {
  if (configs === null) {
    return;
  }

  let url = 'https://pewter-chalk-minotaurasaurus.glitch.me/collect';
  let options = {};

  if (configs.options) {
    options = configs.options;
  }

  if (configs.options && configs.options.url) {
    url = configs.options.url;
  }

  if (!configs.id || !url) {
    throw new Error('Missing ID or Configs');
  }

  const params = {
    cid: configs.id,
    uid: configs.uid,
    t: type,
    sr: `${window.screen.width}x${window.screen.height}`,
    dl: currentOrigin,
    dp: currentPath,
    dt: currentTitle,
    ec: eventCategory,
    ea: eventAction,
    el: eventLabel
  };

  const qs = '?' + new URLSearchParams(params).toString();

  fetch(`${url}${qs}`, options);
}

// Function to get the current path
function getCurrentOrigin() {
  return window.location.origin;
}

// Function to get the current path
function getCurrentPath() {
  return window.location.pathname;
}

// Function to get the current href
function getCurrentTitle() {
  return document.title;
}

// Function to handle page navigation
function handleNavigation() {
  var currentOrigin = getCurrentOrigin();
  var currentPath = getCurrentPath();
  var currentTitle = getCurrentTitle();
  callApi({
    type: 'pageview',
    currentOrigin,
    currentPath,
    currentTitle
  });
}

export function init(id, options = {}) {
  configs = {
    id: id,
    options: options
  };

  var session = getCookie('_ea');
  if (session) {
    configs.uid = session;
  } else {
    var seconds = Math.floor(new Date().getTime() / 1000);
    var session_id = Math.random().toString(16).slice(2);
    configs.uid = `EA.${session_id}.${seconds}`;
    setCookie('_ea', configs.uid, 365);
  }
}

export function event({ category, action, label }) {
  var currentOrigin = getCurrentOrigin();
  var currentPath = getCurrentPath();
  var currentTitle = getCurrentTitle();
  callApi({
    type: 'event',
    currentOrigin,
    currentPath,
    currentTitle,
    eventCategory: category,
    eventAction: action,
    eventLabel: label
  });
}

// Trigger pageview manually
export function pageview({ path, title }) {
  var currentOrigin = getCurrentOrigin();
  callApi({
    type: 'pageview',
    currentOrigin,
    currentPath: path,
    currentTitle: title
  });
}

// Attach the event listener for page navigation
document.addEventListener('DOMContentLoaded', function () {
  handleNavigation();

  // Listen for click events on links
  document.addEventListener('click', function (event) {
    var target = event.target;

    // Check if the clicked element is a link
    if (target.tagName === 'A' && target.getAttribute('href')) {
      // console.log("target", target);
      // Prevent the default navigation behavior
      // event.preventDefault();

      // Get the target href
      // var href = target.href;

      // Perform the navigation
      // window.location.href = href;

      // Handle the navigation after a short delay
      setTimeout(handleNavigation, 100);
    }
  });
});
