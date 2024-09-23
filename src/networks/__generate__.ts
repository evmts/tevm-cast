import fs from 'fs';
import path from 'path';

const networks = [
  "arbitrum",
  "arbitrumNova",
  "arbitrumSepolia",
  "aurora",
  "auroraTestnet",
  "avalanche",
  "base",
  "baseSepolia",
  "bearNetworkChainMainnet",
  "berachainTestnet",
  "blast",
  "blastSepolia",
  "boba",
  "bsc",
  "celo",
  "cronos",
  "cronosTestnet",
  "fantom",
  "filecoin",
  "gnosis",
  "harmonyOne",
  "kava",
  "kavaTestnet",
  "linea",
  "lineaTestnet",
  "lyra",
  "mainnet",
  "manta",
  "mantle",
  "metis",
  "mode",
  "moonbeam",
  "moonriver",
  "opBNB",
  "optimism",
  "optimismSepolia",
  "polygon",
  "polygonMumbai",
  "polygonZkEvm",
  "polygonZkEvmTestnet",
  "redstone",
  "scroll",
  "sepolia",
  "tevmDefault",
  "zksync",
  "zksyncSepolia",
  "zora",
  "zoraSepolia",
  "zoraTestnet"
];

const outputDir = path.join(__dirname);

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

networks.forEach(network => {
  const content = `export { ${network} } from '@tevm/common';\n`;
  const filePath = path.join(outputDir, `${network}.ts`);
  fs.writeFileSync(filePath, content);
  console.log(`Generated: ${filePath}`);
});

console.log('All network export files have been generated.');