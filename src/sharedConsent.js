/* eslint-disable no-console */
let shouldPropagateConsent = false;

/* eslint-disable sort-keys */
let consentVal = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
  consented: false,
  version: 0,
};
/* eslint-enable sort-key */

/**
 * Allow-list of sites that have opted in to shared cookie consent
 */
const allowlist = [
  // For deployed POC
  'wwwnhsuk.azurewebsites.net',
  'wwwnhsappservicenhsuk.azurewebsites.net',
  'accessloginnhsuk.azurewebsites.net',
  'www.nhs.uk',
  // For local development
  'localhost',
  'wwwnhsuk.test',
  'nhsapp.test',
  'nhslogin.test',
];

/**
 * Creates a URL object from an absolute or relative URL
 * @param {string} url
 * @returns {URL}
 */
function safeCreateURL(url) {
  let safeUrl;
  try {
    safeUrl = new URL(url);
  } catch (e) {
    safeUrl = new URL(url, window.location.href);
  }
  return safeUrl;
}

// TODO: This event listener will be required to insert consent query param for SPAs
window.addEventListener('popstate', (event) => {
  console.log('popstate', event);
  if (shouldPropagateConsent) {
    // alert(
    //   `location: ${document.location}, state: ${JSON.stringify(event.state)}`,
    // );
  }
});

export function removeConsentQueryParam() {
  const urlObj = new URL(window.location.href);
  const urlParams = urlObj.searchParams;
  urlParams.delete('consent');
  window.history.replaceState({}, '', urlObj.toString());
}

/**
 * Enables consent propagation for all links on the page.
 * Should only be called once per page load.
 * Adds consent query param to any URLs in links, if the href contains a different domain to the
 * current one, which is in the allowlist.
 */
export function enableConsentPropagation(consent, version) {
  console.log('enablePropagation');
  shouldPropagateConsent = true;
  consentVal = { ...consent, version };

  document.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (shouldPropagateConsent) {
        const href = e.currentTarget.getAttribute('href');
        if (href) {
          const url = safeCreateURL(href);
          if (url.hostname !== window.location.hostname && allowlist.includes(url.hostname)) {
            e.preventDefault();
            const newHref = urlWithCookieConsent(href);
            // console.log('Old href, new href', href, newHref);
            window.location.href = newHref;
          }
        }
      }
    });
  });
}

export function disableConsentPropagation() {
  console.log('disablePropagation');
  shouldPropagateConsent = false;
}

// Works with relative URLs
/**
 * Adds cookie-consent query param to a URL.
 * To be called when navigating to a new page from Javascript.
 * @param {string} url
 * @returns Modified URL with consent query param (if consented)
 */
export function urlWithCookieConsent(url) {
  const urlObj = safeCreateURL(url);

  if (!consentVal.consented || !allowlist.includes(urlObj.hostname)) {
    return url;
  }

  const urlParams = urlObj.searchParams;

  const analytics = consentVal.statistics ? '1' : '0';
  const popups = consentVal.marketing ? '1' : '0';
  const healthCampaigns = consentVal.preferences ? '1' : '0';
  const version = consentVal.version;

  urlParams.append('consent', `an${analytics}pu${popups}hc${healthCampaigns}v${version}`);

  return urlObj.toString();
}

export function hasConsentQueryParam() {
  const urlParams = new URLSearchParams(window.location.search);
  console.log(`hasConsentQueryParam=${urlParams.get('consent') !== null}`);
  return urlParams.get('consent') !== null;
}

export function versionSameAsQueryParam(currentCookieVersion) {
  const consent = getConsentFromQueryParam();
  return consent.version === currentCookieVersion;
}

export function getConsentFromQueryParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const param = urlParams.get('consent');
  if (param !== null) {
    const analytics = param.match(/an([0-1])/)[1] === '1';
    const popups = param.match(/pu([0-1])/)[1] === '1';
    const healthCampaigns = param.match(/hc([0-1])/)[1] === '1';
    const version = parseInt(param.substring(param.indexOf('v') + 1), 10);

    consentVal = {
      necessary: true,
      preferences: healthCampaigns,
      statistics: analytics,
      marketing: popups,
      consented: true,
      version,
    };
  } else {
    consentVal = {
      necessary: true,
      preferences: false,
      statistics: false,
      marketing: false,
      consented: false,
      version: 0,
    };
  }

  console.log('getConsentFromQueryParam', consentVal);
  return consentVal;
}

export function getSCPVersion() {
  return process.env.SCP_VERSION ?? 4;
}
