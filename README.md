# Uniswap v4 Pool Indexer

A [Ponder](https://ponder.sh) indexer that tracks Uniswap v4 pool deployments across multiple networks. This indexer monitors the `Initialize` event from the PoolManager contract to track new pool creations and their parameters.

## Features

- Multi-chain indexing support for 8 networks
- Real-time pool deployment tracking
- Efficient storage with composite primary keys
- Built with Ponder for reliable blockchain data indexing

## Supported Networks

| Network    | Chain ID | Contract Address                           | Start Block |
| ---------- | -------- | ------------------------------------------ | ----------- |
| Ethereum   | 1        | 0x000000000004444c5dc75cb358380d2e3de08a90 | 21688329    |
| Arbitrum   | 42161    | 0x360e68faccca8ca495c1b759fd9eee466db9fb32 | 297842872   |
| Optimism   | 10       | 0x9a13f98cb987694c9f086b1f5eb990eea8264ec3 | 130947675   |
| Base       | 8453     | 0x498581ff718922c3f8e6a244956af099b2652b2b | 25350988    |
| Polygon    | 137      | 0x67366782805870060151383f4bbff9dab53e5cd6 | 66980384    |
| Unichain   | 130      | 0x1f98400000000000000000000000000000000004 | 0           |
| Worldchain | 480      | 0xb1860d529182ac3bc1f51fa2abd56662b7d13f33 | 9111872     |
| Blast      | 81457    | 0x1631559198a9e474033433b2958dabc135ab6446 | 14377311    |

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd v4-ponder
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure environment variables:
   Create a `.env` file with RPC URLs for the networks you want to index:

```env
PONDER_RPC_URL_1=<ethereum-mainnet-rpc-url>
PONDER_RPC_URL_42161=<arbitrum-rpc-url>
PONDER_RPC_URL_10=<optimism-rpc-url>
PONDER_RPC_URL_8453=<base-rpc-url>
PONDER_RPC_URL_137=<polygon-rpc-url>
PONDER_RPC_URL_130=<unichain-rpc-url>
PONDER_RPC_URL_480=<worldchain-rpc-url>
PONDER_RPC_URL_81457=<blast-rpc-url>
```

4. Start the indexer:

```bash
npm run dev
# or
yarn dev
```

## Schema

The indexer uses a single table called `pool` with the following schema:

```typescript
pool = onchainTable({
  poolId: hex        // Unique identifier for the pool
  currency0: hex     // Address of the first token
  currency1: hex     // Address of the second token
  fee: integer       // Pool fee tier
  tickSpacing: integer   // Tick spacing for the pool
  hooks: hex         // Address of the hooks contract
  chainId: integer   // Chain ID where the pool is deployed
})
```

The table uses a composite primary key of `poolId` and `chainId` to uniquely identify pools across different networks.

## How It Works

The indexer listens for the `Initialize` event from the Uniswap v4 PoolManager contract across all configured networks. When a new pool is initialized, it captures:

- The pool's unique identifier
- Both token addresses involved in the pool
- Fee tier configuration
- Tick spacing
- Hooks contract address
- Chain ID for cross-chain identification

## Development

The project structure:

```
├── src/
│   ├── index.ts          # Event handlers
│   └── abis/             # Contract ABIs
├── ponder.config.ts      # Network and contract configurations
├── ponder.schema.ts      # Database schema definition
└── .env                  # Environment variables
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
