import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import { encodePacked, keccak256 } from "viem";

ponder.on("PoolManager:Initialize", async ({ event, context }) => {
  await context.db.insert(schema.pool).values({
    poolId: event.args.id,
    currency0: event.args.currency0,
    currency1: event.args.currency1,
    fee: event.args.fee,
    tickSpacing: event.args.tickSpacing,
    hooks: event.args.hooks,
    chainId: context.network.chainId,
  });
});

ponder.on("PoolManager:Swap", async ({ event, context }) => {
  await context.db.insert(schema.swap).values({
    id: event.log.id,
    poolId: event.args.id,
    sender: event.args.sender,
    amount0: event.args.amount0,
    amount1: event.args.amount1,
    sqrtPriceX96: event.args.sqrtPriceX96,
    liquidity: event.args.liquidity,
    tick: event.args.tick,
    fee: event.args.fee,
    chainId: context.network.chainId,
  });
});

ponder.on("PoolManager:ModifyLiquidity", async ({ event, context }) => {
  const positionId = keccak256(encodePacked([event.args.sender, event.args.tickLower, event.args.tickUpper, event.args.salt], ["address", "int24", "int24", "bytes32"]));

  await context.db.insert(schema.position).values({
    positionId: positionId,
    poolId: event.args.id,
    owner: event.args.sender,
    tickLower: BigInt(event.args.tickLower),
    tickUpper: BigInt(event.args.tickUpper),
    liquidity: event.args.liquidityDelta,
    salt: event.args.salt,
    chainId: context.network.chainId,
  }).onConflictDoUpdate((row) => ({ liquidity: row.liquidity + event.args.liquidityDelta }));
});
