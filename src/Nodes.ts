import {
  arbitrumSepolia as arbitrumSepoliaViemChain,
  arbitrumNova as arbitrumNovaViemChain,
  celo as celoViemChain,
  zksync as zksyncViemChain,
  zksyncSepoliaTestnet as zksyncSepoliaTestnetViemChain,
  berachainTestnetbArtio as berachainTestnetbArtioViemChain,
} from 'viem/chains'
import { 
  createCommon,
  base as baseCommon, 
  mainnet as mainnetCommon, 
  optimism as optimismCommon,
  arbitrum as arbitrumCommon,
  zora as zoraCommon,
  polygon as polygonCommon, 
  redstone as redstoneCommon, 
  sepolia as sepoliaCommon,
  baseSepolia as baseSepoliaCommon,
  scroll as scrollCommon,
  blast as blastCommon,
  avalanche as avalanceCommon,
  manta as manaCommon,
  zoraSepolia as zoraSepoliaCommon,
  mantle as mantleCommon,
  optimismSepolia as optimismSeplia,
  tevmDefault as tevmDefault,
 } from "tevm/common";
import { Storage } from "./Storage";
import { createTevmNode, http } from 'tevm'
import type { Common } from 'tevm/common'

export type SupportedNetwork =
  | "arbitrum"
  | "arbitrumNova"
  | "arbitrumSepolia"
  | "avalanche"
  | "base"
  | "baseSepolia"
  | "berachain"
  | "blast"
  | "celo"
  | "mainnet"
  | "manta"
  | "mantle"
  | "optimism"
  | "optimismSepolia"
  | "polygon"
  | "redstone"
  | "scroll"
  | "sepolia"
  | "zksync"
  | "zksyncSepolia"
  | "zora"
  | "zoraSepolia";

/**
 * Tevm node eagerly instantiates tevm nodes for all supported networks
 * It lazy loads the tevm library for optimal code splitting
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

  private storage: Storage;
  public network: SupportedNetwork;

  private _mainnet: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> };
  private _base: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> };
  private _optimism: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> };
  private _arbitrum: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> };
  private _polygon: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> };
  private _zora: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _redstone: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _sepolia: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _baseSepolia: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _scroll: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _blast: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _avalanche: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _manta: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _zoraSepolia: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _mantle: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _optimismSepolia: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _arbitrumSepolia: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _arbitrumNova: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _celo: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _zksync: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _zksyncSepolia: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _berachain: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  public newChain: { common: Common; lazyLoadedNode: Promise<ReturnType<typeof createTevmNode>> };

  constructor(storage: Storage, network: SupportedNetwork = 'mainnet') {
    this.storage = storage;
    this.network = network;

    // Optimistically create mainnet through polygon
    this._mainnet = {
      common: mainnetCommon,
      lazyLoadedNode: Nodes.lazyLoadedTevmNode(storage.getStoredUrl('mainnet'), mainnetCommon),
    };
    this._base = {
      common: baseCommon,
      lazyLoadedNode: Nodes.lazyLoadedTevmNode(storage.getStoredUrl('base'), baseCommon),
    };
    this._optimism = {
      common: optimismCommon,
      lazyLoadedNode: Nodes.lazyLoadedTevmNode(storage.getStoredUrl('optimism'), optimismCommon),
    };
    this._arbitrum = {
      common: arbitrumCommon,
      lazyLoadedNode: Nodes.lazyLoadedTevmNode(storage.getStoredUrl('arbitrum'), arbitrumCommon),
    };
    this._polygon = {
      common: polygonCommon,
      lazyLoadedNode: Nodes.lazyLoadedTevmNode(storage.getStoredUrl('polygon'), polygonCommon),
    };

    this.newChain = {
      common: tevmDefault,
      lazyLoadedNode: Promise.resolve(createTevmNode({ common: tevmDefault })),
    };
  }

  public get mainnet() { return this._mainnet; }
  public get base() { return this._base; }
  public get optimism() { return this._optimism; }
  public get arbitrum() { return this._arbitrum; }
  public get polygon() { return this._polygon; }

  public get zora() {
    if (!this._zora) {
      this._zora = {
        common: zoraCommon,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('zora'), zoraCommon),
      };
    }
    return this._zora;
  }

  public get redstone() {
    if (!this._redstone) {
      this._redstone = {
        common: redstoneCommon,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('redstone'), redstoneCommon),
      };
    }
    return this._redstone;
  }

  public get sepolia() {
    if (!this._sepolia) {
      this._sepolia = {
        common: sepoliaCommon,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('sepolia'), sepoliaCommon),
      };
    }
    return this._sepolia;
  }

  public get baseSepolia() {
    if (!this._baseSepolia) {
      this._baseSepolia = {
        common: baseSepoliaCommon,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('baseSepolia'), baseSepoliaCommon),
      };
    }
    return this._baseSepolia;
  }

  public get scroll() {
    if (!this._scroll) {
      this._scroll = {
        common: scrollCommon,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('scroll'), scrollCommon),
      };
    }
    return this._scroll;
  }

  public get blast() {
    if (!this._blast) {
      this._blast = {
        common: blastCommon,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('blast'), blastCommon),
      };
    }
    return this._blast;
  }

  public get avalanche() {
    if (!this._avalanche) {
      this._avalanche = {
        common: avalanceCommon,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('avalanche'), avalanceCommon),
      };
    }
    return this._avalanche;
  }

  public get manta() {
    if (!this._manta) {
      this._manta = {
        common: manaCommon,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('manta'), manaCommon),
      };
    }
    return this._manta;
  }

  public get zoraSepolia() {
    if (!this._zoraSepolia) {
      this._zoraSepolia = {
        common: zoraSepoliaCommon,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('zoraSepolia'), zoraSepoliaCommon),
      };
    }
    return this._zoraSepolia;
  }

  public get mantle() {
    if (!this._mantle) {
      this._mantle = {
        common: mantleCommon,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('mantle'), mantleCommon),
      };
    }
    return this._mantle;
  }

  public get optimismSepolia() {
    if (!this._optimismSepolia) {
      this._optimismSepolia = {
        common: optimismSeplia,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('optimismSepolia'), optimismSeplia),
      };
    }
    return this._optimismSepolia;
  }

  public get arbitrumSepolia() {
    if (!this._arbitrumSepolia) {
      const common = createCommon({
        ...arbitrumSepoliaViemChain,
        loggingLevel: 'warn',
        hardfork: 'cancun',
        eips: [],
      });
      this._arbitrumSepolia = {
        common,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('arbitrumSepolia'), common),
      };
    }
    return this._arbitrumSepolia;
  }

  public get arbitrumNova() {
    if (!this._arbitrumNova) {
      const common = createCommon({
        ...arbitrumNovaViemChain,
        loggingLevel: 'warn',
        hardfork: 'cancun',
        eips: [],
      });
      this._arbitrumNova = {
        common,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('arbitrumNova'), common),
      };
    }
    return this._arbitrumNova;
  }

  public get celo() {
    if (!this._celo) {
      const common = createCommon({
        ...celoViemChain,
        loggingLevel: 'warn',
        hardfork: 'cancun',
        eips: [],
      });
      this._celo = {
        common,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('celo'), common),
      };
    }
    return this._celo;
  }

  public get zksync() {
    if (!this._zksync) {
      const common = createCommon({
        ...zksyncViemChain,
        loggingLevel: 'warn',
        hardfork: 'cancun',
        eips: [],
      });
      this._zksync = {
        common,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('zksync'), common),
      };
    }
    return this._zksync;
  }

  public get zksyncSepolia() {
    if (!this._zksyncSepolia) {
      const common = createCommon({
        ...zksyncSepoliaTestnetViemChain,
        loggingLevel: 'warn',
        hardfork: 'cancun',
        eips: [],
      });
      this._zksyncSepolia = {
        common,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('zksyncSepolia'), common),
      };
    }
    return this._zksyncSepolia;
  }

  public get berachain() {
    if (!this._berachain) {
      const common = createCommon({
        ...berachainTestnetbArtioViemChain,
        loggingLevel: 'warn',
        hardfork: 'cancun',
        eips: [],
      });
      this._berachain = {
        common,
        lazyLoadedNode: Nodes.lazyLoadedTevmNode(this.storage.getStoredUrl('berachain'), common),
      };
    }
    return this._berachain;
  }
}
