import { Platform } from 'react-native';

export const HEADER_TITLE = 'Stallion';
export const HEADER_SLAB_HEIGHT = 50;
export const STD_MARGIN = HEADER_SLAB_HEIGHT / 5;

export const CLOSE_BUTTON_TEXT = 'close';
export const BACK_BUTTON_TEXT = 'back';
export const DOWNLOAD_BUTTON_TEXT = 'DOWNLOAD';

export const FOOTER_INFO_TITLE = 'Active Bucket: ';
export const FOOTER_INFO_SUBTITLE = 'Version: ';
export enum SWITCH_TEXTS {
  ON = 'ON',
  OFF = 'OFF',
}

export const SWITCH_TITLE = 'Switch ';
export const BUCKET_CARD_UPDATED_TEXT = 'Updated at: ';
export const BUCKET_CARD_BUNDLE_COUNT_TEXT = 'Bundles: ';
export const BUCKET_CARD_AUTHOR_TEXT = 'Author: ';

export const DOWNLOAD_PROGRESS_EVENT = 'StallionDownloadProgress';

export const DEFAULT_ERROR_MESSAGE =
  'Something went wrong. Check your network connection';
export const EMPTY_ERROR_MESSAGE = 'No items found';
export const EMPTY_ERROR_MESSAGE_BUNDLE = 'No bundles found';
export const DEFAULT_ERROR_PREFIX = 'Error: ';
export const NO_AUTH_ERROR_MESSAGE =
  'Problem in initialising Stallion native SDK. Verify that auth keys are configured correctly on native and that stallion SDK is correctly installed and enabled';

export const VERSION_PREFIX = 'V';

export const IS_ANDROID = Platform.OS === 'android';

export enum CARD_TYPES {
  BUNDLE = 'BUNDLE',
  BUCKET = 'BUCKET',
}

export const BUNDLE_APPLIED_TEXT = 'Applied';
export const DOWNLOADING_TEXT = 'Downloading';
