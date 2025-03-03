# Uniswap v4 Pool Indexer

A [Ponder](https://ponder.sh) indexer that tracks Uniswap v4 pool deployments across multiple networks. This indexer monitors the `Initialize` event from the PoolManager contract to track new pool creations and their parameters, and also indexes ERC20 token metadata.

## Features

- Multi-chain indexing support for 8 networks
- Real-time pool deployment tracking
- Token metadata indexing (name, symbol, decimals)
- Swap transaction tracking
- GraphQL API for easy data access
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
# or
pnpm install
```

3. Configure environment variables:
   Create a `.env.local` file with RPC URLs for the networks you want to index:

```env
PONDER_RPC_URL_1=<ethereum-mainnet-rpc-url>
PONDER_RPC_URL_42161=<arbitrum-rpc-url>
PONDER_RPC_URL_10=<optimism-rpc-url>
PONDER_RPC_URL_8453=<base-rpc-url>
PONDER_RPC_URL_137=<polygon-rpc-url>
PONDER_RPC_URL_130=<unichain-rpc-url>
PONDER_RPC_URL_480=<worldchain-rpc-url>
PONDER_RPC_URL_81457=<blast-rpc-url>

PONDER_RPC_URL_11155111=<sepolia-rpc-url>
PONDER_RPC_URL_1301=<unichain-sepolia-rpc-url>
PONDER_RPC_URL_84532=<base-sepolia-rpc-url>
PONDER_RPC_URL_421614=<arbitrum-sepolia-rpc-url>
```

4. Start the indexer:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Schema

The indexer uses the following tables:

### Token Table

```typescript
token = onchainTable({
  address: hex        // Token contract address
  chainId: integer    // Chain ID where the token exists
  name: text          // Token name
  symbol: text        // Token symbol
  decimals: integer   // Token decimals
})
```

### Pool Table

```typescript
pool = onchainTable({
  poolId: hex         // Unique identifier for the pool
  currency0: hex      // Address of the first token
  currency1: hex      // Address of the second token
  fee: integer        // Pool fee tier
  tickSpacing: integer // Tick spacing for the pool
  hooks: hex          // Address of the hooks contract
  chainId: integer    // Chain ID where the pool is deployed
})
```

### Swap Table

```typescript
swap = onchainTable({
  id: text            // Unique swap identifier
  poolId: hex         // Pool ID
  sender: hex         // Address that initiated the swap
  amount0: bigint     // Amount of token0 swapped
  amount1: bigint     // Amount of token1 swapped
  sqrtPriceX96: bigint // Price after swap
  liquidity: bigint   // Current pool liquidity
  tick: integer       // Current pool tick
  fee: integer        // Swap fee
  chainId: integer    // Chain ID where the swap occurred
})
```

The tables use composite primary keys to uniquely identify entries across different networks.

## API Endpoints

The indexer provides GraphQL API access to all indexed data:

### GraphQL API

- `/graphql` - GraphQL endpoint for custom queries

Example queries:

```graphql
# Get pools with their token information
query {
  pools(first: 10) {
    poolId
    chainId
    fee
    token0 {
      address
      name
      symbol
      decimals
    }
    token1 {
      address
      name
      symbol
      decimals
    }
  }
}

# Get tokens with their pools
query {
  tokens(where: {symbol: {contains: "ETH"}}) {
    address
    name
    symbol
    decimals
    chainId
    poolsAsToken0 {
      poolId
    }
    poolsAsToken1 {
      poolId
    }
  }
}

# Get swaps for a specific pool
query {
  swaps(where: {poolId: "0x....", chainId: 1}) {
    id
    sender
    amount0
    amount1
    sqrtPriceX96
    liquidity
    tick
    pool {
      token0 {
        symbol
      }
      token1 {
        symbol
      }
    }
  }
}
```

## How It Works

The indexer listens for events from the Uniswap v4 PoolManager contract across all configured networks:

1. When an `Initialize` event is detected:
   - Token metadata is fetched and stored
   - Pool data is recorded with its parameters

2. When a `Swap` event is detected:
   - Swap transaction data is recorded
   - Related to the pool via poolId

3. The data is made available via GraphQL API

## Development

The project structure:

```
├── abis/
│   ├── ERC20Abi.ts       # ERC20 token ABI
│   └── PoolManager.ts    # Uniswap v4 PoolManager ABI
├── src/
│   ├── index.ts          # Event handlers
│   └── api/
│       └── index.ts      # GraphQL API configuration
├── ponder.config.ts      # Network and contract configurations
├── ponder.schema.ts      # Database schema definition
└── .env                  # Environment variables
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
