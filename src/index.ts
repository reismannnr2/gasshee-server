function doGet(e: GoogleAppsScript.Events.DoGet) {
  const mode = getMode(e.parameter.mode);
  switch (mode) {
    case 'list':
      return showList();
    case 'item':
      return showDummy();
  }
}

const MODE_LIST = ['list', 'item'] as const;
type Mode = (typeof MODE_LIST)[number];

function isMode(mode: string | undefined): mode is Mode {
  return MODE_LIST.includes(mode as Mode);
}

function getMode(mode: string | undefined): Mode {
  if (isMode(mode)) {
    return mode;
  }
  return 'item';
}

function response(value: unknown) {
  const resData = JSON.stringify(value);
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON).setContent(resData);
  return output;
}

function showDummy() {
  const resData = JSON.stringify({ message: 'Hello, Clasp!' });
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON).setContent(resData);
}

function showList() {
  const folder = getFolder();
  if (!folder) {
    return response({ success: false, message: 'Folder not found' });
  }
  const files = folder.getFiles();
}

function getProperty(id: string): string | null {
  return PropertiesService.getScriptProperties().getProperty(id);
}

function getFolder() {
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
