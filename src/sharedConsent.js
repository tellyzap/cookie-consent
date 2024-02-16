// let shouldPropagateConsent = false;
// let originalUrl = "";

// // let observer = new MutationObserver(() => {
// //   if (shouldPropagateConsent && window.location.href !== originalUrl) {
// //     console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
// //     //previousUrl = window.location.href;

// //     window.history.replaceState({}, '', `${window.location.href}${makeQueryParam()}`);
// //   }
// // });
// // const config = { subtree: true, childList: true };

// // // start observing change
// // observer.observe(document, config);

let consent = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
  consented: false,
};

// window.addEventListener('beforeunload', (_ev) => {
//   //observer.disconnect();
//   window.history.replaceState({}, '', `${makeQueryParam()}`);
//   if (shouldPropagateConsent && window.location.href !== originalUrl) {
//     console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
//     //previousUrl = window.location.href;

//     window.history.replaceState({}, '', `${window.location.href}${makeQueryParam()}`);
//   }
// });

// window.addEventListener("popstate", (event) => {
//   console.log('popstate', event);
//   alert(
//     `location: ${document.location}, state: ${JSON.stringify(event.state)}`,
//   );
// });

// window.addEventListener(
//   "hashchange",
//   () => {
//     console.log("The hash has changed!");
//   },
//   false,
// );


// export function enableConsentPropagation(consent) {
//   console.log('enablePropagation');
//   shouldPropagateConsent = true;
//   // popups = popups;
//   // analytics = analytics;
//   // healthCampaigns = healthCampaigns;
//   consent = consent;
// }

// export function disableConsentPropagation() {
//   console.log('disablePropagation');
//   shouldPropagateConsent = false;
// }

// export function propagateConsentIfEnabled() {
//   //const originalUrl = window.location.href;
//    originalUrl = window.location.href;

//   // observer = new MutationObserver(() => {
//   //   if (shouldPropagateConsent && window.location.href !== originalUrl) {
//   //     console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
//   //     //previousUrl = window.location.href;

//   //     window.history.replaceState({}, '', `${window.location.href}${makeQueryParam()}`);
//   //   }
//   // });

//   // const config = { subtree: true, childList: true };

//   // start observing change
//   //observer.observe(document, config);
// }

// function makeQueryParam() {
//   const isFirstParam = location.search.length === 0;

//   const analytics = consent.statistics ? '1' : '0';
//   const popups = consent.marketing ? '1' : '0';
//   const healthCampaigns = consent.preferences ? '1' : '0';

//   return `${isFirstParam ? '?' : '&'}consent=an${analytics}pu${popups}hc${healthCampaigns}`
// }

export function setSharedConsent(consent) {
    console.log('setSharedConsent');
    consent = consent;
}

// export function getConsentQueryParam() {
//   const urlParams = new URLSearchParams(location.search);

//   const analytics = consent.statistics ? '1' : '0';
//   const popups = consent.marketing ? '1' : '0';
//   const healthCampaigns = consent.preferences ? '1' : '0';

//   urlParams.append('consent', `an${analytics}pu${popups}hc${healthCampaigns}`);

//   return urlParams.toString();
// }

export function urlWithCookieConsent(url) {
  if (!consent.consented) {
    return url;
  }

  const qs = url.indexOf('?') !== -1 ? url.substring(url.indexOf('?')) : '';
  let urlParams = new URLSearchParams(qs);

  const analytics = consent.statistics ? '1' : '0';
  const popups = consent.marketing ? '1' : '0';
  const healthCampaigns = consent.preferences ? '1' : '0';

  urlParams.append('consent', `an${analytics}pu${popups}hc${healthCampaigns}`);

  return `${url}?${urlParams.toString()}`;
}

export function hasConsentQueryParam() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('consent') !== null;
}

export function getConsentFromQueryParam() {
  const urlParams = new URLSearchParams(window.location.search)
  const param = urlParams.get('consent');
  if (param !== null) {
    const analytics = param.match(/an([0-1])/)[1] === '1';
    const popups = param.match(/pu([0-1])/)[1] === '1';
    const healthCampaigns = param.match(/hc([0-1])/)[1] === '1';

    consent = {
      necessary: true,
      preferences: healthCampaigns,
      statistics: analytics,
      marketing: popups,
      consented: true,
    };
  } else {
    consent = {
      necessary: false,
      preferences: false,
      statistics: false,
      marketing: false,
      consented: false,
    };
  }
  return consent;
}