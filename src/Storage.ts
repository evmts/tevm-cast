import { redstone } from "tevm/common";

const defaultUrls = {
  mainnet: 'https://eth-mainnet.g.alchemy.com/v2/beaEwjczm1iCOAcSco_F8QbtqnwnginU',
  optimism: 'https://opt-mainnet.g.alchemy.com/v2/beaEwjczm1iCOAcSco_F8QbtqnwnginU',
  base: 'https://base-mainnet.g.alchemy.com/v2/beaEwjczm1iCOAcSco_F8QbtqnwnginU',
  arbitrum: 'https://arb-mainnet.g.alchemy.com/v2/beaEwjczm1iCOAcSco_F8QbtqnwnginU',
  zora: 'https://zora-mainnet.g.alchemy.com/v2/beaEwjczm1iCOAcSco_F8QbtqnwnginU',
  polygon: 'https://polygon-mainnet.g.alchemy.com/v2/beaEwjczm1iCOAcSco_F8QbtqnwnginU',
  redstone: redstone.rpcUrls.default.http[0],
};

export class Storage {

  migrateLocalStorage() {
    const mainnetUrl = localStorage.getItem('rpcUrl_mainnet');
    const optimismUrl = localStorage.getItem('rpcUrl_optimism');
    const baseUrl = localStorage.getItem('rpcUrl_base');

    if (mainnetUrl && mainnetUrl.includes('cloudflare')) {
      localStorage.setItem('rpcUrl_mainnet', defaultUrls.mainnet);
    }

    if (optimismUrl && optimismUrl.includes('mainnet.optimism.io')) {
      localStorage.setItem('rpcUrl_optimism', defaultUrls.optimism);
    }

    if (baseUrl && baseUrl.includes('https://mainnet.base.org')) {
      localStorage.setItem('rpcUrl_base', defaultUrls.base);
    }
  }

  getStoredUrl(network: string): string {
    return localStorage.getItem(`rpcUrl_${network}`) || defaultUrls[network];
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
