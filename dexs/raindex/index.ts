import { getEventLogs } from "@defillama/sdk";
import { BaseAdapter, BreakdownAdapter, FetchV2, } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";

const orderbooks: Record<string, { address: string, sg: string, start: number }> = {
    arbitrum: {
      address: "0x550878091b2b1506069f61ae59e3a5484bca9166",
      sg: "https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/ob4-arbitrum/0.1/gn",
      start: 0,
    },
    base: {
      address: "0xd2938e7c9fe3597f78832ce780feb61945c377d7",
      sg: "https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/ob4-base/0.7/gn",
      start: 0,
    },
    bsc: {
      address: "0xd2938e7c9fe3597f78832ce780feb61945c377d7",
      sg: "https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/ob4-bsc/0.1/gn",
      start: 0,
    },
    flare: {
      address: "0xcee8cd002f151a536394e564b84076c41bbbcd4d",
      sg: "https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/ob4-flare/0.2/gn",
      start: 0,
    },
    linea: {
      address: "0x22410e2a46261a1b1e3899a072f303022801c764",
      sg: "https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/ob4-linea/0.1/gn",
      start: 0,
    },
    polygon: {
      address: "0x7d2f700b1f6fd75734824ea4578960747bdf269a",
      sg: "https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/ob4-polygon/0.4/gn",
      start: 0,
    },
  }
const TakeOrderV2Abi = {
        "type": "event",
        "name": "TakeOrderV2",
        "inputs": [
          {
            "name": "sender",
            "type": "address",
            "indexed": false,
            "internalType": "address"
          },
          {
            "name": "config",
            "type": "tuple",
            "indexed": false,
            "internalType": "struct TakeOrderConfigV3",
            "components": [
              {
                "name": "order",
                "type": "tuple",
                "internalType": "struct OrderV3",
                "components": [
                  {
                    "name": "owner",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "evaluable",
                    "type": "tuple",
                    "internalType": "struct EvaluableV3",
                    "components": [
                      {
                        "name": "interpreter",
                        "type": "address",
                        "internalType": "contract IInterpreterV3"
                      },
                      {
                        "name": "store",
                        "type": "address",
                        "internalType": "contract IInterpreterStoreV2"
                      },
                      {
                        "name": "bytecode",
                        "type": "bytes",
                        "internalType": "bytes"
                      }
                    ]
                  },
                  {
                    "name": "validInputs",
                    "type": "tuple[]",
                    "internalType": "struct IO[]",
                    "components": [
                      {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                      },
                      {
                        "name": "decimals",
                        "type": "uint8",
                        "internalType": "uint8"
                      },
                      {
                        "name": "vaultId",
                        "type": "uint256",
                        "internalType": "uint256"
                      }
                    ]
                  },
                  {
                    "name": "validOutputs",
                    "type": "tuple[]",
                    "internalType": "struct IO[]",
                    "components": [
                      {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                      },
                      {
                        "name": "decimals",
                        "type": "uint8",
                        "internalType": "uint8"
                      },
                      {
                        "name": "vaultId",
                        "type": "uint256",
                        "internalType": "uint256"
                      }
                    ]
                  },
                  {
                    "name": "nonce",
                    "type": "bytes32",
                    "internalType": "bytes32"
                  }
                ]
              },
              {
                "name": "inputIOIndex",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "outputIOIndex",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "signedContext",
                "type": "tuple[]",
                "internalType": "struct SignedContextV1[]",
                "components": [
                  {
                    "name": "signer",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "context",
                    "type": "uint256[]",
                    "internalType": "uint256[]"
                  },
                  {
                    "name": "signature",
                    "type": "bytes",
                    "internalType": "bytes"
                  }
                ]
              }
            ]
          },
          {
            "name": "input",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
          },
          {
            "name": "output",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
          }
        ],
        "anonymous": false
      };

const abi = {
  "ClearV2": "event ClearV2(address sender, (address owner, (address interpreter, address store, bytes bytecode) evaluable, (address token, uint8 decimals, uint256 vaultId)[] validInputs, (address token, uint8 decimals, uint256 vaultId)[] validOutputs, bytes32 nonce) alice, (address owner, (address interpreter, address store, bytes bytecode) evaluable, (address token, uint8 decimals, uint256 vaultId)[] validInputs, (address token, uint8 decimals, uint256 vaultId)[] validOutputs, bytes32 nonce) bob, (uint256 aliceInputIOIndex, uint256 aliceOutputIOIndex, uint256 bobInputIOIndex, uint256 bobOutputIOIndex, uint256 aliceBountyVaultId, uint256 bobBountyVaultId) clearConfig)",
  "AfterClear": "event AfterClear(address sender, (uint256 aliceOutput, uint256 bobOutput, uint256 aliceInput, uint256 bobInput) clearStateChange)",
  "TakeOrderV2": "event TakeOrderV2(address sender, ((address owner, (address interpreter, address store, bytes bytecode) evaluable, (address token, uint8 decimals, uint256 vaultId)[] validInputs, (address token, uint8 decimals, uint256 vaultId)[] validOutputs, bytes32 nonce) order, uint256 inputIOIndex, uint256 outputIOIndex, (address signer, uint256[] context, bytes signature)[] signedContext) config, uint256 input, uint256 output)",
  "Conext": "Context (address sender, uint256[][] context)"
}


const fetchRFQ: FetchV2 = async ({ getLogs, chain, createBalances, api, fromTimestamp, toTimestamp }) => {
  const dailyVolume = createBalances()

  // TakeOrderV2 and Context events happen on same tx, want both of them for txs across some timespan, like:
  //   [
  //     tx1
  //     [
  //         "TakeOrderV2-event",
  //         "Conetxt-event"
  //     ],
  //     tx2
  //     [
  //         "TakeOrderV2-event",
  //         "Conetxt-event"
  //     ]
  //   ]
  // const logs = await getLogs({ target: orderbooks[chain].address, eventAbi: abi.TakeOrderV2, entireLog: true })
  const logs = await api.getLogs({ fromTimestamp, toTimestamp, eventAbi: TakeOrderV2Abi, entireLog: true })
  console.log(logs);

  // add vol
  // logs.forEach(log => dailyVolume.add("", ""))
  return { dailyVolume }
}


const adapter1: BaseAdapter = {}
adapter1["base"] = { fetch: fetchRFQ, start: 0, }
const adapter = {
//   breakdown: {
//     "0x RFQ": adaptersRFQ,
//     // "0x OTC": adaptersOTC,
//     // "0x ERC1155": adaptersERC1155,
//     // "0x ERC721": adaptersERC721,
//     // "0x Limit": adaptersERCLimit,
//   },
adapter: adapter1,
  version: 2
}

export default adapter;