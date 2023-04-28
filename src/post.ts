import { Response, acquireNewId, getFolder, hashPassword, parseFileToData, response } from './common';
import { checkRecaptcha } from './recaptcha';
import { Data, deleteDataSchema, newDataSchema, updateDataSchema } from './schema';

export default function doPostImpl(e: GoogleAppsScript.Events.DoPost): Response {
  if (!checkRecaptcha(e)) {
    return response({ success: false, message: 'Recaptcha failed.' });
  }
  const mode = getMode(e.parameter.mode);
  switch (mode) {
    case 'create':
      return createItem(e);
    case 'update':
      return updateItem(e);
    case 'delete':
      return deleteItem(e);
  }
}

const MODE_LIST = ['create', 'update', 'delete'] as const;
type Mode = (typeof MODE_LIST)[number];

function isMode(mode: string | undefined): mode is Mode {
  return MODE_LIST.includes(mode as Mode);
}

function getMode(mode: string | undefined): Mode {
  if (isMode(mode)) {
    return mode;
  }
  return 'create';
}

function createItem(e: GoogleAppsScript.Events.DoPost): Response {
  const folder = getFolder();
  if (!folder) {
    return response({ success: false, message: 'Folder not found' });
  }
  const rawJson = e.parameter.data;
  if (!rawJson) {
    return response({ success: false, message: 'Data not found' });
  }
  try {
    const baseData = newDataSchema.parse(JSON.parse(rawJson));
    const id = acquireNewId(folder);
    const date = Utilities.formatDate(new Date(), 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ss'+09:00'");
    const password = baseData.password ? hashPassword(baseData.password) : undefined;
    const data: Data = { ...baseData, id, createdAt: date, updatedAt: date, password };
    try {
      const json = JSON.stringify(data);
      if (Utilities.newBlob(json).getBytes().length > 1024 * 1024) {
        return response({ success: false, message: 'Data is too large' });
      }
      folder.createFile(`${id}.json`, json, 'application/json');
      return response({ success: true, id });
    } catch (e) {
      return response({ success: false, message: `Failed to create file ${e}` });
    }
  } catch (e) {
    return response({ success: false, message: `Failed to parse data ${e}` });
  }
}

function updateItem(e: GoogleAppsScript.Events.DoPost): Response {
  const folder = getFolder();
  if (!folder) {
    return response({ success: false, message: 'Folder not found' });
  }
  const rawJson = e.parameter.data;
  if (!rawJson) {
    return response({ success: false, message: 'Data not found' });
  }
  try {
    const baseData = updateDataSchema.parse(JSON.parse(rawJson));
    const id = baseData.id;
    const file = folder.getFilesByName(`${id}.json`);
    if (!file.hasNext()) {
      return response({ success: false, message: 'File not found' });
    }
    const oldFile = file.next();
    const oldData = parseFileToData(oldFile);
    if (!oldData) {
      return response({ success: false, message: 'Failed to parse old data' });
    }
    const hashedNewPassword = baseData.password ? hashPassword(baseData.password) : undefined;
    const checkPassword = !oldData.password || oldData.password === hashedNewPassword;
    if (!checkPassword) {
      return response({ success: false, message: 'Password is incorrect' });
    }
    const date = Utilities.formatDate(new Date(), 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ss'+09:00'");
    const data: Data = { ...baseData, createdAt: oldData.createdAt, updatedAt: date, password: hashedNewPassword };
    try {
      const json = JSON.stringify(data);
      if (Utilities.newBlob(json).getBytes().length > 1024 * 1024) {
        return response({ success: false, message: 'Data is too large' });
      }
      oldFile.setContent(json);
      return response({ success: true, id });
    } catch (e) {
      return response({ success: false, message: `Failed to update file ${e}` });
    }
  } catch (e) {
    return response({ success: false, message: `Failed to parse data ${e}` });
  }
}

function deleteItem(e: GoogleAppsScript.Events.DoPost): Response {
  const folder = getFolder();
  if (!folder) {
    return response({ success: false, message: 'Folder not found' });
  }
  const rawJson = e.parameter.data;
  if (!rawJson) {
    return response({ success: false, message: 'Data not found' });
  }
  try {
    const deleteData = deleteDataSchema.parse(JSON.parse(rawJson));
    const id = deleteData.id;
    const file = folder.getFilesByName(`${id}.json`);
    if (!file.hasNext()) {
      return response({ success: false, message: 'File not found' });
    }
    const oldFile = file.next();
    const oldData = parseFileToData(oldFile);
    if (!oldData) {
      return response({ success: false, message: 'Failed to parse old data' });
    }
    const hashedNewPassword = deleteData.password ? hashPassword(deleteData.password) : undefined;
    const checkPassword = !oldData.password || oldData.password === hashedNewPassword;
    if (!checkPassword) {
      return response({ success: false, message: 'Password is incorrect' });
    }
    try {
      folder.removeFile(oldFile);
      return response({ success: true, id });
    } catch (e) {
      return response({ success: false, message: `Failed to delete file ${e}` });
    }
  } catch (e) {
    return response({ success: false, message: `Failed to parse data ${e}` });
  }
}
