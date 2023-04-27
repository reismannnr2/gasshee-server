import { Response, getFolder, getSingleFile, parseFileToData, response } from './common';
import { DataForList, dataSchema } from './schema';

export default function doGetImpl(e: GoogleAppsScript.Events.DoGet) {
  const mode = getMode(e.parameter.mode);
  switch (mode) {
    case 'list':
      return showList(e);
    case 'item':
      return showItem(e);
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

function showList(e: GoogleAppsScript.Events.DoGet): Response {
  const folder = getFolder();
  if (!folder) {
    return response({ success: false, message: 'Folder not found' });
  }
  const files = folder.getFiles();
  const items: DataForList[] = [];
  const tags: string[] = [];
  while (files.hasNext()) {
    const file = files.next();
    const json = file.getBlob().getDataAsString();
    try {
      const parsed = dataSchema.parse(JSON.parse(json));
      if (parsed.parole && parsed.parole !== e.parameter.parole) {
        continue;
      }
      const item = { ...parsed };
      delete item.parole;
      delete item.password;
      delete item.content;
      items.push(parsed);
      tags.push(...parsed.tags);
    } catch (e) {
      continue;
    }
  }
  return response({ success: true, items, tags });
}

function showItem(e: GoogleAppsScript.Events.DoGet): Response {
  const folder = getFolder();
  const id = e.parameter.id;
  if (!folder || !id) {
    return response({ success: false, message: 'Folder or id not found' });
  }
  const file = getSingleFile(folder, id);
  if (!file) {
    return response({ success: false, message: 'File not found' });
  }
  const raw = parseFileToData(file);
  if (!raw) {
    return response({ success: false, message: 'File parse error' });
  }
  const item = { ...raw };
  delete item.parole;
  delete item.password;
  return response({ success: true, item: item });
}
