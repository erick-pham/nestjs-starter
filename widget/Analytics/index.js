
let configs = null

function callApi({
  currentHref,
  currentTitle,
  eventCategory,
  eventType,
  eventName
}) {
  if (configs === null) {
    return
  }

  let url = 'https://pewter-chalk-minotaurasaurus.glitch.me/collect';
  let options = {};

  if (configs.options) {
    options = configs.options
  }

  if (configs.options && configs.options.url) {
    url = configs.options.url
  }

  if (!configs.id || !url) {
    throw new Error('Missing ID or Configs')
  }
  fetch(`${url}?id=${configs.id}&p_h=${currentHref}&p_t=${currentTitle}&e_c=${eventCategory}&e_t=${eventType}&e_n=${eventName}`, options);
}

// Function to get the current href
function getCurrentHref() {
  return window.location.pathname;
}

// Function to get the current href
function getCurrentTitle() {
  return document.title;
}

// Function to handle page navigation
function handleNavigation() {
  var currentHref = getCurrentHref();
  var currentTitle = getCurrentTitle();
  callApi({
    currentHref,
    currentTitle,
    eventCategory: null,
    eventType: null,
    eventName: null
  })
}

export function init(id, options = {}) {
  configs = {
    id: id,
    options: options
  }
}


export function event({ category, type, name }) {
  var currentHref = getCurrentHref();
  var currentTitle = getCurrentTitle();
  callApi({
    currentHref,
    currentTitle,
    eventCategory: category,
    eventType: type,
    eventName: name
  })
}

// Attach the event listener for page navigation
document.addEventListener("DOMContentLoaded", function () {
  handleNavigation();

  // Listen for click events on links
  document.addEventListener("click", function (event) {
    var target = event.target;

    // Check if the clicked element is a link
    if (target.tagName === "A" && target.getAttribute("href")) {
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
