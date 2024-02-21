/* global expect, jest */
/* eslint-disable no-underscore-dangle */
import {
  removeConsentQueryParam,
  enableConsentPropagation,
  urlWithCookieConsent,
  hasConsentQueryParam,
  getConsentFromQueryParam,
} from './sharedConsent';

describe('removeConsentQueryParam', () => {
  test('should remove consent query param from the URL', () => {
    const url = 'https://wwwnhsuk.azurewebsites.net/page?consent=an1pu0hc1';
    const expectedUrl = 'https://wwwnhsuk.azurewebsites.net/page';

    delete window.location;
    window.location = new URL(url);

    delete window.history;
    window.history = {
      replaceState: jest.fn(),
    };
    removeConsentQueryParam();
    expect(window.history.replaceState).toHaveBeenCalledWith({}, '', expectedUrl);
  });
});

describe('urlWithCookieConsent', () => {
  test('should return the URL without consent query param if consent is not given', () => {
    const url = 'https://wwwnhsuk.azurewebsites.net/page';

    /* eslint-disable sort-keys */
    enableConsentPropagation({
      necessary: true,
      preferences: true,
      statistics: true,
      marketing: true,
      consented: false,
    });
    /* eslint-enable sort-key */

    const modifiedUrl = urlWithCookieConsent(url);
    expect(modifiedUrl).toBe(url);
  });

  test('should return the URL with consent query param if consent is given', () => {
    const url = 'https://wwwnhsuk.azurewebsites.net/page';

    delete window.location;
    window.location = new URL('https://wwwnhsuk.azurewebsites.net');

    /* eslint-disable sort-keys */
    enableConsentPropagation({
      necessary: true,
      preferences: true,
      statistics: true,
      marketing: true,
      consented: true,
    });
    /* eslint-enable sort-key */

    const modifiedUrl = urlWithCookieConsent(url);
    expect(modifiedUrl).toBe('https://wwwnhsuk.azurewebsites.net/page?consent=an1pu1hc1');
  });

  test('should return the URL with consent query param for relative URL', () => {
    const url = '/page';

    delete window.location;
    window.location = new URL('https://wwwnhsuk.azurewebsites.net');

    /* eslint-disable sort-keys */
    enableConsentPropagation({
      necessary: true,
      preferences: true,
      statistics: true,
      marketing: true,
      consented: true,
    });
    /* eslint-enable sort-key */

    const modifiedUrl = urlWithCookieConsent(url);
    expect(modifiedUrl).toBe('https://wwwnhsuk.azurewebsites.net/page?consent=an1pu1hc1');
  });
});

describe('hasConsentQueryParam', () => {
  beforeEach(() => {
    delete window.location;
  });

  test('should return true if the URL has consent query param', () => {
    window.location = new URL('https://wwwnhsuk.azurewebsites.net/page?consent=an1pu0hc1');
    const hasQueryParam = hasConsentQueryParam();
    expect(hasQueryParam).toBe(true);
  });

  test('should return false if the URL does not have consent query param', () => {
    window.location = new URL('https://wwwnhsuk.azurewebsites.net/page');
    const hasQueryParam = hasConsentQueryParam();
    expect(hasQueryParam).toBe(false);
  });
});

describe('getConsentFromQueryParam', () => {
  beforeEach(() => {
    delete window.location;
  });

  test('should return the consent object from the consent query param', () => {
    window.location = new URL('https://wwwnhsuk.azurewebsites.net/page?consent=an1pu0hc1');
    const consent = getConsentFromQueryParam();
    expect(consent).toEqual({
      necessary: true,
      preferences: true,
      statistics: true,
      marketing: false,
      consented: true,
    });
  });

  test('should return the default consent object if the consent query param is not present', () => {
    window.location = new URL('https://wwwnhsuk.azurewebsites.net/page');
    const consent = getConsentFromQueryParam();
    expect(consent).toEqual({
      necessary: true,
      preferences: false,
      statistics: false,
      marketing: false,
      consented: false,
    });
  });
});

// describe.skip('"click" event listener', () => {
//   let originalHref;
//   let originalLocationHref;
//   let originalUrlWithCookieConsent;

//   beforeEach(() => {
//     delete window.location;
//     // window.location = {
//     //   href: jest.fn(),
//     // };
//     // originalHref = jest.spyOn(Element.prototype, 'getAttribute');
//     // originalLocationHref = jest.spyOn(window.location, 'href', 'get');
//     // originalUrlWithCookieConsent = jest.spyOn(window, 'urlWithCookieConsent');
//   });

//   // afterEach(() => {
//   //   originalHref.mockRestore();
//   //   originalLocationHref.mockRestore();
//   //   originalUrlWithCookieConsent.mockRestore();
//   // });

//   test('should prevent default and update window location href with modified URL if shouldPropagateConsent is true and href is in allowlist', () => {
//     const mockHref = 'http://wwwnhsuk.azurewebsites.net/page';
//     const mockModifiedHref = 'http://wwwnhsuk.azurewebsites.net/page?consent=an0pu0hc0';
//     const mockTarget = {
//       getAttribute: jest.fn().mockReturnValue(mockHref),
//     };
//     const mockEvent = {
//       target: mockTarget,
//       preventDefault: jest.fn(),
//     };

//     /* eslint-disable sort-keys */
//     enableConsentPropagation({
//       necessary: true,
//       preferences: true,
//       statistics: true,
//       marketing: true,
//       consented: true,
//     });
//     /* eslint-enable sort-key */

//     //allowlist.push('wwwnhsuk.azurewebsites.net');
//     originalHref.mockReturnValue(mockHref);
//     originalLocationHref.mockReturnValue('https://wwwnhsuk.azurewebsites.net');
//     originalUrlWithCookieConsent.mockReturnValue(mockModifiedHref);

//     window.dispatchEvent(new Event('click', mockEvent));

//     expect(mockEvent.preventDefault).toHaveBeenCalled();
//     expect(originalUrlWithCookieConsent).toHaveBeenCalledWith(mockHref);
//     expect(window.location.href).toBe(mockModifiedHref);
//   });

//   test('should not prevent default or update window location href if shouldPropagateConsent is false', () => {
//     const mockHref = 'http://wwwnhsuk.azurewebsites.net/page';
//     const mockTarget = {
//       getAttribute: jest.fn().mockReturnValue(mockHref),
//     };
//     const mockEvent = {
//       target: mockTarget,
//       preventDefault: jest.fn(),
//     };

//     shouldPropagateConsent = false;
//     allowlist.push('wwwnhsuk.azurewebsites.net');
//     originalHref.mockReturnValue(mockHref);
//     originalLocationHref.mockReturnValue('https://wwwnhsuk.azurewebsites.net');

//     window.dispatchEvent(new Event('click', mockEvent));

//     expect(mockEvent.preventDefault).not.toHaveBeenCalled();
//     expect(originalUrlWithCookieConsent).not.toHaveBeenCalled();
//     expect(window.location.href).not.toBeDefined();
//   });

//   test('should not prevent default or update window location href if href is not in allowlist', () => {
//     const mockHref = 'https://wwwnhsuk.azurewebsites.net/page';
//     const mockTarget = {
//       getAttribute: jest.fn().mockReturnValue(mockHref),
//     };
//     const mockEvent = {
//       target: mockTarget,
//       preventDefault: jest.fn(),
//     };

//     shouldPropagateConsent = true;
//     allowlist.push('wwwnhsuk.azurewebsites.net');
//     originalHref.mockReturnValue(mockHref);
//     originalLocationHref.mockReturnValue('https://wwwnhsuk.azurewebsites.net');

//     window.dispatchEvent(new Event('click', mockEvent));

//     expect(mockEvent.preventDefault).not.toHaveBeenCalled();
//     expect(originalUrlWithCookieConsent).not.toHaveBeenCalled();
//     expect(window.location.href).not.toBeDefined();
//   });
// });