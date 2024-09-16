import { 
  base as baseCommon, 
  mainnet as mainnetCommon, 
  optimism as optimismCommon,
  arbitrum as arbitrumCommon,
  zora as zoraCommon,
  polygon as polygonCommon, 
  redstone as redstoneCommon, 
  sepolia as sepoliaCommon,
 } from "tevm/common";
import { Storage } from "./Storage";
import { createTevmNode, http } from 'tevm'
import type { Common } from 'tevm/common'

export type SupportedNetwork = 'mainnet' | 'optimism' | 'base' | 'arbitrum' | 'zora' | 'polygon' | 'redstone'


/**
 * Tevm node eagerly instanciates tevm nodes for the three networks
 * It lazy loads the tevm library for optimial code splitting
 */
export class Nodes {
  // We choose to lazy load tevm to optimize first load
  public static lazyLoadedTevmNode = async (rpcUrl: string, common: Common) => {
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
    public arbitrum = {
      common: arbitrumCommon,
      lazyLoadedNode: Nodes.lazyLoadedTevmNode(storage.getStoredUrl('arbitrum'), arbitrumCommon),
    },
    public zora = {
      common: zoraCommon,
      lazyLoadedNode: Nodes.lazyLoadedTevmNode(storage.getStoredUrl('zora'), zoraCommon),
    },
    public polygon = {
      common: polygonCommon,
      lazyLoadedNode: Nodes.lazyLoadedTevmNode(storage.getStoredUrl('polygon'), polygonCommon),
    },
    public redstone = {
      common: redstoneCommon,
      lazyLoadedNode: Nodes.lazyLoadedTevmNode(storage.getStoredUrl('redstone'), redstoneCommon),
    },
    public sepolia = {
      common: sepoliaCommon,
      lazyLoadedNode: Nodes.lazyLoadedTevmNode(storage.getStoredUrl('sepolia'), sepoliaCommon),
    },
  ) { }

};
