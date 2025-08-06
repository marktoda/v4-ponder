import { ponder, type Context} from "ponder:registry";
import schema from "ponder:schema";
import { Address, encodePacked, keccak256 } from "viem";

// Define minimal ERC20 ABI
const ERC20_ABI = [
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ type: "string" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ type: "string" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ type: "uint8" }],
    stateMutability: "view"
  }
] as const;

// Helper function to safely fetch token metadata
async function getTokenMetadata(
  context: Context,
  address: Address,
  chainId: number
) {
  // Special case for address(0) which represents native ETH
  if (address === "0x0000000000000000000000000000000000000000") {
    return { name: "Ethereum", symbol: "ETH", decimals: 18 };
  }

  try {
    // Fetch token metadata
    const [name, symbol, decimals] = await Promise.all([
      context.client.readContract({
        abi: ERC20_ABI,
        address,
        functionName: "name",
      }),
      context.client.readContract({
        abi: ERC20_ABI,
        address,
        functionName: "symbol",
      }),
      context.client.readContract({
        abi: ERC20_ABI,
        address,
        functionName: "decimals",
      }),
    ]);

    return { name, symbol, decimals };
  } catch (error) {
    console.error(`Failed to get metadata for token ${address} on chain ${chainId}:`, error);
    // Return fallback values if token metadata cannot be fetched
    return { name: "Unknown Token", symbol: "UNKNOWN", decimals: 18 };
  }
}

// Index token metadata
async function indexToken(
  context: Context,
  address: Address,
  chainId: number,
  creationBlock: number
) {
  // Check if token already exists in database
  const existingToken = await context.db.find(schema.token, {
    address,
    chainId
  });

  // If token already exists, no need to fetch metadata again
  if (existingToken) {
    return;
  }

  // Get token metadata
  const { name, symbol, decimals } = await getTokenMetadata(context, address, chainId);

  // Save token to database
  await context.db.insert(schema.token).values({
    address,
    chainId,
    name,
    symbol,
    decimals,
    creationBlock
  });
}

ponder.on("PoolManager:Initialize", async ({ event, context }) => {
  const chainId = context.chain.id;

  // Index the tokens first
  await Promise.all([
    indexToken(context, event.args.currency0, chainId, Number(event.block.number)),
    indexToken(context, event.args.currency1, chainId, Number(event.block.number)),
  ]);

  // Index pool
  await context.db.insert(schema.pool).values({
    poolId: event.args.id,
    currency0: event.args.currency0,
    currency1: event.args.currency1,
    fee: event.args.fee,
    tickSpacing: event.args.tickSpacing,
    hooks: event.args.hooks,
    chainId,
    creationBlock: Number(event.block.number),
  });
});

ponder.on("PoolManager:Swap", async ({ event, context }) => {
  await context.db.insert(schema.swap).values({
    id: event.id,
    poolId: event.args.id,
    sender: event.args.sender,
    amount0: event.args.amount0,
    amount1: event.args.amount1,
    sqrtPriceX96: event.args.sqrtPriceX96,
    liquidity: event.args.liquidity,
    tick: event.args.tick,
    fee: event.args.fee,
    chainId: context.chain.id,
    blockNumber: event.block.number,
  });
});

ponder.on("PoolManager:ModifyLiquidity", async ({ event, context }) => {
  // determine the positionId, the same hash used by PoolManager / Position.sol
  const positionId = keccak256(encodePacked(["address", "int24", "int24", "bytes32"], [event.args.sender, event.args.tickLower, event.args.tickUpper, event.args.salt]));

  // upsert into `position` table
  // for cases where the position exists, update the position's liquidity according to the event
  await context.db.insert(schema.position).values({
    positionId: positionId,
    poolId: event.args.id,
    owner: event.args.sender,
    tickLower: BigInt(event.args.tickLower),
    tickUpper: BigInt(event.args.tickUpper),
    liquidity: event.args.liquidityDelta,
    salt: event.args.salt,
    chainId: context.chain.id,
  }).onConflictDoUpdate((row) => ({ liquidity: row.liquidity + event.args.liquidityDelta }));
});
