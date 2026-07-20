export const GOOGLE_ACCOUNTS_ORIGIN = 'https://accounts.google.com/';
export const GMAIL_ACCOUNT_CHOOSER_URL =
  'https://accounts.google.com/AccountChooser?service=mail&continue=https://mail.google.com/mail/';

export const isGoogleAccountsUrl = (url: string): boolean =>
  url.startsWith(GOOGLE_ACCOUNTS_ORIGIN);

export const isGmailLandingPage = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'www.google.com'
      && parsedUrl.pathname.includes('/gmail/about/');
  } catch (_error) {
    return false;
  }
};

export const withoutChromeVersion = (userAgent: string): string =>
  userAgent.replace(/Chrome\/[\d.]+/, 'Chrome');
