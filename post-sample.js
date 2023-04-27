async function postMessage(url, record) {
  const data = {};
  data.method = 'POST';
  data.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const params = new URLSearchParams();
  params.append('data', JSON.stringify(record));
  params.append('mode', 'create');
  data.body = params;
  const res = await fetch(url, data).catch((e) => console.error(e));
  const json = await res.json();
  return json;
}

var url =
  'https://script.google.com/macros/s/AKfycbw361ZisD3rmczmabIZ6Ev-Dun6I23CtROhJux_YVuyhNnCBVxTZFuDuIBRDNgl-KZh-Q/exec';
var record = {
  type: 'plain',
  system: 'GranCrest',
  name: 'Foo Bar',
  user: 'reism',
  tags: ['tagA', 'tagB'],
  content: {
    hello: 'world!',
  },
};

postMessage(url, record).then((json) => console.log(json));
