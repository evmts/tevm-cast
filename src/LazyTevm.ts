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
    arbitrum: () => import('tevm/common').then(module => module.arbitrum),
    arbitrumNova: () => import('tevm/common').then(module => module.arbitrumNova),
    arbitrumSepolia: () => import('tevm/common').then(module => module.arbitrumSepolia),
    aurora: () => import('tevm/common').then(module => module.aurora),
    auroraTestnet: () => import('tevm/common').then(module => module.auroraTestnet),
    avalanche: () => import('tevm/common').then(module => module.avalanche),
    base: () => import('tevm/common').then(module => module.base),
    baseSepolia: () => import('tevm/common').then(module => module.baseSepolia),
    bearNetworkChainMainnet: () => import('tevm/common').then(module => module.bearNetworkChainMainnet),
    berachainTestnet: () => import('tevm/common').then(module => module.berachainTestnet),
    blast: () => import('tevm/common').then(module => module.blast),
    blastSepolia: () => import('tevm/common').then(module => module.blastSepolia),
    boba: () => import('tevm/common').then(module => module.boba),
    bsc: () => import('tevm/common').then(module => module.bsc),
    celo: () => import('tevm/common').then(module => module.celo),
    cronos: () => import('tevm/common').then(module => module.cronos),
    cronosTestnet: () => import('tevm/common').then(module => module.cronosTestnet),
    fantom: () => import('tevm/common').then(module => module.fantom),
    filecoin: () => import('tevm/common').then(module => module.filecoin),
    gnosis: () => import('tevm/common').then(module => module.gnosis),
    harmonyOne: () => import('tevm/common').then(module => module.harmonyOne),
    kava: () => import('tevm/common').then(module => module.kava),
    kavaTestnet: () => import('tevm/common').then(module => module.kavaTestnet),
    linea: () => import('tevm/common').then(module => module.linea),
    lineaTestnet: () => import('tevm/common').then(module => module.lineaTestnet),
    lyra: () => import('tevm/common').then(module => module.lyra),
    mainnet: () => import('tevm/common').then(module => module.mainnet),
    manta: () => import('tevm/common').then(module => module.manta),
    mantle: () => import('tevm/common').then(module => module.mantle),
    metis: () => import('tevm/common').then(module => module.metis),
    mode: () => import('tevm/common').then(module => module.mode),
    moonbeam: () => import('tevm/common').then(module => module.moonbeam),
    moonriver: () => import('tevm/common').then(module => module.moonriver),
    opBNB: () => import('tevm/common').then(module => module.opBNB),
    optimism: () => import('tevm/common').then(module => module.optimism),
    optimismSepolia: () => import('tevm/common').then(module => module.optimismSepolia),
    polygon: () => import('tevm/common').then(module => module.polygon),
    polygonMumbai: () => import('tevm/common').then(module => module.polygonMumbai),
    polygonZkEvm: () => import('tevm/common').then(module => module.polygonZkEvm),
    polygonZkEvmTestnet: () => import('tevm/common').then(module => module.polygonZkEvmTestnet),
    redstone: () => import('tevm/common').then(module => module.redstone),
    scroll: () => import('tevm/common').then(module => module.scroll),
    sepolia: () => import('tevm/common').then(module => module.sepolia),
    tevmDefault: () => import('tevm/common').then(module => module.tevmDefault),
    zksync: () => import('tevm/common').then(module => module.zksync),
    zksyncSepolia: () => import('tevm/common').then(module => module.zksyncSepoliaTestnet),
    zora: () => import('tevm/common').then(module => module.zora),
    zoraSepolia: () => import('tevm/common').then(module => module.zoraSepolia),
    zoraTestnet: () => import('tevm/common').then(module => module.zoraTestnet),
  };

  public static getCommon(network: keyof typeof LazyTevm.commonMap) {
    return LazyTevm.commonMap[network]();
  }

  public static createTevmNode = async (params: TevmNodeOptions): Promise<TevmNode> => {
    const { createTevmNode } = await import('tevm')
    return createTevmNode(params) 
  }

  public static http = async (rpcUrl: string) => {
    const { http } = await import('tevm')
    return http(rpcUrl)
  }
  public static createAddress = async (address: Parameters<typeof import('tevm/address').createAddress>[0]): Promise<Address> => {
    const { createAddress } = await import('tevm/address');
    return createAddress(address);
  }

  public static create2Address = async (
    from: Parameters<typeof import('tevm/address').create2ContractAddress>[0],
    salt: Parameters<typeof import('tevm/address').create2ContractAddress>[1],
    initCodeHash: Parameters<typeof import('tevm/address').create2ContractAddress>[2]
  ): Promise<Address> => {
    const { create2ContractAddress } = await import('tevm/address');
    return create2ContractAddress(from, salt, initCodeHash);
  }

  public static createContractAddress = async (
    from: Parameters<typeof import('tevm/address').createContractAddress>[0],
    nonce: Parameters<typeof import('tevm/address').createContractAddress>[1]
  ): Promise<Address> => {
    const { createContractAddress } = await import('tevm/address');
    return createContractAddress(from, nonce);
  }

  public static getPrefundedAccounts = async (): Promise<typeof import('tevm').PREFUNDED_ACCOUNTS> => {
    const { PREFUNDED_ACCOUNTS } = await import('tevm');
    return PREFUNDED_ACCOUNTS;
  }
}
