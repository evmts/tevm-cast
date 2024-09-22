import {
  arbitrum as arbitrumCommon,
  arbitrumNova as arbitrumNovaCommon,
  arbitrumSepolia as arbitrumSepoliaCommon,
  aurora as auroraCommon,
  auroraTestnet as auroraTestnetCommon,
  avalanche as avalanceCommon,
  base as baseCommon,
  baseSepolia as baseSepoliaCommon,
  bearNetworkChainMainnet as bearNetworkChainMainnetCommon,
  berachainTestnet as berachainTestnetCommon,
  blast as blastCommon,
  blastSepolia as blastSepoliaCommon,
  boba as bobaCommon,
  bsc as bscCommon,
  celo as celoCommon,
  cronos as cronosCommon,
  cronosTestnet as cronosTestnetCommon,
  fantom as fantomCommon,
  filecoin as filecoinCommon,
  gnosis as gnosisCommon,
  harmonyOne as harmonyOneCommon,
  holesky as holeskyCommon,
  kava as kavaCommon,
  kavaTestnet as kavaTestnetCommon,
  linea as lineaCommon,
  lineaTestnet as lineaTestnetCommon,
  lyra as lyraCommon,
  mainnet as mainnetCommon,
  manta as manaCommon,
  mantle as mantleCommon,
  metis as metisCommon,
  mode as modeCommon,
  moonbeam as moonbeamCommon,
  moonriver as moonriverCommon,
  opBNB as opBNBCommon,
  optimism as optimismCommon,
  optimismSepolia as optimismSeplia,
  polygon as polygonCommon,
  polygonMumbai as polygonMumbaiCommon,
  polygonZkEvm as polygonZkEvmCommon,
  polygonZkEvmTestnet as polygonZkEvmTestnetCommon,
  redstone as redstoneCommon,
  scroll as scrollCommon,
  sepolia as sepoliaCommon,
  tevmDefault as tevmDefault,
  zksync as zksyncCommon,
  zksyncSepoliaTestnet as zksyncSepoliaTestnetCommon,
  zora as zoraCommon,
  zoraSepolia as zoraSepoliaCommon,
  zoraTestnet as zoraTestnetCommon,
} from "tevm/common";
import { Storage } from "./Storage";
import { createTevmNode, http } from 'tevm'
import type { Common } from 'tevm/common'

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
  | "berachain"
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
  | "holesky"
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
 * Tevm node eagerly instantiates tevm nodes for all supported networks
 * It lazy loads the tevm library for optimal code splitting
 */
export class Nodes {
  // We choose to lazy load tevm to optimize first load
  public static createTevmNode = async (rpcUrl: string, common: Common) => {
    return createTevmNode({
      common,
      fork: {
        transport: http(rpcUrl)({})
      }
    })
  }

  private storage: Storage;
  public network: SupportedNetwork;

  private _arbitrum: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> };
  private _arbitrumNova: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _arbitrumSepolia: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _aurora: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _auroraTestnet: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _avalanche: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _base: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> };
  private _baseSepolia: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _bearNetworkChainMainnet: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _berachain: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _berachainTestnet: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _blast: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _blastSepolia: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _boba: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _bsc: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _celo: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _cronos: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _cronosTestnet: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _fantom: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _filecoin: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _gnosis: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _harmonyOne: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _holesky: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _kava: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _kavaTestnet: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _linea: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _lineaTestnet: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _lyra: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _mainnet: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> };
  private _manta: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _mantle: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _metis: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _mode: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _moonbeam: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _moonriver: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _opBNB: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _optimism: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> };
  private _optimismSepolia: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _polygon: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> };
  private _polygonMumbai: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _polygonZkEvm: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _polygonZkEvmTestnet: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _redstone: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _scroll: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _sepolia: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _zksync: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _zksyncSepolia: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _zora: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _zoraSepolia: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  private _zoraTestnet: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> } | undefined;
  public newChain: { common: Common; node: Promise<ReturnType<typeof createTevmNode>> };

  constructor(storage: Storage, network: SupportedNetwork = 'mainnet') {
    this.storage = storage;
    this.network = network;

    // Optimistically create mainnet through polygon
    this._mainnet = {
      common: mainnetCommon,
      node: Nodes.createTevmNode(storage.getStoredUrl('mainnet'), mainnetCommon),
    };
    this._base = {
      common: baseCommon,
      node: Nodes.createTevmNode(storage.getStoredUrl('base'), baseCommon),
    };
    this._optimism = {
      common: optimismCommon,
      node: Nodes.createTevmNode(storage.getStoredUrl('optimism'), optimismCommon),
    };
    this._arbitrum = {
      common: arbitrumCommon,
      node: Nodes.createTevmNode(storage.getStoredUrl('arbitrum'), arbitrumCommon),
    };
    this._polygon = {
      common: polygonCommon,
      node: Nodes.createTevmNode(storage.getStoredUrl('polygon'), polygonCommon),
    };

    this.newChain = {
      common: tevmDefault,
      node: Promise.resolve(createTevmNode({ common: tevmDefault })),
    };
  }

  public get arbitrum() { return this._arbitrum; }
  public get arbitrumNova() {
    if (!this._arbitrumNova) {
      this._arbitrumNova = {
        common: arbitrumNovaCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('arbitrumNova'), arbitrumNovaCommon),
      };
    }
    return this._arbitrumNova;
  }
  public get arbitrumSepolia() {
    if (!this._arbitrumSepolia) {
      this._arbitrumSepolia = {
        common: arbitrumSepoliaCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('arbitrumSepolia'), arbitrumSepoliaCommon),
      };
    }
    return this._arbitrumSepolia;
  }
  public get aurora() {
    if (!this._aurora) {
      this._aurora = {
        common: auroraCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('aurora'), auroraCommon),
      };
    }
    return this._aurora;
  }
  public get auroraTestnet() {
    if (!this._auroraTestnet) {
      this._auroraTestnet = {
        common: auroraTestnetCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('auroraTestnet'), auroraTestnetCommon),
      };
    }
    return this._auroraTestnet;
  }
  public get avalanche() {
    if (!this._avalanche) {
      this._avalanche = {
        common: avalanceCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('avalanche'), avalanceCommon),
      };
    }
    return this._avalanche;
  }
  public get base() { return this._base; }
  public get baseSepolia() {
    if (!this._baseSepolia) {
      this._baseSepolia = {
        common: baseSepoliaCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('baseSepolia'), baseSepoliaCommon),
      };
    }
    return this._baseSepolia;
  }
  public get bearNetworkChainMainnet() {
    if (!this._bearNetworkChainMainnet) {
      this._bearNetworkChainMainnet = {
        common: bearNetworkChainMainnetCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('bearNetworkChainMainnet'), bearNetworkChainMainnetCommon),
      };
    }
    return this._bearNetworkChainMainnet;
  }
  public get berachain() {
    if (!this._berachain) {
      this._berachain = {
        common: berachainTestnetCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('berachain'), berachainTestnetCommon),
      };
    }
    return this._berachain;
  }
  public get berachainTestnet() {
    if (!this._berachainTestnet) {
      this._berachainTestnet = {
        common: berachainTestnetCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('berachainTestnet'), berachainTestnetCommon),
      };
    }
    return this._berachainTestnet;
  }
  public get blast() {
    if (!this._blast) {
      this._blast = {
        common: blastCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('blast'), blastCommon),
      };
    }
    return this._blast;
  }
  public get blastSepolia() {
    if (!this._blastSepolia) {
      this._blastSepolia = {
        common: blastSepoliaCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('blastSepolia'), blastSepoliaCommon),
      };
    }
    return this._blastSepolia;
  }
  public get boba() {
    if (!this._boba) {
      this._boba = {
        common: bobaCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('boba'), bobaCommon),
      };
    }
    return this._boba;
  }
  public get bsc() {
    if (!this._bsc) {
      this._bsc = {
        common: bscCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('bsc'), bscCommon),
      };
    }
    return this._bsc;
  }
  public get celo() {
    if (!this._celo) {
      this._celo = {
        common: celoCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('celo'), celoCommon),
      };
    }
    return this._celo;
  }
  public get cronos() {
    if (!this._cronos) {
      this._cronos = {
        common: cronosCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('cronos'), cronosCommon),
      };
    }
    return this._cronos;
  }
  public get cronosTestnet() {
    if (!this._cronosTestnet) {
      this._cronosTestnet = {
        common: cronosTestnetCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('cronosTestnet'), cronosTestnetCommon),
      };
    }
    return this._cronosTestnet;
  }
  public get fantom() {
    if (!this._fantom) {
      this._fantom = {
        common: fantomCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('fantom'), fantomCommon),
      };
    }
    return this._fantom;
  }
  public get filecoin() {
    if (!this._filecoin) {
      this._filecoin = {
        common: filecoinCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('filecoin'), filecoinCommon),
      };
    }
    return this._filecoin;
  }
  public get gnosis() {
    if (!this._gnosis) {
      this._gnosis = {
        common: gnosisCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('gnosis'), gnosisCommon),
      };
    }
    return this._gnosis;
  }
  public get harmonyOne() {
    if (!this._harmonyOne) {
      this._harmonyOne = {
        common: harmonyOneCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('harmonyOne'), harmonyOneCommon),
      };
    }
    return this._harmonyOne;
  }
  public get holesky() {
    if (!this._holesky) {
      this._holesky = {
        common: holeskyCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('holesky'), holeskyCommon),
      };
    }
    return this._holesky;
  }
  public get kava() {
    if (!this._kava) {
      this._kava = {
        common: kavaCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('kava'), kavaCommon),
      };
    }
    return this._kava;
  }
  public get kavaTestnet() {
    if (!this._kavaTestnet) {
      this._kavaTestnet = {
        common: kavaTestnetCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('kavaTestnet'), kavaTestnetCommon),
      };
    }
    return this._kavaTestnet;
  }
  public get linea() {
    if (!this._linea) {
      this._linea = {
        common: lineaCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('linea'), lineaCommon),
      };
    }
    return this._linea;
  }
  public get lineaTestnet() {
    if (!this._lineaTestnet) {
      this._lineaTestnet = {
        common: lineaTestnetCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('lineaTestnet'), lineaTestnetCommon),
      };
    }
    return this._lineaTestnet;
  }
  public get lyra() {
    if (!this._lyra) {
      this._lyra = {
        common: lyraCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('lyra'), lyraCommon),
      };
    }
    return this._lyra;
  }
  public get mainnet() { return this._mainnet; }
  public get manta() {
    if (!this._manta) {
      this._manta = {
        common: manaCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('manta'), manaCommon),
      };
    }
    return this._manta;
  }
  public get mantle() {
    if (!this._mantle) {
      this._mantle = {
        common: mantleCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('mantle'), mantleCommon),
      };
    }
    return this._mantle;
  }
  public get metis() {
    if (!this._metis) {
      this._metis = {
        common: metisCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('metis'), metisCommon),
      };
    }
    return this._metis;
  }
  public get mode() {
    if (!this._mode) {
      this._mode = {
        common: modeCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('mode'), modeCommon),
      };
    }
    return this._mode;
  }
  public get moonbeam() {
    if (!this._moonbeam) {
      this._moonbeam = {
        common: moonbeamCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('moonbeam'), moonbeamCommon),
      };
    }
    return this._moonbeam;
  }
  public get moonriver() {
    if (!this._moonriver) {
      this._moonriver = {
        common: moonriverCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('moonriver'), moonriverCommon),
      };
    }
    return this._moonriver;
  }
  public get opBNB() {
    if (!this._opBNB) {
      this._opBNB = {
        common: opBNBCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('opBNB'), opBNBCommon),
      };
    }
    return this._opBNB;
  }
  public get optimism() { return this._optimism; }
  public get optimismSepolia() {
    if (!this._optimismSepolia) {
      this._optimismSepolia = {
        common: optimismSeplia,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('optimismSepolia'), optimismSeplia),
      };
    }
    return this._optimismSepolia;
  }
  public get polygon() { return this._polygon; }
  public get polygonMumbai() {
    if (!this._polygonMumbai) {
      this._polygonMumbai = {
        common: polygonMumbaiCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('polygonMumbai'), polygonMumbaiCommon),
      };
    }
    return this._polygonMumbai;
  }
  public get polygonZkEvm() {
    if (!this._polygonZkEvm) {
      this._polygonZkEvm = {
        common: polygonZkEvmCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('polygonZkEvm'), polygonZkEvmCommon),
      };
    }
    return this._polygonZkEvm;
  }
  public get polygonZkEvmTestnet() {
    if (!this._polygonZkEvmTestnet) {
      this._polygonZkEvmTestnet = {
        common: polygonZkEvmTestnetCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('polygonZkEvmTestnet'), polygonZkEvmTestnetCommon),
      };
    }
    return this._polygonZkEvmTestnet;
  }
  public get redstone() {
    if (!this._redstone) {
      this._redstone = {
        common: redstoneCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('redstone'), redstoneCommon),
      };
    }
    return this._redstone;
  }
  public get scroll() {
    if (!this._scroll) {
      this._scroll = {
        common: scrollCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('scroll'), scrollCommon),
      };
    }
    return this._scroll;
  }
  public get sepolia() {
    if (!this._sepolia) {
      this._sepolia = {
        common: sepoliaCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('sepolia'), sepoliaCommon),
      };
    }
    return this._sepolia;
  }
  public get zksync() {
    if (!this._zksync) {
      this._zksync = {
        common: zksyncCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('zksync'), zksyncCommon),
      };
    }
    return this._zksync;
  }
  public get zksyncSepolia() {
    if (!this._zksyncSepolia) {
      this._zksyncSepolia = {
        common: zksyncSepoliaTestnetCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('zksyncSepolia'), zksyncSepoliaTestnetCommon),
      };
    }
    return this._zksyncSepolia;
  }
  public get zora() {
    if (!this._zora) {
      this._zora = {
        common: zoraCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('zora'), zoraCommon),
      };
    }
    return this._zora;
  }
  public get zoraSepolia() {
    if (!this._zoraSepolia) {
      this._zoraSepolia = {
        common: zoraSepoliaCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('zoraSepolia'), zoraSepoliaCommon),
      };
    }
    return this._zoraSepolia;
  }
  public get zoraTestnet() {
    if (!this._zoraTestnet) {
      this._zoraTestnet = {
        common: zoraTestnetCommon,
        node: Nodes.createTevmNode(this.storage.getStoredUrl('zoraTestnet'), zoraTestnetCommon),
      };
    }
    return this._zoraTestnet;
  }
}
