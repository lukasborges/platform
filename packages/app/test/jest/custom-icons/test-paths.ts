import * as path from 'path';
import {
  customIconCandidates,
  customIconKey,
  customIconPath,
  getSupportedIconExtension,
  validateApplicationId,
} from '../../../src/custom-icons/paths';

describe('custom icon paths', () => {
  test('derives a stable filename without exposing the application id', () => {
    const applicationId = '../../gmail/company';
    const key = customIconKey(applicationId);
    const iconPath = customIconPath('/tmp/platform-profile', applicationId, '.png');

    expect(key).toMatch(/^[a-f0-9]{64}$/);
    expect(path.basename(iconPath)).toBe(`${key}.png`);
    expect(iconPath).not.toContain(applicationId);
    expect(path.dirname(iconPath)).toBe('/tmp/platform-profile/custom-icons');
  });

  test('only creates candidates inside the custom icon directory', () => {
    const directory = path.resolve('/tmp/platform-profile/custom-icons');
    const candidates = customIconCandidates('/tmp/platform-profile', '../unsafe-id');

    expect(candidates.length).toBeGreaterThan(0);
    for (const candidate of candidates) {
      expect(path.dirname(path.resolve(candidate))).toBe(directory);
    }
  });

  test('accepts supported extensions case-insensitively', () => {
    expect(getSupportedIconExtension('/tmp/icon.PNG')).toBe('.png');
    expect(getSupportedIconExtension('/tmp/icon.svg')).toBeNull();
    expect(() => customIconPath('/tmp/profile', 'gmail', '.svg')).toThrow('Unsupported');
  });

  test('rejects invalid application ids', () => {
    expect(() => validateApplicationId('')).toThrow('Invalid application id');
    expect(() => validateApplicationId(null)).toThrow('Invalid application id');
    expect(() => validateApplicationId('a'.repeat(513))).toThrow('Invalid application id');
  });
});
