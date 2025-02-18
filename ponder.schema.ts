import { index, relations, primaryKey, onchainTable } from "ponder";

export const pool = onchainTable("pool", (t) => ({
  poolId: t.hex().notNull(),
  currency0: t.hex().notNull(),
  currency1: t.hex().notNull(),
  fee: t.integer().notNull(),
  tickSpacing: t.integer().notNull(),
  hooks: t.hex().notNull(),
  chainId: t.integer().notNull(),
}),
  (table) => ({
    pk: primaryKey({ columns: [table.poolId, table.chainId] }),
    poolIdIndex: index().on(table.poolId),
<<<<<<< HEAD
    chainIdIndex: index().on(table.chainId)
=======
    chainIdIndex: index().on(table.chainId),
>>>>>>> main
  })
);

export const poolRelations = relations(pool, ({ many }) => ({
  swaps: many(swap),
  positions: many(position),
}));

export const swap = onchainTable("swap", (t) => ({
  id: t.text().primaryKey(),
  poolId: t.hex().notNull(),
  sender: t.hex().notNull(),
  amount0: t.bigint().notNull(),
  amount1: t.bigint().notNull(),
  sqrtPriceX96: t.bigint().notNull(),
  liquidity: t.bigint().notNull(),
  tick: t.integer().notNull(),
  fee: t.integer().notNull(),
  chainId: t.integer().notNull(),
}),
  (table) => ({
    poolIdIndex: index().on(table.poolId),
    senderIndex: index().on(table.sender),
    chainIdIndex: index().on(table.chainId),
    poolIdChainIdIndex: index().on(table.poolId, table.chainId)
  })
);

export const swapRelations = relations(swap, ({ one }) => ({
  pool: one(pool, { fields: [swap.poolId, swap.chainId], references: [pool.poolId, pool.chainId] }),
}));

export const position = onchainTable("position", (t) => ({
  positionId: t.hex().primaryKey(),
  poolId: t.hex().notNull(),
  owner: t.hex().notNull(),
  tickLower: t.bigint().notNull(),
  tickUpper: t.bigint().notNull(),
  liquidity: t.bigint().notNull(),
  salt: t.hex().notNull(),
  chainId: t.integer().notNull(),
}),
  (table) => ({
    poolIdIndex: index().on(table.poolId),
    ownerIndex: index().on(table.owner),
    chainIdIndex: index().on(table.chainId),
    poolIdChainIdIndex: index().on(table.poolId, table.chainId),
  })
);

export const positionRelations = relations(position, ({ one }) => ({
  pool: one(pool, { fields: [position.poolId], references: [pool.poolId] }),
}));
