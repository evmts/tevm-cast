import {
  arbitrumNova, aurora, auroraTestnet,
  avalanche, bearNetworkChainMainnet, berachainTestnet,
  blast, blastSepolia, boba, bsc, celo, cronos, cronosTestnet,
  fantom, filecoin, gnosis, harmonyOne, holesky, kava, kavaTestnet,
  linea, lineaTestnet, lyra, manta, mantle, metis, mode,
  moonbeam, moonriver, opBNB, polygonMumbai, polygonZkEvm, polygonZkEvmTestnet, redstone,
  scroll, tevmDefault, zoraTestnet
} from "tevm/common";
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

const defaultUrls: Record<SupportedNetwork, string> = {
  ...alchemyUrls,
  redstone: redstone.rpcUrls.default.http[0],
  arbitrumNova: arbitrumNova.rpcUrls.default.http[0],
  aurora: aurora.rpcUrls.default.http[0],
  auroraTestnet: auroraTestnet.rpcUrls.default.http[0],
  avalanche: avalanche.rpcUrls.default.http[0],
  bearNetworkChainMainnet: bearNetworkChainMainnet.rpcUrls.default.http[0],
  berachain: berachainTestnet.rpcUrls.default.http[0],
  berachainTestnet: berachainTestnet.rpcUrls.default.http[0],
  blast: blast.rpcUrls.default.http[0],
  blastSepolia: blastSepolia.rpcUrls.default.http[0],
  boba: boba.rpcUrls.default.http[0],
  bsc: bsc.rpcUrls.default.http[0],
  celo: celo.rpcUrls.default.http[0],
  cronos: cronos.rpcUrls.default.http[0],
  cronosTestnet: cronosTestnet.rpcUrls.default.http[0],
  fantom: fantom.rpcUrls.default.http[0],
  filecoin: filecoin.rpcUrls.default.http[0],
  gnosis: gnosis.rpcUrls.default.http[0],
  harmonyOne: harmonyOne.rpcUrls.default.http[0],
  holesky: holesky.rpcUrls.default.http[0],
  kava: kava.rpcUrls.default.http[0],
  kavaTestnet: kavaTestnet.rpcUrls.default.http[0],
  linea: linea.rpcUrls.default.http[0],
  lineaTestnet: lineaTestnet.rpcUrls.default.http[0],
  lyra: lyra.rpcUrls.default.http[0],
  manta: manta.rpcUrls.default.http[0],
  mantle: mantle.rpcUrls.default.http[0],
  metis: metis.rpcUrls.default.http[0],
  mode: mode.rpcUrls.default.http[0],
  moonbeam: moonbeam.rpcUrls.default.http[0],
  moonriver: moonriver.rpcUrls.default.http[0],
  opBNB: opBNB.rpcUrls.default.http[0],
  polygonMumbai: polygonMumbai.rpcUrls.default.http[0],
  polygonZkEvm: polygonZkEvm.rpcUrls.default.http[0],
  polygonZkEvmTestnet: polygonZkEvmTestnet.rpcUrls.default.http[0],
  scroll: scroll.rpcUrls.default.http[0],
  tevmDefault: tevmDefault.rpcUrls.default.http[0],
  zoraTestnet: zoraTestnet.rpcUrls.default.http[0],
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
    
    return defaultUrls[network] || ''; // Returns an empty string if no default URL is found
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
