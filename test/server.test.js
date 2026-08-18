const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { app, resetRecords } = require('../index');

let server;
let baseUrl;

before(() => {
  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => server.close());

test('reports service health without provider configuration', async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', ownershipCheck: 'local' });
});

test('returns metadata only to the stored owner in local mode', async () => {
  resetRecords();
  const owner = '0x0000000000000000000000000000000000000001';
  const createResponse = await fetch(`${baseUrl}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenId: '7', owner, url: 'https://example.com/metadata/7' }),
  });

  assert.equal(createResponse.status, 201);

  const ownerResponse = await fetch(`${baseUrl}/viewer?id=7&address=${owner}`);
  assert.equal(ownerResponse.status, 200);
  assert.deepEqual(await ownerResponse.json(), { url: 'https://example.com/metadata/7' });

  const otherResponse = await fetch(
    `${baseUrl}/viewer?id=7&address=0x0000000000000000000000000000000000000002`,
  );
  assert.equal(otherResponse.status, 403);
});

test('rejects malformed item data', async () => {
  const response = await fetch(`${baseUrl}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenId: '7', owner: 'not-an-address', url: 'file:///private' }),
  });

  assert.equal(response.status, 400);
});
