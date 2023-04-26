import doGetImpl from './get';
import doPostImpl from './post';

function doGet(e: GoogleAppsScript.Events.DoGet) {
  return doGetImpl(e);
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
  return doPostImpl(e);
}
