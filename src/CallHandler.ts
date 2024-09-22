import { type Address, type Hex, parseAbi, PREFUNDED_ACCOUNTS, type TevmNode } from "tevm";
import { type AbiFunction, bytesToHex, encodeFunctionData, getAddress, hexToBytes, numberToHex } from "viem";
import type { Vm } from "tevm/vm";
import type { AccessList, AccessListItem } from "tevm/tx";
import { createAddress } from "tevm/address";
import { InternalError } from "tevm/errors";
import type { EvmRunCallOpts } from "tevm/evm";
import type { DebugTraceCallResult } from "tevm/actions";

// TODO this is copy pasta from CommandRunner.ts
// We should create a new class called CLIParser that is in charge of parsing the CLI
export class CLIParser {
  public static parseBlockTag(tag: string): Hex | bigint | 'latest' {
    if (tag.startsWith('0x')) {
      return tag as Hex;
    }
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(tag[0])) {
      return BigInt(tag);
    }
    return (tag ?? 'latest') as 'latest';
  }
}

export class CallHandler {
  public static readonly handleCallCommand = async (node: TevmNode, command: string) => {
    const vm = await node.getVm()
    const parts = command.split(' ');
    if (parts.length < 4) {
      throw new Error('Usage: cast call <to> <sig> [args...] [options]');
    }
    const to = parts[2] as `0x${string}`;
    let sig = parts[3];
    if (sig.startsWith('"') && sig.endsWith('"')) {
      sig = sig.slice(1, -1);
    }
    const args = parts.slice(4).filter(arg => !arg.startsWith('--'));

    const functionName = sig.slice(0, sig.indexOf('('));
    const paramString = sig.slice(sig.indexOf('(') + 1, sig.lastIndexOf(')'));
    const paramTypes = paramString.split(',').map(type => type.trim()).filter(type => type !== '');

    // note we are just hardcoding a return type because we don't use it 
    const abi = parseAbi([`function ${functionName}(${paramTypes.join(',')}) view returns (uint256)`] as string[]);

    const parsedArgs = args.map((arg, index) => {
      if (paramTypes[index].startsWith('uint') || paramTypes[index].startsWith('int')) {
        return BigInt(arg);
      }
      return arg;
    });

    const abiItem = abi.find(item => item.type === 'function' && item.name === functionName) as AbiFunction;
    if (!abiItem) {
      throw new Error(`Function ${functionName} not found in ABI`);
    }
    const encodedData = encodeFunctionData({ abi, args: parsedArgs });

    const options: any = {
      to,
      data: encodedData,
    };

    if (parts.includes('--access-list')) {
      options.accessList = true;
    }
    if (parts.includes('--trace')) {
      options.trace = true;
    }
    if (parts.includes('--from')) {
      options.from = createAddress(parts[parts.indexOf('--from') + 1]);
    }
    if (parts.includes('--value')) {
      options.value = BigInt(parts[parts.indexOf('--value') + 1]);
    }
    if (parts.includes('--gas-limit')) {
      options.gasLimit = BigInt(parts[parts.indexOf('--gas-limit') + 1]);
    }
    if (parts.includes('--gas-price')) {
      options.gasPrice = BigInt(parts[parts.indexOf('--gas-price') + 1]);
    }
    if (parts.includes('--block')) {
      options.block = vm.blockchain.getBlockByTag(CLIParser.parseBlockTag(parts[parts.indexOf('--block') + 1]));
    }
    if (parts.includes('--impersonate-transaction')) {
      options.createTransaction = true;
      options.skipBalance = true;
      let impersonatedAddress: Address;
      if (parts.includes('--impersonate-transaction')) {
        impersonatedAddress = getAddress(parts.find(part => part.startsWith('--impersonate-transaction'))?.split(/[=\s]/)[1] || parts[parts.indexOf('--impersonate-transaction') + 1]);

        if (!impersonatedAddress || !impersonatedAddress.startsWith('0x')) {
          throw new Error('Invalid or missing impersonated address. Usage: --impersonate-transaction=0x... or --impersonate-transaction 0x...');
        }
      } else {
        impersonatedAddress = PREFUNDED_ACCOUNTS[0].address;
      }

      try {
        const { createImpersonatedTx } = await import('tevm/tx')
        const tx = createImpersonatedTx({
          impersonatedAddress: createAddress(impersonatedAddress),
          data: hexToBytes(options.data),
          to: options.to && createAddress(options.to),
          chainId: vm.common.id,
        });
        const { runTx } = await import('tevm/vm')
        const { accessList, receipt } = await runTx(vm)({
          tx,
          reportAccessList: true,
        });
        return {
          receipt: receipt,
          accessList: accessList
        }
      } catch (error) {
        return error as Error
      }
      return;
    }

    try {
      await vm.evm.journal.cleanup()
      vm.evm.journal.startReportingAccessList()
      vm.evm.journal.startReportingPreimages?.()
      await vm.evm.journal.checkpoint()
      const result = await CallHandler.runCallWithTrace(vm, {
        data: hexToBytes(options.data),
        to: options.to && createAddress(options.to),
        value: options.value,
        gasLimit: options.gasLimit,
        gasPrice: options.gasPrice,
        caller: options.from && createAddress(options.from),
        origin: options.from && createAddress(options.from),
      });

      const accessList: AccessList = []
      if (!vm.evm.journal.accessList) {
        throw new InternalError('expected journal accesslist to be defined')
      }
      for (const [address, set] of vm.evm.journal.accessList) {
        const item: AccessListItem = {
          address: address as Address,
          storageKeys: [],
        }
        for (const slot of set) {
          item.storageKeys.push(slot as Hex)
        }
        accessList.push(item)
      }

      return {
        data: bytesToHex(result.execResult.returnValue),
        blobGasUsed: result.execResult.blobGasUsed?.toString(),
        createdAddresses: [...result.execResult.createdAddresses ?? []],
        ...(result.execResult.exceptionError !== undefined ? { exceptionError: result.execResult.exceptionError } : {}),
        logs: result.execResult.logs,
        executionGasUsed: result.execResult.executionGasUsed.toString(),
        ...(options.accessList ? { accessList: accessList } : {}),
        ...(options.trace ? {
          trace: {
            gas: result.trace.gas.toString(),
            returnValue: result.trace.returnValue,
            failed: result.trace.failed,
            structLogs: result.trace.structLogs.map(log => ({
              ...log,
              gas: log.gas.toString(),
              gasCost: log.gasCost.toString()
            }))
          }
        } : {}),
      }
    } catch (error) {
      return error
    }
  }

  // uses tevm events.on to generate a trace
  // note we could have just used debug_traceCall instead
  private static readonly runCallWithTrace = async (vm: Vm, params: EvmRunCallOpts) => {
    /**
     * As the evm runs we will be updating this trace object
     * and then returning it
     */
    const trace = {
      gas: 0n,
      /**
       * @type {import('@tevm/utils').Hex}
       */
      returnValue: '0x0',
      failed: false,
      structLogs: [] as Array<DebugTraceCallResult['structLogs'][number]>,
    }

    /**
     * On every step push a struct log
     */
    vm.evm.events?.on('step', async (step, next) => {
      trace.structLogs.push({
        pc: step.pc,
        op: step.opcode.name,
        gasCost: BigInt(step.opcode.fee) + (step.opcode.dynamicFee ?? 0n),
        gas: step.gasLeft,
        depth: step.depth,
        stack: step.stack.map((code) => numberToHex(code)),
      })
      next?.()
    })

    /**
     * After any internal call push error if any
     */
    vm.evm.events?.on('afterMessage', (data, next) => {
      if (data.execResult.exceptionError !== undefined && trace.structLogs.length > 0) {
        // Mark last opcode trace as error if exception occurs
        const nextLog = trace.structLogs[trace.structLogs.length - 1]
        if (!nextLog) {
          throw new Error('No structLogs to mark as error')
        }
        // TODO fix this type
        Object.assign(nextLog, {
          error: data.execResult.exceptionError,
        })
      }
      next?.()
    })

    const runCallResult = await vm.evm.runCall(params)

    trace.gas = runCallResult.execResult.executionGasUsed
    trace.failed = runCallResult.execResult.exceptionError !== undefined
    trace.returnValue = bytesToHex(runCallResult.execResult.returnValue)

    return {
      ...runCallResult,
      trace,
    }
  }
}
