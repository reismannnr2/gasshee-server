import { getProperty } from './common';

const url = 'https://www.google.com/recaptcha/api/siteverify';

export function checkRecaptcha(e: GoogleAppsScript.Events.DoPost): boolean {
  const secret = getProperty('RECAPTCHA_SECRET');
  if (!secret) {
    // if no secret is set, recaptcha is disabled
    return true;
  }
  const response = e.parameter['g-recaptcha-response'];
  if (!response) {
    return false;
  }
  const payload = {
    secret,
    response,
  };
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    payload: payload,
  };
  const res = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(res.getContentText());
  return json.success;
}
