# NFKeys Backend

NFKeys Backend is a small Express service that protects metadata links behind ERC-721 ownership checks. It is a portfolio exercise in service boundaries, input validation, environment-based provider configuration, and testable HTTP behavior.

## What it does

- Stores metadata records in memory for a local demonstration.
- Registers a record through `POST /items` with a token id, owner address, and metadata URL.
- Verifies the requesting wallet before returning metadata from `GET /viewer?id=…&address=…`.
- Uses an on-chain ownership lookup when provider configuration is available; otherwise it verifies against the local demonstration record.
- Exposes `GET /health` for a simple readiness check.

## Run locally

Requires Node.js 18 or newer.

```bash
npm ci
cp .env.example .env
npm start
```

The service starts on `http://localhost:3030` by default.

Register a local record:

```bash
curl -X POST http://localhost:3030/items \
  -H "Content-Type: application/json" \
  --data '{"tokenId":"7","owner":"0x0000000000000000000000000000000000000001","url":"https://example.com/metadata/7"}'
```

## Provider configuration

Set `INFURA_PROJECT_ID`, `RPC_NETWORK`, and `NFT_CONTRACT_ADDRESS` to enable on-chain ownership checks. Keep `.env` private; the service never needs a wallet private key because it only reads contract state.

## Verify

```bash
npm test
```

## Scope

Records are deliberately in-memory. A production implementation would add durable storage, authenticated record administration, rate limiting, request logging with privacy controls, and contract configuration per deployment.

## License

Released under the [MIT License](LICENSE).
