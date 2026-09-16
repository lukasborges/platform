export const isDownloadingUpdate = state => state.getIn(['auto_update', 'downloadingUpdate'], false);
export const isUpdateAvailable = state => state.getIn(['auto_update', 'updateAvailable'], false);
export const isUpdateDownloaded = state => state.getIn(['auto_update', 'updateDownloaded'], false);
export const isCheckingUpdate = state => state.getIn(['auto_update', 'checking'], false);
export const getReleaseName = state => state.getIn(['auto_update', 'releaseName']);
export const getDownloadProgress = state => state.getIn(['auto_update', 'downloadProgress'], null);
export const isSubdockOpen = state => state.getIn(['auto_update', 'isVisible']);
