import type { SupportedNetwork } from './LazyTevm';

const commonMap = {
  arbitrumNova: () => import('tevm/common').then(module => module.arbitrumNova),
  aurora: () => import('tevm/common').then(module => module.aurora),
  auroraTestnet: () => import('tevm/common').then(module => module.auroraTestnet),
  avalanche: () => import('tevm/common').then(module => module.avalanche),
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
  manta: () => import('tevm/common').then(module => module.manta),
  mantle: () => import('tevm/common').then(module => module.mantle),
  metis: () => import('tevm/common').then(module => module.metis),
  mode: () => import('tevm/common').then(module => module.mode),
  moonbeam: () => import('tevm/common').then(module => module.moonbeam),
  moonriver: () => import('tevm/common').then(module => module.moonriver),
  opBNB: () => import('tevm/common').then(module => module.opBNB),
  polygonMumbai: () => import('tevm/common').then(module => module.polygonMumbai),
  polygonZkEvm: () => import('tevm/common').then(module => module.polygonZkEvm),
  polygonZkEvmTestnet: () => import('tevm/common').then(module => module.polygonZkEvmTestnet),
  redstone: () => import('tevm/common').then(module => module.redstone),
  scroll: () => import('tevm/common').then(module => module.scroll),
  tevmDefault: () => import('tevm/common').then(module => module.tevmDefault),
  zoraTestnet: () => import('tevm/common').then(module => module.zoraTestnet),
};

const alchemyApiKey = 'beaEwjczm1iCOAcSco_F8QbtqnwnginU';

const alchemyUrls = {
  mainnet: `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  sepolia: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  optimism: `https://opt-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  optimismSepolia: `https://opt-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  polygon: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  arbitrum: `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  arbitrumSepolia: `https://arb-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  zora: `https://zora-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  zoraSepolia: `https://zora-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  base: `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  baseSepolia: `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  zksync: `https://zksync-era.g.alchemy.com/v2/${alchemyApiKey}`,
  zksyncSepolia: `https://zksync-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
};

export class Storage {

  migrateLocalStorage() {
    const mainnetUrl = localStorage.getItem('rpcUrl_mainnet');
    const optimismUrl = localStorage.getItem('rpcUrl_optimism');
    const baseUrl = localStorage.getItem('rpcUrl_base');

    if (mainnetUrl && mainnetUrl.includes('cloudflare')) {
      localStorage.setItem('rpcUrl_mainnet', alchemyUrls.mainnet);
    }

    if (optimismUrl && optimismUrl.includes('mainnet.optimism.io')) {
      localStorage.setItem('rpcUrl_optimism', alchemyUrls.optimism);
    }

    if (baseUrl && baseUrl.includes('https://mainnet.base.org')) {
      localStorage.setItem('rpcUrl_base', alchemyUrls.base);
    }
  }

  public async getStoredUrl(network: SupportedNetwork): Promise<string> {
    const storedUrl = localStorage.getItem(`rpcUrl_${network}`);
    if (storedUrl) return storedUrl;
    const out = alchemyUrls[network] ?? await this.getUrlFromCommon(network);
    return out ?? '';
  }

  private async getUrlFromCommon(network: SupportedNetwork): Promise<string> {
    const commonLoader = commonMap[network];
    if (commonLoader) {
      const common = await commonLoader();
      return common.defaultRpcUrls[0] ?? '';
    }
    return '';
  }

  async setStoredUrl(network: string, url: string): Promise<void> {
    localStorage.setItem(`rpcUrl_${network}`, url);
  }

  getStoredHistory(): string[] {
    const storedHistory = localStorage.getItem('commandHistory');
    if (!storedHistory) {
      const initialHistory = ['cast --help'];
      localStorage.setItem('commandHistory', JSON.stringify(initialHistory));
      return initialHistory;
    }
    return JSON.parse(storedHistory);
  }

  setStoredHistory(history: string[]) {
    const limitedHistory = history.slice(-100);
    localStorage.setItem('commandHistory', JSON.stringify(limitedHistory));
  }
}
