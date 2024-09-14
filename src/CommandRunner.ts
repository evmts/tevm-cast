import { Hex, type TevmNode } from "tevm";
import { hexToBytes, keccak256, numberToHex } from "viem";
import { HelpText } from "./HelpText.js";
import { createAddress } from "tevm/address";
import type { Html } from "./Html";
import { CallHandler } from "./CallHandler";

export class CommandRunner {
  constructor(private readonly html: Html) {}

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
  public readonly runCommand= async (node: TevmNode, command: string): Promise<void> => {
    try {
      switch (true) {
        case '' === command:
        case 'cast' === command:
        case 'cast --help' === command:
        case 'cast -h' === command:
          this.html.renderCommandResult(HelpText.help);
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

        case command.startsWith('cast block '):
        case command.startsWith('cast bl '):
          this.html.renderCommandLoading();
          const blockTag = CommandRunner.parseBlockTag(command.trim().split(' ').at(-1) as string);
          const blockData = await node.getVm().then(vm => vm.blockchain.getBlockByTag(blockTag)).then(block => block.toJSON());
          this.html.renderCommandResult(JSON.stringify(blockData, null, 2));
          return;

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
            slot = numberToHex(BigInt(slot));
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

        default:
          throw new Error(`Unknown command: ${command}. Try running cast --help`);
      }
    } catch (error) {
      console.error(error);
      this.html.renderCommandResult(`Error: ${error.message}`);
    }
  }
}