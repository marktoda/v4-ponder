import { createConfig } from "ponder";

import { PoolManagerAbi } from "./abis/PoolManager";

export default createConfig({
  ordering: "multichain",
  database: {
    kind: "pglite",
    directory: "./.ponder/pglite",
  },
  chains: {
    // mainnet: {
    //   id: 1,
    //   rpc: (process.env.PONDER_RPC_URL_1),
    // },
    // unichain: {
    //   id: 130,
    //   rpc: (process.env.PONDER_RPC_URL_130),
    // },
    // arbitrum: {
    //   id: 42161,
    //   rpc: (process.env.PONDER_RPC_URL_42161),
    // },
    // optimism: {
    //   id: 10,
    //   rpc: (process.env.PONDER_RPC_URL_10),
    // },
    base: {
      id: 8453,
      rpc: (process.env.PONDER_RPC_URL_8453),
    },
    // polygon: {
    //   id: 137,
    //   rpc: (process.env.PONDER_RPC_URL_137),
    // },
    // worldchain: {
    //   id: 480,
    //   rpc: (process.env.PONDER_RPC_URL_480),
    // },
    // blast: {
    //   id: 81457,
    //   rpc: (process.env.PONDER_RPC_URL_81457),
    // },
    //
    // // Sepolia Networks
    // ethereum_sepolia: {
    //   id: 11155111,
    //   rpc: (process.env.PONDER_RPC_URL_11155111),
    // },
    // unichain_sepolia: {
    //   id: 1301,
    //   rpc: (process.env.PONDER_RPC_URL_1301),
    // },
    // base_sepolia: {
    //   id: 84532,
    //   rpc: (process.env.PONDER_RPC_URL_84532),
    // },
    // arbitrum_sepolia: {
    //   id: 421614,
    //   rpc: (process.env.PONDER_RPC_URL_421614),
    // },
  },
  contracts: {
    PoolManager: {
      chain: {
        // mainnet: {
        //   address: "0x000000000004444c5dc75cb358380d2e3de08a90",
        //   startBlock: 21688329
        // },
        // unichain: {
        //   address: "0x1f98400000000000000000000000000000000004",
        //   startBlock: 0
        // },
        // arbitrum: {
        //   address: "0x360e68faccca8ca495c1b759fd9eee466db9fb32",
        //   startBlock: 297842872,
        // },
        // optimism: {
        //   address: "0x9a13f98cb987694c9f086b1f5eb990eea8264ec3",
        //   startBlock: 130947675,
        // },
        base: {
          address: "0x498581ff718922c3f8e6a244956af099b2652b2b",
          startBlock: 25350988,
        },
        // polygon: {
        //   address: "0x67366782805870060151383f4bbff9dab53e5cd6",
        //   startBlock: 66980384,
        // },
        // worldchain: {
        //   address: "0xb1860d529182ac3bc1f51fa2abd56662b7d13f33",
        //   startBlock: 9111872,
        // },
        // blast: {
        //   address: "0x1631559198a9e474033433b2958dabc135ab6446",
        //   startBlock: 14377311,
        // },
        // ethereum_sepolia: {
        //   address: "0xE03A1074c86CFeDd5C142C4F04F1a1536e203543",
        //   startBlock: 7258946
        // },
        // unichain_sepolia: {
        //   address: "0x00B036B58a818B1BC34d502D3fE730Db729e62AC",
        //   startBlock: 7092034
        // },
        // base_sepolia: {
        //   address: "0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408",
        //   startBlock: 19088197,
        // },
        // arbitrum_sepolia: {
        //   address: "0xFB3e0C6F74eB1a21CC1Da29aeC80D2Dfe6C9a317",
        //   startBlock: 105909222,
        // }
      },
      abi: PoolManagerAbi,
    },
  },
});
