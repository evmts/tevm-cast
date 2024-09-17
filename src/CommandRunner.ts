import { type Hex, type TevmNode, encodeFunctionData, decodeFunctionResult } from "tevm";
import { hexToBigInt, hexToBytes, keccak256, numberToHex } from "viem";
import { HelpText } from "./HelpText.js";
import { createAddress, create2ContractAddress, createContractAddress } from "tevm/address";
import type { Html } from "./Html";
import { CallHandler } from "./CallHandler";
import { SendHandler } from "./SendHandler.js";
import { FetchFunctionSignature } from "./FetchFunctionSig.js";
import { EthjsAddress } from "tevm/utils";
import { EthGetLogsJsonRpcRequest, ethGetLogsProcedure, gasPriceProcedure } from 'tevm/procedures';

function stringifyWithBigInt(obj: any): string {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  );
}

export class CommandRunner {
  constructor(private readonly html: Html) { }

  private static parseBlockTag(tag: string): Hex | bigint | 'latest' {
    if (tag.startsWith('0x')) {
      return tag as Hex;
    }
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(tag[0])) {
      return BigInt(tag);
    }
    return (tag ?? 'latest') as 'latest';
  }

  /**
   * Giant switch statement that runs every command
   * This works for now but might be a good idea to use a cli library as this scales
   */
  public readonly runCommand = async (node: TevmNode, command: string): Promise<void> => {
    try {
      switch (true) {
        case '' === command:
        case 'cast' === command:
        case 'cast' === command:
        case 'cast --help' === command:
        case 'cast -h' === command:
          this.html.renderCommandResult(HelpText.help);
          return;

        case command === 'cast 4byte':
        case command.startsWith('cast 4byte ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.fourByteHelp);
          return;

        case command.startsWith('cast 4byte '):
          this.html.renderCommandLoading();
          const fetchFunctionSig = new FetchFunctionSignature();
          const selector = command.split(' ')[2];
          if (!selector) {
            this.html.renderCommandResult('Selector is required for 4byte query');
            return;
          }
          try {
            const result = await fetchFunctionSig.run4Byte([selector]);
            this.html.renderCommandResult(result);
          } catch (error) {
            console.error(error);
            this.html.renderCommandResult(`Error: ${error.message}`);
          }
          return;
        case command === 'cast abi-decode':
        case command.startsWith('cast abi-decode ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.abiDecodeHelp);
          return;

        case command.startsWith('cast abi-decode '): {
          this.html.renderCommandLoading()
          const parts = command.split(' ')
          if (parts.length < 4) {
            this.html.renderCommandResult(HelpText.abiDecodeHelp)
            return
          }
          const sig = parts[2]
          const data = parts[3]
          const isInput = parts.includes('--input') || parts.includes('-i')

          try {
            const [name, inTypes, outTypes] = (() => {
              const match = sig.match(/^([^(]+)\(([^)]*)\)(?:\s*\(([^)]*)\))?$/)
              if (!match) throw new Error('Invalid function signature')
              const [, name, inTypes, outTypes] = match
              return [
                name,
                inTypes.split(',').filter(Boolean),
                (outTypes || '').split(',').filter(Boolean)
              ]
            })()

            if (!name || (!inTypes && !outTypes)) {
              throw new Error('Invalid function signature')
            }

            const abi = [{
              name,
              type: 'function',
              inputs: inTypes.map(type => ({ type, name: '' })),
              outputs: outTypes.map(type => ({ type, name: '' }))
            }] as const

            let result: string
            if (isInput) {
              const decoded = encodeFunctionData({ abi, functionName: name, args: [data] })
              result = decoded.slice(10) // Remove function selector (first 4 bytes)
            } else {
              const decodedResult = decodeFunctionResult({ abi, functionName: name, data: data as Hex })
              result = (decodedResult as any).toString()
            }

            this.html.renderCommandResult(result)
          } catch (error) {
            this.html.renderCommandResult(`Error decoding ABI data: ${error instanceof Error ? error.message : String(error)}`)
          }
          return
        }
        case command === 'cast abi-encode':
        case command.startsWith('cast abi-encode ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.abiEncodeHelp);
          return;

        case command.startsWith('cast abi-encode '):
          this.html.renderCommandLoading()
          const parts = command.split(' ')
          if (parts.length < 3) {
            this.html.renderCommandResult(HelpText.abiEncodeHelp)
            return
          }
          const sig = parts[2]
          const args = parts.slice(3)

          try {
            const [name, inTypes] = (() => {
              const match = sig.match(/^([^(]+)\(([^)]*)\)/)
              if (!match) throw new Error('Invalid function signature')
              const [, name, inTypes] = match
              return [name, inTypes.split(',').filter(Boolean)]
            })()

            if (!name || inTypes.length === 0) {
              throw new Error('Invalid function signature')
            }

            if (inTypes.length !== args.length) {
              throw new Error(`Expected ${inTypes.length} arguments, but got ${args.length}`)
            }

            const abi = [{
              name,
              type: 'function',
              inputs: inTypes.map(type => ({ type, name: '' })),
              outputs: []
            }] as const

            const encoded = encodeFunctionData({ abi, functionName: name, args })
            const result = encoded.slice(10) // Remove function selector (first 4 bytes)

            this.html.renderCommandResult(result)
          } catch (error) {
            this.html.renderCommandResult(`Error encoding ABI data: ${error instanceof Error ? error.message : String(error)}`)
          }
          return
        case command === 'cast age':
        case command.startsWith('cast age ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.ageHelp);
          return;

        case command.startsWith('cast age '): {
          this.html.renderCommandLoading();
          const parts = command.split(' ');
          const blockTag = parts[2] ? CommandRunner.parseBlockTag(parts[2]) : 'latest';
          try {
            const block = await node.getVm().then(vm => vm.blockchain.getBlockByTag(blockTag));
            if (!block) {
              throw new Error('Block not found');
            }
            const timestamp = Number(block.header.timestamp);
            const now = Math.floor(Date.now() / 1000);
            const age = now - timestamp;
            const result = `${age} seconds ago`;
            this.html.renderCommandResult(result);
          } catch (error) {
            console.error(error);
            this.html.renderCommandResult(`Error: ${error.message}`);
          }
          return;
        }
        case command.startsWith('cast base-fee ') && (command.includes('--help') || command.includes('-h')):
        case command.startsWith('cast ba ') && (command.includes('--help') || command.includes('-h')):
        case command.startsWith('cast fee ') && (command.includes('--help') || command.includes('-h')):
        case command.startsWith('cast basefee ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.baseFeeHelp);
          return;

        case command.startsWith('cast base-fee '):
        case command.startsWith('cast ba '):
        case command.startsWith('cast fee '):
        case command.startsWith('cast basefee '): {
          this.html.renderCommandLoading();
          const parts = command.split(' ');
          const blockTag = parts[2] ? CommandRunner.parseBlockTag(parts[2]) : 'latest';
          try {
            const block = await node.getVm().then(vm => vm.blockchain.getBlockByTag(blockTag));
            if (!block) {
              throw new Error('Block not found');
            }
            if (!block.header.baseFeePerGas) {
              throw new Error('Base fee not available for this block');
            }
            const baseFee = block.header.baseFeePerGas;
            this.html.renderCommandResult(baseFee.toString());
          } catch (error) {
            console.error(error);
            this.html.renderCommandResult(`Error: ${error.message}`);
          }
          return;
        }

        case command === 'cast calldata':
        case command.startsWith('cast calldata ') && (command.includes('--help') || command.includes('-h')):
        case command === 'cast cd':
        case command.startsWith('cast cd ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.calldataHelp);
          return;

        case command.startsWith('cast calldata '):
        case command.startsWith('cast cd '): {
          this.html.renderCommandLoading();
          const parts = command.split(' ');
          if (parts.length < 3) {
            this.html.renderCommandResult(HelpText.calldataHelp);
            return;
          }
          const sig = parts[2];
          const args = parts.slice(3);

          try {
            const [name, inTypes] = (() => {
              const match = sig.match(/^([^(]+)\(([^)]*)\)/)
              if (!match) throw new Error('Invalid function signature')
              const [, name, inTypes] = match
              return [name, inTypes.split(',').filter(Boolean)]
            })()

            if (!name || inTypes.length === 0) {
              throw new Error('Invalid function signature')
            }

            if (inTypes.length !== args.length) {
              throw new Error(`Expected ${inTypes.length} arguments, but got ${args.length}`)
            }

            const abi = [{
              name,
              type: 'function',
              inputs: inTypes.map(type => ({ type, name: '' })),
              outputs: []
            }] as const

            const encoded = encodeFunctionData({ abi, functionName: name, args })
            this.html.renderCommandResult(encoded);
          } catch (error) {
            console.error(error);
            this.html.renderCommandResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
          }
          return;
        }
        case command === 'cast compute-address':
        case command.startsWith('cast compute-address ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.computeAddressHelp);
          return;

        case command.startsWith('cast compute-address '): {
          this.html.renderCommandLoading();
          const parts = command.split(' ');
          if (parts.length < 3) {
            this.html.renderCommandResult(HelpText.computeAddressHelp);
            return;
          }
          const deployer = parts[2];
          const nonce = parts[3] ? BigInt(parts[3]) : undefined;

          try {
            let computedAddress: EthjsAddress;
            if (nonce !== undefined) {
              // Compute address with provided nonce
              computedAddress = createContractAddress(
                createAddress(deployer),
                nonce
              );
            } else {
              // Compute address without nonce (use current nonce)
              const currentNonce = await node.getVm().then(vm => vm.stateManager.getAccount(createAddress(deployer))).then(account => account?.nonce ?? 0n);
              computedAddress = createContractAddress(
                createAddress(deployer),
                currentNonce
              );
            }

            this.html.renderCommandResult(computedAddress.toString());
          } catch (error) {
            console.error(error);
            this.html.renderCommandResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
          }
          return;
        }

        case command === 'cast create2':
        case command.startsWith('cast create2 ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.create2Help);
          return;

        case command.startsWith('cast create2 '): {
          this.html.renderCommandLoading();
          const parts = command.split(' ');
          if (parts.length < 5) {
            this.html.renderCommandResult(HelpText.create2Help);
            return;
          }
          const deployer = parts[2];
          const salt = parts[3] as Hex;
          const initCode = parts[4] as Hex;

          try {
            const computedAddress = create2ContractAddress(
              createAddress(deployer),
              salt,
              initCode
            );

            this.html.renderCommandResult(computedAddress.toString());
          } catch (error) {
            console.error(error);
            this.html.renderCommandResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
          }
          return;
        }

        case command.startsWith('cast gas-price ') && (command.includes('--help') || command.includes('-h')):
        case command.startsWith('cast gp ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.gasPriceHelp);
          return;

        case command.startsWith('cast gp'):
        case command.startsWith('cast gas-price'): {
          this.html.renderCommandLoading();

          const request = {
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_gasPrice',
            params: [],
          } as const;

          const response = await gasPriceProcedure(node)(request);

          if ('error' in response && response.error !== undefined) {
            this.html.renderCommandResult(`Error: ${response.error.message}`);
          } else {
            this.html.renderCommandResult(response.result);
          }
          return;
        }


        case command.startsWith('cast balance ') && (command.includes('--help') || command.includes('-h')):
        case command.startsWith('cast b ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.balanceHelp);
          return;

        case command.startsWith('cast balance '):
        case command.startsWith('cast b '): {
          this.html.renderCommandLoading();
          const balanceAddress = command.split(' ')[2];
          if (!balanceAddress) {
            this.html.renderCommandResult('Address is required for balance query');
            return;
          }
          try {
            const balance = await node.getVm().then(vm => vm.stateManager.getAccount(createAddress(balanceAddress))).then(account => account?.balance ?? 0n);
            this.html.renderCommandResult(balance.toString());
          } catch (error) {
            console.error(error);
            this.html.renderCommandResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
          }
          return;
        }

        case command === 'cast logs':
        case command.startsWith('cast logs ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.logsHelp);
          return;

        case command.startsWith('cast logs '): {
          this.html.renderCommandLoading();
          const parts = command.split(' ');
          let fromBlock, toBlock, address, topics;

          // Parse options
          for (let i = 2; i < parts.length; i++) {
            switch (parts[i]) {
              case '--from-block':
                fromBlock = parts[++i];
                break;
              case '--to-block':
                toBlock = parts[++i];
                break;
              case '--address':
                address = parts[++i];
                break;
              default:
                if (!topics) topics = [];
                topics.push(parts[i]);
            }
          }

          try {
            // Get the forked block number as the default fromBlock
            const vm = await node.getVm();
            const forkedBlock = vm.blockchain.blocksByTag.get('forked')!;

            const request: EthGetLogsJsonRpcRequest = {
              jsonrpc: '2.0',
              id: 1,
              method: 'eth_getLogs',
              params: [{
                fromBlock: fromBlock ?? forkedBlock.header.number,
                toBlock: toBlock || 'latest',
                address: address ? createAddress(address).toString() : undefined,
                topics: topics?.length ? [topics] : undefined,
              }],
            };

            const response = await ethGetLogsProcedure(node)(request);

            if ('error' in response && response.error !== undefined) {
              this.html.renderCommandResult(`Error: ${response.error.message}`);
            } else {
              this.html.renderCommandResult(JSON.stringify(response.result, null, 2));
            }
          } catch (error) {
            console.error(error);
            this.html.renderCommandResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
          }
          return;
        }

        case command.startsWith('cast nonce ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.nonceHelp);
          return;

        case command.startsWith('cast nonce '): {
          this.html.renderCommandLoading();
          const address = command.split(' ')[2];
          if (!address) {
            this.html.renderCommandResult('Address is required for nonce query');
            return;
          }
          try {
            const nonce = await node.getVm().then(vm => vm.stateManager.getAccount(createAddress(address))).then(account => account?.nonce ?? 0n);
            this.html.renderCommandResult(nonce.toString());
          } catch (error) {
            console.error(error);
            this.html.renderCommandResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
          }
          return;
        }

        case command === 'cast to-ascii' || command.startsWith('cast to-ascii --help') || command.startsWith('cast to-ascii -h'):
        case command === 'cast tas' || command.startsWith('cast tas --help') || command.startsWith('cast tas -h'):
        case command === 'cast 2as' || command.startsWith('cast 2as --help') || command.startsWith('cast 2as -h'):
          this.html.renderCommandResult(HelpText.toAsciiHelp);
          return;

        case command === 'cast to-base' || command.startsWith('cast to-base --help') || command.startsWith('cast to-base -h'):
        case command === 'cast tr' || command.startsWith('cast tr --help') || command.startsWith('cast tr -h'):
        case command === 'cast 2r' || command.startsWith('cast 2r --help') || command.startsWith('cast 2r -h'):
          this.html.renderCommandResult(HelpText.toBaseHelp);
          return;

        case command === 'cast to-bytes32' || command.startsWith('cast to-bytes32 --help') || command.startsWith('cast to-bytes32 -h'):
        case command === 'cast tb' || command.startsWith('cast tb --help') || command.startsWith('cast tb -h'):
        case command === 'cast 2b' || command.startsWith('cast 2b --help') || command.startsWith('cast 2b -h'):
          this.html.renderCommandResult(HelpText.toBytes32Help);
          return;

        case command === 'cast to-check-sum-address' || command.startsWith('cast to-check-sum-address --help') || command.startsWith('cast to-check-sum-address -h'):
        case command === 'cast ta' || command.startsWith('cast ta --help') || command.startsWith('cast ta -h'):
        case command === 'cast 2a' || command.startsWith('cast 2a --help') || command.startsWith('cast 2a -h'):
          this.html.renderCommandResult(HelpText.toCheckSumAddressHelp);
          return;

        case command === 'cast to-dec' || command.startsWith('cast to-dec --help') || command.startsWith('cast to-dec -h'):
        case command === 'cast td' || command.startsWith('cast td --help') || command.startsWith('cast td -h'):
        case command === 'cast 2d' || command.startsWith('cast 2d --help') || command.startsWith('cast 2d -h'):
          this.html.renderCommandResult(HelpText.toDecHelp);
          return;

        case command === 'cast to-fixed-point' || command.startsWith('cast to-fixed-point --help') || command.startsWith('cast to-fixed-point -h'):
        case command === 'cast tf' || command.startsWith('cast tf --help') || command.startsWith('cast tf -h'):
        case command === 'cast 2f' || command.startsWith('cast 2f --help') || command.startsWith('cast 2f -h'):
          this.html.renderCommandResult(HelpText.toFixedPointHelp);
          return;

        case command === 'cast to-hex' || command.startsWith('cast to-hex --help') || command.startsWith('cast to-hex -h'):
        case command === 'cast th' || command.startsWith('cast th --help') || command.startsWith('cast th -h'):
        case command === 'cast 2h' || command.startsWith('cast 2h --help') || command.startsWith('cast 2h -h'):
          this.html.renderCommandResult(HelpText.toHexHelp);
          return;

        case command === 'cast to-hexdata' || command.startsWith('cast to-hexdata --help') || command.startsWith('cast to-hexdata -h'):
        case command === 'cast thd' || command.startsWith('cast thd --help') || command.startsWith('cast thd -h'):
        case command === 'cast 2hd' || command.startsWith('cast 2hd --help') || command.startsWith('cast 2hd -h'):
          this.html.renderCommandResult(HelpText.toHexdataHelp);
          return;

        case command === 'cast to-int256' || command.startsWith('cast to-int256 --help') || command.startsWith('cast to-int256 -h'):
        case command === 'cast ti' || command.startsWith('cast ti --help') || command.startsWith('cast ti -h'):
        case command === 'cast 2i' || command.startsWith('cast 2i --help') || command.startsWith('cast 2i -h'):
          this.html.renderCommandResult(HelpText.toInt256Help);
          return;

        case command === 'cast to-rlp' || command.startsWith('cast to-rlp --help') || command.startsWith('cast to-rlp -h'):
          this.html.renderCommandResult(HelpText.toRlpHelp);
          return;

        case command === 'cast to-uint256' || command.startsWith('cast to-uint256 --help') || command.startsWith('cast to-uint256 -h'):
        case command === 'cast tu' || command.startsWith('cast tu --help') || command.startsWith('cast tu -h'):
        case command === 'cast 2u' || command.startsWith('cast 2u --help') || command.startsWith('cast 2u -h'):
          this.html.renderCommandResult(HelpText.toUint256Help);
          return;

        case command === 'cast to-unit' || command.startsWith('cast to-unit --help') || command.startsWith('cast to-unit -h'):
        case command === 'cast tun' || command.startsWith('cast tun --help') || command.startsWith('cast tun -h'):
        case command === 'cast 2un' || command.startsWith('cast 2un --help') || command.startsWith('cast 2un -h'):
          this.html.renderCommandResult(HelpText.toUnitHelp);
          return;

        case command === 'cast to-utf8' || command.startsWith('cast to-utf8 --help') || command.startsWith('cast to-utf8 -h'):
        case command === 'cast tu8' || command.startsWith('cast tu8 --help') || command.startsWith('cast tu8 -h'):
        case command === 'cast 2u8' || command.startsWith('cast 2u8 --help') || command.startsWith('cast 2u8 -h'):
          this.html.renderCommandResult(HelpText.toUtf8Help);
          return;

        case command === 'cast to-wei' || command.startsWith('cast to-wei --help') || command.startsWith('cast to-wei -h'):
        case command === 'cast tw' || command.startsWith('cast tw --help') || command.startsWith('cast tw -h'):
        case command === 'cast 2w' || command.startsWith('cast 2w --help') || command.startsWith('cast 2w -h'):
          this.html.renderCommandResult(HelpText.toWeiHelp);
          return;

        case command.startsWith('cast balance ') && (command.includes('--help') || command.includes('-h')):
        case command.startsWith('cast b ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.balanceHelp);
          return;

        case command.startsWith('cast balance '):
        case command.startsWith('cast b '):
          this.html.renderCommandLoading();
          const balanceAddress = command.split(' ')[2];
          if (!balanceAddress) {
            this.html.renderCommandResult('Address is required for balance query');
            return;
          }
          try {
            const balance = await node.getVm().then(vm => vm.stateManager.getAccount(createAddress(balanceAddress))).then(account => account?.balance ?? 0n);
            this.html.renderCommandResult(balance.toString());
          } catch (error) {
            console.error(error);
            this.html.renderCommandResult(`Error: ${error.message}`);
          }
          return;

        case command.startsWith('cast block-number ') && (command.includes('--help') || command.includes('-h')):
        case command.startsWith('cast bn ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.blockNumberHelp);
          return;

        case command.startsWith('cast block-number'):
        case command.startsWith('cast bn'):
          this.html.renderCommandLoading();
          const blockNumber = await node.getVm().then(vm => vm.blockchain.getCanonicalHeadBlock()).then(block => block.header.number);
          this.html.renderCommandResult(blockNumber.toString());
          return;

        case command.startsWith('cast block ') && (command.includes('--help') || command.includes('-h')):
        case command.startsWith('cast bl ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.blockHelp);
          return;

        case command === 'cast block': {
          this.html.renderCommandLoading();
          const blockTag = 'latest'
          const blockData = await node.getVm().then(vm => vm.blockchain.getBlockByTag(blockTag)).then(block => block.toJSON());
          this.html.renderCommandResult(JSON.stringify(blockData, null, 2));
          return;
        }
        case command.startsWith('cast block '):
        case command.startsWith('cast bl '): {
          this.html.renderCommandLoading();
          const blockTag = CommandRunner.parseBlockTag(command.trim().split(' ').at(-1) as string);
          const blockData = await node.getVm().then(vm => vm.blockchain.getBlockByTag(blockTag)).then(block => block.toJSON());
          this.html.renderCommandResult(JSON.stringify(blockData, null, 2));
          return;
        }

        case command === 'cast call':
        case command.startsWith('cast call ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.callHelp);
          return;

        case command.startsWith('cast call '):
          this.html.renderCommandLoading()
          this.html.renderCommandResult(
            JSON.stringify(await CallHandler.handleCallCommand(node, command), null, 2)
          )
          return;

        case command === 'cast send':
        case command.startsWith('cast send ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.sendHelp);
          return;

        case command.startsWith('cast send '):
          this.html.renderCommandLoading()
          this.html.renderCommandResult(
            stringifyWithBigInt(await SendHandler.handleSendCommand(node, command))
          )
          return;

        case command.startsWith('cast chain-id ') && (command.includes('--help') || command.includes('-h')):
        case command.startsWith('cast ci ') && (command.includes('--help') || command.includes('-h')):
        case command.startsWith('cast cid ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.chainIdHelp);
          return;

        case command.startsWith('cast chain-id'):
        case command.startsWith('cast ci'):
        case command.startsWith('cast cid'):
          this.html.renderCommandLoading();
          const chainId = await node.getVm().then(vm => vm.common.id);
          this.html.renderCommandResult(chainId.toString());
          return;

        case command.startsWith('cast code ') && (command.includes('--help') || command.includes('-h')):
        case command.startsWith('cast co ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.codeHelp);
          return;

        case command.startsWith('cast code '):
        case command.startsWith('cast co '):
          this.html.renderCommandLoading();
          const codeParts = command.split(' ');
          if (codeParts.length < 3) {
            throw new Error('Usage: cast code <ADDRESS>');
          }
          const address = codeParts[2] as `0x${string}`;
          const code = await node.getVm().then(vm => vm.stateManager.getContractCode(createAddress(address)));
          this.html.renderCommandResult(`${code}`);
          return;

        case command.startsWith('cast keccak ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.keccakHelp);
          return;

        case command.startsWith('cast keccak '):
          this.html.renderCommandLoading();
          const keccakParts = command.split(' ');
          if (keccakParts.length < 3) {
            throw new Error('Usage: cast keccak <DATA>');
          }
          const data = keccakParts.at(-1);
          if (!data) {
            throw new Error('No data provided for keccak hash');
          }
          const hash = keccak256(data as `0x`);
          this.html.renderCommandResult(`${hash}`);
          return;

        case command.startsWith('cast storage ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.storageHelp);
          return;

        case command.startsWith('cast storage '):
          this.html.renderCommandLoading();
          const storageParts = command.split(' ');
          if (storageParts.length < 4) {
            throw new Error('Usage: cast storage <ADDRESS> <SLOT>');
          }
          const storageAddress = storageParts[2] as `0x${string}`;
          let slot = storageParts[3] as `0x${string}`;
          if (!slot.startsWith('0x')) {
            slot = numberToHex(BigInt(slot), { size: 32 });
          } else {
            slot = numberToHex(hexToBigInt(slot), { size: 32 })
          }
          const storageValue = await node.getVm().then(vm => vm.stateManager.getContractStorage(createAddress(storageAddress), hexToBytes(slot)));
          this.html.renderCommandResult(`${storageValue}`);
          return;

        case command.startsWith('cast receipt ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.receiptHelp);
          return;

        case command.startsWith('cast receipt '):
          this.html.renderCommandLoading();
          const txParts = command.split(' ');
          if (txParts.length < 3) {
            throw new Error('Usage: cast tx <TX_HASH>');
          }
          const txHash = txParts[2] as `0x${string}`;
          const receipt = await node.getReceiptsManager().then(manager => manager.getReceiptByTxHash(hexToBytes(txHash)));
          if (!receipt) {
            throw new Error('Transaction receipt not found');
          }
          this.html.renderCommandResult(`${JSON.stringify(receipt, null, 2)}`);
          return;

        case command.startsWith('cast sig ') && (command.includes('--help') || command.includes('-h')):
          this.html.renderCommandResult(HelpText.sigHelp);
          return;

        case command.startsWith('cast sig '):
          this.html.renderCommandLoading();
          const sigParts = command.split(' ');
          if (sigParts.length < 3) {
            throw new Error('Usage: cast sig <SIGNATURE>');
          }
          const signature = sigParts.slice(2).join(' ');
          try {
            const selector = keccak256(signature as Hex).slice(0, 10);
            this.html.renderCommandResult(selector);
          } catch (error) {
            console.error(error);
            this.html.renderCommandResult(`Error: ${error.message}`);
          }
          return;

        default:
          throw new Error(`Unknown command: ${command}. Try running cast --help`);
      }
    } catch (error) {
      console.error(error);
      this.html.renderCommandResult(`Error: ${error.message}`);
    }
  }
}
