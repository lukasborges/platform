import { getUserAgentForApp } from '../../../src/session';
import {
  isGmailLandingPage,
  isGoogleAccountsUrl,
  withoutChromeVersion,
} from '../../../src/utils/userAgent';

describe('session user agent', () => {
  const currentUserAgent = 'Current-UA';

  it('returns default chromium user-agent for regular https URLs', () => {
    const ua = getUserAgentForApp('https://messages.google.com/web/', currentUserAgent);
    expect(ua).toContain('Mozilla/5.0');
    expect(ua).toContain('Chrome/');
    expect(ua).toContain('Safari/537.36');
  });

  it('returns full user-agent for accounts.google.com', () => {
    const ua = getUserAgentForApp('https://accounts.google.com/ServiceLogin', currentUserAgent);
    expect(ua).toContain('Mozilla/5.0');
    expect(ua).toContain('Chrome/');
    expect(ua).toContain('Safari/537.36');
    expect(ua).not.toContain('Electron/');
    if (process.platform === 'linux') {
      expect(ua).toContain('X11; Linux x86_64');
    }
  });

  it('preserves the chromeless Google authentication user-agent', () => {
    const chromelessUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) Chrome Safari/537.36';
    expect(getUserAgentForApp('https://accounts.google.com/ServiceLogin', chromelessUserAgent))
      .toBe(chromelessUserAgent);
  });

  it('returns current user-agent for file:// URLs', () => {
    expect(getUserAgentForApp('file:///tmp/index.html', currentUserAgent)).toBe(currentUserAgent);
  });

  it('returns current user-agent for localhost URLs', () => {
    expect(getUserAgentForApp('http://localhost:3000', currentUserAgent)).toBe(currentUserAgent);
  });
});

describe('Google authentication navigation', () => {
  it('recognizes Google authentication URLs without matching lookalike hosts', () => {
    expect(isGoogleAccountsUrl('https://accounts.google.com/AccountChooser')).toBe(true);
    expect(isGoogleAccountsUrl('https://accounts.google.com.evil.example/')).toBe(false);
  });

  it('recognizes the Gmail landing page', () => {
    expect(isGmailLandingPage('https://www.google.com/gmail/about/')).toBe(true);
    expect(isGmailLandingPage('https://mail.google.com/mail/')).toBe(false);
  });

  it('removes only the Chrome version token', () => {
    expect(withoutChromeVersion('Mozilla/5.0 Chrome/150.0.7871.114 Safari/537.36'))
      .toBe('Mozilla/5.0 Chrome Safari/537.36');
  });
});
