let shouldPropagateConsent = false;

let consent = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
  consented: false,
};

export function enableConsentPropagation(consent) {
  console.log('enableProagation');
  shouldPropagateConsent = true;
  // popups = popups;
  // analytics = analytics;
  // healthCampaigns = healthCampaigns;
  consent = consent;
}

export function disableConsentPropagation() {
  console.log('disableProagation');
  shouldPropagateConsent = false;
}

export function propagateConsentIfEnabled() {
  const originalUrl = window.location.href;

  const observer = new MutationObserver(() => {
    if (shouldPropagateConsent && window.location.href !== originalUrl) {
      console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
      //previousUrl = window.location.href;

      window.history.replaceState({}, '', `${window.location.href}${makeQueryParam()}`);
    }
  });

  const config = { subtree: true, childList: true };

  // start observing change
  observer.observe(document, config);
}

function makeQueryParam() {
  const isFirstParam = location.search.length === 0;

  const analytics = consent.statistics ? '1' : '0';
  const popups = consent.marketing ? '1' : '0';
  const healthCampaigns = consent.preferences ? '1' : '0';

  return `${isFirstParam ? '?' : '&'}consent=an${analytics}pu${popups}hc${healthCampaigns}`
}