export class HelpText {
  static readonly help = `Perform Ethereum RPC calls from the comfort of your command line
A cast-like cli in the browser built with Tevm

Usage: cast <COMMAND>

Commands:
  balance                Get the balance of an account in wei [aliases: b]
  block                  Get information about a block [aliases: bl]
  block-number           Get the latest block number [aliases: bn]
  call                   Perform a call on an account without publishing a transaction [aliases: c]
  chain-id               Get the Ethereum chain ID [aliases: ci, cid]
  code                   Get the runtime bytecode of a contract [aliases: co]
  keccak                 Hash data using keccak-256
  storage                Get the raw value of a contract's storage slot
  receipt                     Get information about a transaction

Options:
  -h, --help     Print help
`;

  static readonly accessListHelp = `Create an access list for a transaction

Usage: cast access-list [OPTIONS] <TO> [SIG] [ARGS]...

Arguments:
  <TO>
          The address to call
  [SIG]
          The signature of the function to call
  [ARGS]...
          The arguments to pass to the function

Options:
  -h, --help
          Print help (see a summary with '-h')`;

  static readonly balanceHelp = `Get the balance of an account in wei

Usage: cast balance [OPTIONS] <WHO>

Arguments:
  <WHO>
          The account to query

Options:
  -B, --block <BLOCK>
          The block height to query at.
          
          Can also be the tags earliest, finalized, safe, latest, or pending.

      --erc20 <ERC20>
          erc20 address to query, with the method \`balanceOf(address) return (uint256)\``;

  static readonly blockHelp = `Get information about a block

Usage: cast block [OPTIONS] [BLOCK]

Arguments:
  [BLOCK]
          The block height to query at. Or block hash
          
          Can also be the tags earliest, finalized, safe, latest, or pending.

Options:
  -h, --help
          Print help (see a summary with '-h')`;

  static readonly blockNumberHelp = `Get the latest block number

Usage: cast block-number [OPTIONS]

Options:
  -h, --help
          Print help (see a summary with '-h')`;

  static readonly callHelp = `Perform a call on an account without publishing a transaction

Usage: cast call [OPTIONS] <TO> [SIG] [ARGS]...

Arguments:
  <TO>
          The address to call
  [SIG]
          The signature of the function to call someFunction(uint256,bytes32)
  [ARGS]...
          The arguments to pass to the function

Options:
  -h, --help
          Print help (see a summary with '-h')

      --access-list
          Create an access list for the transaction

      --trace
          Print a full trace of the transaction execution

      --impersonate-transaction
          Impersonate the transaction sender`;

  static readonly chainIdHelp = `Get the Ethereum chain ID

Usage: cast chain-id [OPTIONS]

Options:
  -h, --help
          Print help (see a summary with '-h')`;

  static readonly codeHelp = `Get the runtime bytecode of a contract

Usage: cast code [OPTIONS] <ADDRESS>

Arguments:
  <ADDRESS>
          The address of the contract

Options:
  -h, --help
          Print help (see a summary with '-h')`;

  static readonly keccakHelp = `Hash data using keccak-256

Usage: cast keccak [OPTIONS] <DATA>

Arguments:
  <DATA>
          The data to hash

Options:
  -h, --help
          Print help (see a summary with '-h')`;

  static readonly storageHelp = `Get the raw value of a contract's storage slot

Usage: cast storage [OPTIONS] <ADDRESS> <SLOT>

Arguments:
  <ADDRESS>
          The address of the contract
  <SLOT>
          The storage slot to query

Options:
  -h, --help
          Print help (see a summary with '-h')`;

  static readonly receiptHelp = `Get receipt of a transaction

Usage: cast receipt [OPTIONS] <TX_HASH>

Arguments:
  <TX_HASH>
          The transaction hash

Options:
  -h, --help
          Print help (see a summary with '-h')`;
}
