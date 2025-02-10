import { primaryKey, onchainTable } from "ponder";

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
  })
);
