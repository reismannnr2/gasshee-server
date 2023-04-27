import doGetImpl from './get';
import doPostImpl from './post';

function doGet(e: GoogleAppsScript.Events.DoGet) {
  return doGetImpl(e);
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
  return doPostImpl(e);
}

declare const global: {
  [x: string]: unknown;
};

// For exporting as a entry point
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.doGet = doGet;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.doPost = doPost;
