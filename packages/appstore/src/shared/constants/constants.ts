export const screenNames = {
  companyApps: 'COMPANY_APPS',
  mostPopulars: 'MOST_POPULAR',
  allApps: 'ALL_APPS',
  boostedApps: 'BOOSTED_APPS',
  onboardEmployees: 'ONBOARD_EMPLOYEES',
  myCustomApps: 'MY_CUSTOM_APPS',
};

export enum screenHash {
  MOST_POPULAR = '#most-popular',
  ALL_APPS = '#all-apps',
  BOOSTED_APPS = '#boosted-apps',
  MY_CUSTOM_APPS = '#custom-apps',
}

export const boostedTypes = {
  unifiedSearch: {
    title: 'Unified Search',
    value: 'unified-search',
  },
  notificationBadge: {
    title: 'Notification Badge',
    value: 'notification-badge',
  },
  statusSync: {
    title: 'Status Sync',
    value: 'status-sync',
  },
};

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
    title: 'Accounting & Finance',
    icon: '#i--bank',
  },
  {
    title: 'Admin & Back-office',
    icon: '#i--nas',
  },
  {
    title: 'AI & Assistants',
    icon: '#i--ai',
  },
  {
    title: 'Blogging & Content Creation',
    icon: '#i--google-search',
  },
  {
    title: 'Communication & Collaboration',
    icon: '#i--megaphone',
  },
  {
    title: 'Curation & Sourcing',
    icon: '#i--pie-chart',
  },
  {
    title: 'Design & Creativity',
    icon: '#i--design',
  },
  {
    title: 'Developer Tools',
    icon: '#i--code',
  },
  {
    title: 'HR & Legal',
    icon: '#i--law',
  },
  {
    title: 'Marketing & Analytics',
    icon: '#i--chart',
  },
  {
    title: 'Sales & CRM',
    icon: '#i--filled-filter',
  },
  {
    title: 'Social Media & Advertising',
    icon: '#i--chat',
  },
  {
    title: 'Storage & File-sharing',
    icon: '#i--network-drive',
  },
  {
    title: 'Task & Project Management',
    icon: '#i--survey',
  },
  {
    title: 'User Support & Survey',
    icon: '#i--headset',
  },
  {
    title: 'Miscellaneous',
    icon: '#i--categorize',
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

export const applicationNameMaxWidth = 143;
