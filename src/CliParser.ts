import { type Hex } from "tevm";

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