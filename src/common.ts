import { dataSchema } from './schema';

export function response(value: unknown) {
  const resData = JSON.stringify(value);
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON).setContent(resData);
  return output;
}

export type Response = ReturnType<typeof response>;

export function getFolder() {
  const folderId = getProperty('FOLDER_ID');
  if (!folderId) {
    return null;
  }
  try {
    return DriveApp.getFolderById(folderId);
  } catch (e) {
    return null;
  }
}
export function getProperty(id: string): string | null {
  return PropertiesService.getScriptProperties().getProperty(id);
}

export function getSingleFile(folder: GoogleAppsScript.Drive.Folder, id: string) {
  const files = folder.getFilesByName(`${id}.json`);
  if (!files.hasNext()) {
    return null;
  }
  const file = files.next();
  return file;
}

export function parseFileToData(file: GoogleAppsScript.Drive.File) {
  const json = file.getBlob().getDataAsString();
  try {
    return dataSchema.parse(JSON.parse(json));
  } catch (e) {
    return null;
  }
}

export function hashPassword(password: string) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_384, password, Utilities.Charset.UTF_8);
  const hash = bytes.map((b) => ('00' + (b & 0xff).toString(16)).slice(-2)).join('');
  return hash;
}
