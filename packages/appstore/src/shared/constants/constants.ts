import { IconSymbol } from '@getstation/theme';

export const screenNames = {
  companyApps: 'COMPANY_APPS',
  mostPopulars: 'MOST_POPULAR',
  allApps: 'ALL_APPS',
  onboardEmployees: 'ONBOARD_EMPLOYEES',
  myCustomApps: 'MY_CUSTOM_APPS',
};

export enum screenHash {
  MOST_POPULAR = '#most-popular',
  ALL_APPS = '#all-apps',
  MY_CUSTOM_APPS = '#custom-apps',
}

export const customAppsCategories = {
  privateApps: 'My Private Apps',
  companyApps: 'Company Apps',
};

export const customAppsMode = {
  createMode: 'CREATE_MODE',
  editMode: 'EDIT_MODE',
};

export enum AppDataValidationErrors {
  AppName = 'Enter an app name',
  AppColor = 'Missing or invalid icon color',
  AppLogo = 'Missing or invalid logo url',
  AppUrl = 'Missing or invalid signin url',
}

export const minAppNameLength = 2;

export const allAppsCategoriesList = [
  {
    title: 'Messaging & Communication',
    icon: IconSymbol.CHAT,
  },
  {
    title: 'AI Assistants',
    icon: IconSymbol.FOCUS,
  },
  {
    title: 'Email',
    icon: IconSymbol.AT,
  },
  {
    title: 'Calendar & Scheduling',
    icon: IconSymbol.TIME,
  },
  {
    title: 'Tasks & Projects',
    icon: IconSymbol.CHECKMARK,
  },
  {
    title: 'Notes & Knowledge',
    icon: IconSymbol.DOC,
  },
  {
    title: 'Video Meetings',
    icon: IconSymbol.JOIN,
  },
  {
    title: 'Miscellaneous',
    icon: IconSymbol.APPS,
  },
];

export const applicationsLimit = 200;

export const animStylesData = {
  translateRight: '125%',
  translateLeft: '-125%',
  transitionTime: '.5s',
};

export const svgIconsURLs = Array.from(
  { length: 56 },
  (_, index) => `platform://appstore/static/custom-app-icons/icon-simple-${index + 1}.svg`,
);
