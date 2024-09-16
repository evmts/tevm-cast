import { PREFUNDED_ACCOUNTS, type TevmNode } from "tevm";
import { bytesToHex, encodeFunctionData, hexToBytes } from "viem";
import { createAddress } from "tevm/address";

export class SendHandler {
  public static readonly handleSendCommand = async (node: TevmNode, command: string) => {
    const parts = command.split(' ');
    if (parts.length < 3) {
      throw new Error('Usage: cast send <to> <sig> [args...] --from <address> [--value <value>] [--gas-limit <limit>] [--gas-price <price>] [--nonce <nonce>] [--access-list] [--trace]');
    }
    const to = parts[2] as `0x${string}`;
    let sig = parts[3];
    if (sig?.startsWith('"') && sig?.endsWith('"')) {
      sig = sig.slice(1, -1);
    }
    const args = parts.slice(4).filter(arg => !arg.startsWith('--'));

    const functionName = sig.slice(0, sig.indexOf('('));
    const paramString = sig.slice(sig.indexOf('(') + 1, sig.lastIndexOf(')'));
    const paramTypes = paramString.split(',').map(type => type.trim()).filter(type => type !== '');

    const abi = [{ name: functionName, type: 'function', inputs: paramTypes.map(type => ({ type })), outputs: [] }];

    const parsedArgs = args.map((arg, index) => {
      if (index < paramTypes.length && paramTypes[index]) {
        if (paramTypes[index].startsWith('uint') || paramTypes[index].startsWith('int')) {
          return BigInt(arg);
        }
      }
      return arg;
    });

    const encodedData = encodeFunctionData({ abi, args: parsedArgs, functionName });

    const options: any = {
      to,
      data: encodedData,
    };

    // Parse additional options
    const fromIndex = parts.indexOf('--from');
    const impersonatedAddress = fromIndex !== -1 ? parts[fromIndex + 1] : PREFUNDED_ACCOUNTS[0].address;

    const valueIndex = parts.indexOf('--value');
    if (valueIndex !== -1) options.value = BigInt(parts[valueIndex + 1]);

    const gasLimitIndex = parts.indexOf('--gas-limit');
    if (gasLimitIndex !== -1) options.gasLimit = BigInt(parts[gasLimitIndex + 1]);

    const gasPriceIndex = parts.indexOf('--gas-price');
    if (gasPriceIndex !== -1) options.gasPrice = BigInt(parts[gasPriceIndex + 1]);

    const nonceIndex = parts.indexOf('--nonce');
    if (nonceIndex !== -1) options.nonce = BigInt(parts[nonceIndex + 1]);

    const includeAccessList = parts.includes('--access-list');
    const includeTrace = parts.includes('--trace');

    const vm = await node.getVm();

    try {
      const { createImpersonatedTx } = await import('tevm/tx');
      const baseFeePerGas = (await vm.blockchain.getCanonicalHeadBlock()).header.baseFeePerGas!;
      const maxPriorityFeePerGas = BigInt(2000000000); // Set a reasonable priority fee
      const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas; // Ensure maxFeePerGas is always higher

      const tx = createImpersonatedTx({
        impersonatedAddress: createAddress(impersonatedAddress),
        data: hexToBytes(options.data),
        to: options.to && createAddress(options.to),
        chainId: vm.common.id,
        value: options.value,
        gasLimit: options.gasLimit ?? (await vm.blockchain.getCanonicalHeadBlock()).header.gasLimit,
        maxFeePerGas: options.gasPrice ?? maxFeePerGas,
        maxPriorityFeePerGas,
        nonce: options.nonce ?? (await vm.stateManager.getAccount(createAddress(impersonatedAddress)))?.nonce ?? 0n,
      });

      const { runTx } = await import('tevm/vm');
      const result = await runTx(vm)({
        tx,
        skipBalance: true,
        skipNonce: true,
        skipBlockGasLimitValidation: true,
        skipHardForkValidation: true,
      });

      const {
        receipt,
        amountSpent,
        execResult: {
          executionGasUsed,
          returnValue,
          createdAddresses,
          exceptionError,
          gas,
          logs,
        },
        gasRefund,
        minerValue,
        totalGasSpent,
        blobGasUsed,
        createdAddress,
      } = result;

      const response: any = {
        executionGasUsed: executionGasUsed.toString(),
        returnValue: bytesToHex(returnValue),
        createdAddresses: createdAddresses ? Array.from(createdAddresses).map(addr => addr.toString()) : undefined,
        exceptionError: exceptionError,
        gas: gas?.toString(),
        logs: logs?.map(log => ({
          address: log[0].toString(),
          topics: log[1].map(topic => bytesToHex(topic)),
          data: bytesToHex(log[2])
        })),
        receipt: receipt,
        amountSpent: amountSpent !== undefined ? amountSpent.toString() : undefined,
        gasRefund: gasRefund !== undefined ? gasRefund.toString() : undefined,
        minerValue: minerValue !== undefined ? minerValue.toString() : undefined,
        totalGasSpent: totalGasSpent !== undefined ? totalGasSpent.toString() : undefined,
        blobGasUsed: blobGasUsed !== undefined ? blobGasUsed.toString() : undefined,
        createdAddress: createdAddress,
      };

      if (includeAccessList) {
        response.accessList = result.accessList;
      }

      if (includeTrace) {
        response.trace = result.execResult.runState;
      }

      return response;
    } catch (error) {
      return error as Error;
    }
  };
}
