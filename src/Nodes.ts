import type { Storage } from "./Storage";
import type { TevmNode } from 'tevm'
import type { Common } from 'tevm/common'
import { LazyTevm, type SupportedNetwork } from "./LazyTevm";

export class Nodes implements Record<SupportedNetwork, () => Promise<{ common: Common; node: TevmNode }>>{
  public static createTevmNode = async (rpcUrl: string, common: Common) => {
    return LazyTevm.createTevmNode({
      common,
      fork: {
        transport: (await LazyTevm.http(rpcUrl))({})
      }
    })
  }

  private storage: Storage;
  public network: SupportedNetwork;
  private nodes: Partial<Record<SupportedNetwork, { common: Common; node: TevmNode }>> = {};

  constructor(storage: Storage, network: SupportedNetwork = 'mainnet') {
    this.storage = storage;
    this.network = network;
  }

  private async getNode(network: SupportedNetwork): Promise<{ common: Common; node: TevmNode }> {
    if (!this.nodes[network]) {
      const common = await LazyTevm.getCommon(network);
      this.nodes[network] = {
        common,
        node: await Nodes.createTevmNode(await this.storage.getStoredUrl(network), common),
      };
    }
    return this.nodes[network]!;
  }

  public async tevmDefault() {
    if (!this.nodes.tevmDefault) {
      const common = await LazyTevm.getCommon('tevmDefault');
      this.nodes.tevmDefault = { common, node: await LazyTevm.createTevmNode({ common }) };
    }
    return this.nodes.tevmDefault;
  }

  public async arbitrum() { return this.getNode('arbitrum'); }
  public async arbitrumNova() { return this.getNode('arbitrumNova'); }
  public async arbitrumSepolia() { return this.getNode('arbitrumSepolia'); }
  public async aurora() { return this.getNode('aurora'); }
  public async auroraTestnet() { return this.getNode('auroraTestnet'); }
  public async avalanche() { return this.getNode('avalanche'); }
  public async base() { return this.getNode('base'); }
  public async baseSepolia() { return this.getNode('baseSepolia'); }
  public async bearNetworkChainMainnet() { return this.getNode('bearNetworkChainMainnet'); }
  public async berachainTestnet() { return this.getNode('berachainTestnet'); }
  public async blast() { return this.getNode('blast'); }
  public async blastSepolia() { return this.getNode('blastSepolia'); }
  public async boba() { return this.getNode('boba'); }
  public async bsc() { return this.getNode('bsc'); }
  public async celo() { return this.getNode('celo'); }
  public async cronos() { return this.getNode('cronos'); }
  public async cronosTestnet() { return this.getNode('cronosTestnet'); }
  public async fantom() { return this.getNode('fantom'); }
  public async filecoin() { return this.getNode('filecoin'); }
  public async gnosis() { return this.getNode('gnosis'); }
  public async harmonyOne() { return this.getNode('harmonyOne'); }
  public async kava() { return this.getNode('kava'); }
  public async kavaTestnet() { return this.getNode('kavaTestnet'); }
  public async linea() { return this.getNode('linea'); }
  public async lineaTestnet() { return this.getNode('lineaTestnet'); }
  public async lyra() { return this.getNode('lyra'); }
  public async mainnet() { return this.getNode('mainnet'); }
  public async manta() { return this.getNode('manta'); }
  public async mantle() { return this.getNode('mantle'); }
  public async metis() { return this.getNode('metis'); }
  public async mode() { return this.getNode('mode'); }
  public async moonbeam() { return this.getNode('moonbeam'); }
  public async moonriver() { return this.getNode('moonriver'); }
  public async opBNB() { return this.getNode('opBNB'); }
  public async optimism() { return this.getNode('optimism'); }
  public async optimismSepolia() { return this.getNode('optimismSepolia'); }
  public async polygon() { return this.getNode('polygon'); }
  public async polygonMumbai() { return this.getNode('polygonMumbai'); }
  public async polygonZkEvm() { return this.getNode('polygonZkEvm'); }
  public async polygonZkEvmTestnet() { return this.getNode('polygonZkEvmTestnet'); }
  public async redstone() { return this.getNode('redstone'); }
  public async scroll() { return this.getNode('scroll'); }
  public async sepolia() { return this.getNode('sepolia'); }
  public async zksync() { return this.getNode('zksync'); }
  public async zksyncSepolia() { return this.getNode('zksyncSepolia'); }
  public async zora() { return this.getNode('zora'); }
  public async zoraSepolia() { return this.getNode('zoraSepolia'); }
  public async zoraTestnet() { return this.getNode('zoraTestnet'); }
}
