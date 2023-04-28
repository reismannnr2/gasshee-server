async function postMessage(url, record, mode) {
  const data = {};
  data.method = 'POST';
  data.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const params = new URLSearchParams();
  params.append('data', JSON.stringify(record));
  params.append('mode', mode);
  data.body = params;
  const res = await fetch(url, data).catch((e) => console.error(e));
  const json = await res.json();
  return json;
}

var url =
  'https://script.google.com/macros/s/AKfycbwwYNI01G59ZREp3QEntSmJB3jcZIaP6I5qorUZMLnr_CofBMC05KgX85Q_UIVZLOwmew/exec';

var updateRecord = {
  id: 'b470c15c-4914-4916-a6a0-60706b02bf6c',
  type: 'plain',
  system: 'GranCrest',
  name: 'Foo Bar',
  user: 'reism',
  tags: ['tagA', 'tagB'],
  password: 'passw0rd',
  content: {
    hello: 'world!!',
  },
};
var deleteRecord = {
  id: 'b470c15c-4914-4916-a6a0-60706b02bf6c',
  password: 'passw0rd',
};

function getRecord(mode) {
  switch (mode) {
    case 'create': {
      const c = { ...updateRecord };
      delete c.id;
      return c;
    }
    case 'update':
      return updateRecord;
    case 'delete':
      return deleteRecord;
  }
}
const mode = 'create';

postMessage(url, getRecord(mode), mode).then((json) => console.log(json));
