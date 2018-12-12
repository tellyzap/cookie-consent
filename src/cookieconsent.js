import { getCookie, createCookie } from './cookies'
import { insertCookieBanner, hideCookieModal, showCookieConfirmation } from './modal'
import packageJson from '../package.json'

var delimiter = "---"; //used to split cookie into information

// If cookie rules/regulations change and the cookie itself needs to change, bump this version up afterwards.
// It will then give the user the banner again to consent to the new rules
export var COOKIE_VERSION = 1;
var cookieTypes = {
    "necessary": true,
    "preferences": true,
    "statistics": true,
    "marketing": false,
    "version": COOKIE_VERSION,
};

window.onload = function checkCookie() {
    var cookieName = "nhsuk-cookie-consent";
    //If there isn't a user cookie, create one
    if (getCookie(cookieName) == null) {
        createCookie(cookieName, cookieTypes, 365, "/");
        insertCookieBanner();
    } else if(!isValidVersion(cookieName, COOKIE_VERSION)) {
        createCookie(cookieName, cookieTypes, 365);
        insertCookieBanner();
    }
}

//If consent is given, change value of cookie
export function acceptConsent() {
    // On a domain where marketing cookies are required, toggleMarketing() would go here
    hideCookieModal();
    showCookieConfirmation();
}

function getCookieVersion(name) {
    var status = getCookie(name).split('|')[1];
    return status.split(';')[0];
}

function isValidVersion(name, version) {
    if (getCookieVersion(name) <= version)
        return true;
    else
        return false;
}

export function askMeLater() {
    createCookie("nhsuk-cookie-consent", cookieTypes, "", "/");
    hideCookieModal();
}


/*
 * Set the global NHSCookieConsent object that implementors of this library
 * will interact with.
 */
window.NHSCookieConsent = {
  /*
   * The version of this package as defined in the package.json
   */
  VERSION: packageJson.version,

  getPreferences,
  getStatistics,
  getMarketing,
  togglePreferences,
  toggleStatistics,
  toggleMarketing,
};

// Can use getCookie beforehand to get a cookie object from a name
function getPreferences(cookie) {
    return cookie.preferences;
};

function getStatistics(cookie) {
    return cookie.statistics;
};

function getMarketing(cookie) {
    return cookie.marketing;
};

function togglePreferences(cookie) {
    var cookie = JSON.parse(cookie);
    cookie.preferences = !cookie.preferences;
    createCookie(name, JSON.stringify(cookie), 365);
};

function toggleStatistics(name) {
    var cookie = JSON.parse(cookie);
    cookie.statistics = !cookie.statistics;
    createCookie(name, JSON.stringify(cookie), 365);
};

function toggleMarketing(name) {
    var cookie = JSON.parse(cookie);
    cookie.marketing = !cookie.marketing;
    createCookie(name, JSON.stringify(cookie), 365);
};
