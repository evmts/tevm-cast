import { redstone } from "tevm/common";
import { SupportedNetwork } from "./Nodes";

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

const defaultUrls = {
  redstone: redstone.rpcUrls.default.http[0],
  arbitrumNova: 'https://nova.arbitrum.io/rpc',
  celo: 'https://forno.celo.org',
  berachain: 'https://artio.testnet.berachain.com',
  scroll: 'https://rpc.scroll.io',
  blast: 'https://rpc.blast.io',
  avalanche: 'https://api.avax.network/ext/bc/C/rpc',
  manta: 'https://pacific-rpc.manta.network/http',
  mantle: 'https://rpc.mantle.xyz',
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

  public getStoredUrl(network: SupportedNetwork): string {
    const storedUrl = localStorage.getItem(`rpcUrl_${network}`);
    if (storedUrl) return storedUrl;
    
    if (network in alchemyUrls) {
      return alchemyUrls[network];
    } else if (network in defaultUrls) {
      return defaultUrls[network];
    } else {
      return ''; // For networks without a default URL
    }
  }

  setStoredUrl(network: string, url: string) {
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
