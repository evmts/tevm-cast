import type { TevmNode, TevmNodeOptions } from 'tevm';
import type { Address } from 'tevm/address';
import type { Common } from 'tevm/common';

export type SupportedNetwork =
  | "arbitrum"
  | "arbitrumNova"
  | "arbitrumSepolia"
  | "aurora"
  | "auroraTestnet"
  | "avalanche"
  | "base"
  | "baseSepolia"
  | "bearNetworkChainMainnet"
  | "berachainTestnet"
  | "blast"
  | "blastSepolia"
  | "boba"
  | "bsc"
  | "celo"
  | "cronos"
  | "cronosTestnet"
  | "fantom"
  | "filecoin"
  | "gnosis"
  | "harmonyOne"
  | "kava"
  | "kavaTestnet"
  | "linea"
  | "lineaTestnet"
  | "lyra"
  | "mainnet"
  | "manta"
  | "mantle"
  | "metis"
  | "mode"
  | "moonbeam"
  | "moonriver"
  | "opBNB"
  | "optimism"
  | "optimismSepolia"
  | "polygon"
  | "polygonMumbai"
  | "polygonZkEvm"
  | "polygonZkEvmTestnet"
  | "redstone"
  | "scroll"
  | "sepolia"
  | "tevmDefault"
  | "zksync"
  | "zksyncSepolia"
  | "zora"
  | "zoraSepolia"
  | "zoraTestnet";

/**
 * All tevm code other than utilities is lazily imported to prevent unnecessary bundle size
 */
export class LazyTevm {
  public static eagerlyLoad = async () => {
    this.getCommon('mainnet')
    this.getCommon('base')
    this.getCommon('arbitrum')
    this.getCommon('optimism')
    this.getCommon('polygon')
    this.createTevmNode({})
  }

  private static commonMap: Record<SupportedNetwork, () => Promise<Common>> = {
    arbitrum: () => import('./networks/arbitrum').then(module => module.arbitrum),
    arbitrumNova: () => import('./networks/arbitrumNova').then(module => module.arbitrumNova),
    arbitrumSepolia: () => import('./networks/arbitrumSepolia').then(module => module.arbitrumSepolia),
    aurora: () => import('./networks/aurora').then(module => module.aurora),
    auroraTestnet: () => import('./networks/auroraTestnet').then(module => module.auroraTestnet),
    avalanche: () => import('./networks/avalanche').then(module => module.avalanche),
    base: () => import('./networks/base').then(module => module.base),
    baseSepolia: () => import('./networks/baseSepolia').then(module => module.baseSepolia),
    bearNetworkChainMainnet: () => import('./networks/bearNetworkChainMainnet').then(module => module.bearNetworkChainMainnet),
    berachainTestnet: () => import('./networks/berachainTestnet').then(module => module.berachainTestnet),
    blast: () => import('./networks/blast').then(module => module.blast),
    blastSepolia: () => import('./networks/blastSepolia').then(module => module.blastSepolia),
    boba: () => import('./networks/boba').then(module => module.boba),
    bsc: () => import('./networks/bsc').then(module => module.bsc),
    celo: () => import('./networks/celo').then(module => module.celo),
    cronos: () => import('./networks/cronos').then(module => module.cronos),
    cronosTestnet: () => import('./networks/cronosTestnet').then(module => module.cronosTestnet),
    fantom: () => import('./networks/fantom').then(module => module.fantom),
    filecoin: () => import('./networks/filecoin').then(module => module.filecoin),
    gnosis: () => import('./networks/gnosis').then(module => module.gnosis),
    harmonyOne: () => import('./networks/harmonyOne').then(module => module.harmonyOne),
    kava: () => import('./networks/kava').then(module => module.kava),
    kavaTestnet: () => import('./networks/kavaTestnet').then(module => module.kavaTestnet),
    linea: () => import('./networks/linea').then(module => module.linea),
    lineaTestnet: () => import('./networks/lineaTestnet').then(module => module.lineaTestnet),
    lyra: () => import('./networks/lyra').then(module => module.lyra),
    mainnet: () => import('./networks/mainnet').then(module => module.mainnet),
    manta: () => import('./networks/manta').then(module => module.manta),
    mantle: () => import('./networks/mantle').then(module => module.mantle),
    metis: () => import('./networks/metis').then(module => module.metis),
    mode: () => import('./networks/mode').then(module => module.mode),
    moonbeam: () => import('./networks/moonbeam').then(module => module.moonbeam),
    moonriver: () => import('./networks/moonriver').then(module => module.moonriver),
    opBNB: () => import('./networks/opBNB').then(module => module.opBNB),
    optimism: () => import('./networks/optimism').then(module => module.optimism),
    optimismSepolia: () => import('./networks/optimismSepolia').then(module => module.optimismSepolia),
    polygon: () => import('./networks/polygon').then(module => module.polygon),
    polygonMumbai: () => import('./networks/polygonMumbai').then(module => module.polygonMumbai),
    polygonZkEvm: () => import('./networks/polygonZkEvm').then(module => module.polygonZkEvm),
    polygonZkEvmTestnet: () => import('./networks/polygonZkEvmTestnet').then(module => module.polygonZkEvmTestnet),
    redstone: () => import('./networks/redstone').then(module => module.redstone),
    scroll: () => import('./networks/scroll').then(module => module.scroll),
    sepolia: () => import('./networks/sepolia').then(module => module.sepolia),
    tevmDefault: () => import('./networks/tevmDefault').then(module => module.tevmDefault),
    zksync: () => import('./networks/zksync').then(module => module.zksync),
    zksyncSepolia: () => import('./networks/zksyncSepolia').then(module => module.zksyncSepoliaTestnet),
    zora: () => import('./networks/zora').then(module => module.zora),
    zoraSepolia: () => import('./networks/zoraSepolia').then(module => module.zoraSepolia),
    zoraTestnet: () => import('./networks/zoraTestnet').then(module => module.zoraTestnet),
  };

  public static getCommon(network: keyof typeof LazyTevm.commonMap) {
    return LazyTevm.commonMap[network]();
  }

  public static createTevmNode = async (params: TevmNodeOptions): Promise<TevmNode> => {
    const { createTevmNode } = await import('./lazy/createTevmNode')
    return createTevmNode(params) 
  }

  public static http = async (rpcUrl: string) => {
    const { http } = await import('./lazy/http')
    return http(rpcUrl)
  }
  public static createAddress = async (address: Parameters<typeof import('tevm/address').createAddress>[0]): Promise<Address> => {
    const { createAddress } = await import('./lazy/createAddress');
    return createAddress(address);
  }

  public static create2Address = async (
    from: Parameters<typeof import('tevm/address').create2ContractAddress>[0],
    salt: Parameters<typeof import('tevm/address').create2ContractAddress>[1],
    initCodeHash: Parameters<typeof import('tevm/address').create2ContractAddress>[2]
  ): Promise<Address> => {
    const { create2ContractAddress } = await import('./lazy/create2Address');
    return create2ContractAddress(from, salt, initCodeHash);
  }

  public static createContractAddress = async (
    from: Parameters<typeof import('tevm/address').createContractAddress>[0],
    nonce: Parameters<typeof import('tevm/address').createContractAddress>[1]
  ): Promise<Address> => {
    const { createContractAddress } = await import('./lazy/createContractAddress');
    return createContractAddress(from, nonce);
  }
}
