import { base as baseCommon, mainnet as mainnetCommon, optimism as optimismCommon } from "tevm/common";
import { Storage } from "./Storage";
import { Common } from 'tevm/common'

export type SupportedNetwork = 'mainnet' | 'optimism' | 'base'


/**
 * Tevm node eagerly instanciates tevm nodes for the three networks
 * It lazy loads the tevm library for optimial code splitting
 */
export class Nodes {
  // We choose to lazy load tevm to optimize first load
  public static lazyLoadedTevmNode = async (rpcUrl: string, common: Common) => {
    const { createTevmNode, http } = await import('tevm')
    return createTevmNode({
      common,
      fork: {
        transport: http(rpcUrl)({})
      }
    })
  }

  constructor(
    storage: Storage,
    public network: SupportedNetwork = 'mainnet',
    public mainnet = {
      common: mainnetCommon,
      lazyLoadedNode: Nodes.lazyLoadedTevmNode(storage.getStoredUrl('mainnet'), mainnetCommon),
    },
    public optimism = {
      common: optimismCommon,
      lazyLoadedNode: Nodes.lazyLoadedTevmNode(storage.getStoredUrl('optimism'), optimismCommon),
    },
    public base = {
      common: baseCommon,
      lazyLoadedNode: Nodes.lazyLoadedTevmNode(storage.getStoredUrl('base'), baseCommon),
    },
  ) { }

};
