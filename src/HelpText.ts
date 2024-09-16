export class HelpText {
        static readonly help = `Perform Ethereum RPC calls from the comfort of your command line
A cast-like cli in the browser built with Tevm

Usage: cast <COMMAND>

Commands:
  4byte                  Get the function selector for a function signature
  abi-decode             Decode ABI-encoded input or output data
  abi-encode             ABI-encode input data
  access-list            Create an access list for a transaction [aliases: al]
  age                    Get the timestamp of a block
  balance                Get the balance of an account in wei [aliases: b]
  base-fee               Get the base fee of a block
  block                  Get information about a block [aliases: bl]
  block-number           Get the latest block number [aliases: bn]
  call                   Perform a call [aliases: c]
  calldata               ABI-encode input data
  chain-id               Get the Ethereum chain ID [aliases: ci, cid]
  code                   Get the runtime bytecode of a contract [aliases: co]
  compute-address        Compute the contract address from a given nonce and deployer address
  create2                Compute the address of a contract created with CREATE2
  estimate               Estimate gas cost of a transaction [aliases: e]
  gas-price              Get the current gas price [aliases: gp]
  keccak                 Hash data using keccak-256
  logs                   Get logs by signature or topic [aliases: l]
  nonce                  Get the nonce for an account [aliases: n]
  receipt                Get information about a transaction [aliases: r]
  send                   Publish a transaction. All accounts are automatically impersonated
  sig                    Get the selector for a function [aliases: s]
  storage                Get the raw value of a contract's storage slot [aliases: st]


Open an issue if you would like more functionality added
Most cast apis could be supported: https://github.com/evmts/tevm-cast/issues

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
`;

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

        static readonly sendHelp = `Sign and publish a transaction (MVP version)

Usage: cast send [OPTIONS] <TO> [SIG] [ARGS]...

Arguments:
  <TO>            The destination of the transaction
  [SIG]           The signature of the function to call
  [ARGS]...       The arguments of the function to call

Options:
  -f, --from <ADDRESS>    The sender account to impersonate (defaults to first Anvil test account)
  -h, --help              Print help

Transaction options:
  --gas-limit <GAS_LIMIT>           Gas limit for the transaction
  --gas-price <PRICE>               Gas price for the transaction
  --value <VALUE>                   Ether to send in the transaction (in wei)
  --nonce <NONCE>                   Nonce for the transaction`;
  static readonly fourByteHelp = `Get the function signatures for the given selector from https://openchain.xyz

  Usage: cast 4byte [SELECTOR]
  
  Arguments:
    [SELECTOR]  The function selector
  
  Options:
    -h, --help  Print help`;
  
      static readonly abiDecodeHelp = `Decode ABI-encoded input or output data
  
  Usage: cast abi-decode [OPTIONS] <SIG> <CALLDATA>
  
  Arguments:
    <SIG>       The function signature in the format '<name>(<in-types>)(<out-types>)'
    <CALLDATA>  The ABI-encoded calldata
  
  Options:
    -i, --input  Decode input data instead of output data
    -h, --help   Print help`;
  
      static readonly abiEncodeHelp = `ABI encode the given function argument, excluding the selector
  
  Usage: cast abi-encode [OPTIONS] <SIG> [ARGS]...
  
  Arguments:
    <SIG>      The function signature
    [ARGS]...  The arguments of the function
  
  Options:
        --packed  Whether to use packed encoding
    -h, --help    Print help`;
  
      static readonly ageHelp = `Get the timestamp of a block
  
  Usage: cast age [OPTIONS] [BLOCK]
  
  Arguments:
    [BLOCK]  The block height to query at. Can also be the tags earliest, finalized, safe, latest, or pending.
  
  Options:
    -h, --help  Print help`;
  
      static readonly baseFeeHelp = `Get the basefee of a block
  
  Usage: cast base-fee [OPTIONS] [BLOCK]
  
  Arguments:
    [BLOCK]  The block height to query at. Can also be the tags earliest, finalized, safe, latest, or pending.
  
  Options:
    -h, --help  Print help`;
  
      static readonly calldataHelp = `ABI-encode a function with arguments
  
  Usage: cast calldata <SIG> [ARGS]...
  
  Arguments:
    <SIG>      The function signature in the format '<name>(<in-types>)(<out-types>)'
    [ARGS]...  The arguments to encode
  
  Options:
    -h, --help  Print help`;
  
      static readonly computeAddressHelp = `Compute the contract address from a given nonce and deployer address
  
  Usage: cast compute-address [OPTIONS] [ADDRESS]
  
  Arguments:
    [ADDRESS]  The deployer address
  
  Options:
        --nonce <NONCE>  The nonce of the deployer address
    -h, --help           Print help`;
  
      static readonly create2Help = `Generate a deterministic contract address using CREATE2
  
  Usage: cast create2 [OPTIONS]
  
  Options:
    -d, --deployer <ADDRESS>     Address of the contract deployer [default: 0x4e59b44847b379578588920ca78fbf26c0b4956c]
    -i, --init-code <HEX>        Init code of the contract to be deployed
        --init-code-hash <HASH>  Init code hash of the contract to be deployed
    -h, --help                   Print help`;
  
      static readonly estimateHelp = `Estimate the gas cost of a transaction
  
  Usage: cast estimate [OPTIONS] [TO] [SIG] [ARGS]...
  
  Arguments:
    [TO]        The destination of the transaction
    [SIG]       The signature of the function to call
    [ARGS]...   The arguments of the function to call
  
  Options:
    -h, --help  Print help`;
  
      static readonly gasPriceHelp = `Get the current gas price
  
  Usage: cast gas-price [OPTIONS]
  
  Options:
    -h, --help  Print help`;
  
      static readonly logsHelp = `Get logs by signature or topic
  
  Usage: cast logs [OPTIONS] [SIG_OR_TOPIC] [TOPICS_OR_ARGS]...
  
  Arguments:
    [SIG_OR_TOPIC]       The signature of the event to filter logs by which will be converted to the first topic or a topic to filter on
    [TOPICS_OR_ARGS]...  If used with a signature, the indexed fields of the event to filter by. Otherwise, the remaining topics of the filter
  
  Options:
        --from-block <FROM_BLOCK>  The block height to start query at (defaults to fork block)
        --to-block <TO_BLOCK>      The block height to stop query at (defaults to latest)
        --address <ADDRESS>        The contract address to filter on
    -h, --help                     Print help`;
  
      static readonly nonceHelp = `Get the nonce for an account
  Usage: cast nonce [OPTIONS] <WHO>
  
  Arguments:
    <WHO>  The address to get the nonce for
  
  Options:
    -h, --help  Print help`;
  
      static readonly sigHelp = `Get the selector for a function
  
  Usage: cast sig [SIG] [OPTIMIZE]
  
  Arguments:
    [SIG]       The function signature, e.g. transfer(address,uint256)
    [OPTIMIZE]  Optimize signature to contain provided amount of leading zeroes in selector
  
  Options:
    -h, --help  Print help`;
    static readonly toAsciiHelp = `Convert hex data to an ASCII string

    Usage: cast to-ascii <HEX>
    
    Arguments:
      <HEX>  The hex data to convert
    
    Options:
      -h, --help  Print help
    
    Aliases: tas, 2as`;
    
      static readonly toBaseHelp = `Converts a number of one base to another
    
    Usage: cast to-base <VALUE> <FROM_BASE> <TO_BASE>
    
    Arguments:
      <VALUE>      The value to convert
      <FROM_BASE>  The base to convert from
      <TO_BASE>    The base to convert to
    
    Options:
      -h, --help  Print help
    
    Aliases: tr, 2r`;
    
      static readonly toBytes32Help = `Right-pads hex data to 32 bytes
    
    Usage: cast to-bytes32 <HEX>
    
    Arguments:
      <HEX>  The hex data to pad
    
    Options:
      -h, --help  Print help
    
    Aliases: tb, 2b`;
    
      static readonly toCheckSumAddressHelp = `Convert an address to a checksummed format (EIP-55)
    
    Usage: cast to-check-sum-address <ADDRESS>
    
    Arguments:
      <ADDRESS>  The address to convert
    
    Options:
      -h, --help  Print help
    
    Aliases: ta, 2a`;
    
      static readonly toDecHelp = `Converts a number of one base to decimal
    
    Usage: cast to-dec <VALUE>
    
    Arguments:
      <VALUE>  The value to convert
    
    Options:
      -h, --help  Print help
    
    Aliases: td, 2d`;
    
      static readonly toFixedPointHelp = `Convert an integer into a fixed point number
    
    Usage: cast to-fixed-point <INTEGER> <DECIMALS>
    
    Arguments:
      <INTEGER>   The integer to convert
      <DECIMALS>  The number of decimals
    
    Options:
      -h, --help  Print help
    
    Aliases: tf, 2f`;
    
      static readonly toHexHelp = `Converts a number to hex
    
    Usage: cast to-hex <VALUE>
    
    Arguments:
      <VALUE>  The value to convert
    
    Options:
      -h, --help  Print help
    
    Aliases: th, 2h`;
    
      static readonly toHexdataHelp = `Normalize the input to lowercase, 0x-prefixed hex
    
    Usage: cast to-hexdata <INPUT>
    
    Arguments:
      <INPUT>  The input to normalize
    
    Options:
      -h, --help  Print help
    
    Aliases: thd, 2hd`;
    
      static readonly toInt256Help = `Convert a number to a hex-encoded int256
    
    Usage: cast to-int256 <VALUE>
    
    Arguments:
      <VALUE>  The value to convert
    
    Options:
      -h, --help  Print help
    
    Aliases: ti, 2i`;
    
      static readonly toRlpHelp = `RLP encodes hex data, or an array of hex data
    
    Usage: cast to-rlp <INPUT>...
    
    Arguments:
      <INPUT>...  The input to encode
    
    Options:
      -h, --help  Print help`;
    
      static readonly toUint256Help = `Convert a number to a hex-encoded uint256
    
    Usage: cast to-uint256 <VALUE>
    
    Arguments:
      <VALUE>  The value to convert
    
    Options:
      -h, --help  Print help
    
    Aliases: tu, 2u`;
    
      static readonly toUnitHelp = `Convert an ETH amount into another unit (ether, gwei or wei)
    
    Usage: cast to-unit <VALUE> <UNIT>
    
    Arguments:
      <VALUE>  The value to convert
      <UNIT>   The unit to convert to (ether, gwei, wei)
    
    Options:
      -h, --help  Print help
    
    Aliases: tun, 2un`;
    
      static readonly toUtf8Help = `Convert hex data to a UTF-8 string
    
    Usage: cast to-utf8 <HEX>
    
    Arguments:
      <HEX>  The hex data to convert
    
    Options:
      -h, --help  Print help
    
    Aliases: tu8, 2u8`;
    
      static readonly toWeiHelp = `Convert an ETH amount to wei
    
    Usage: cast to-wei <VALUE>
    
    Arguments:
      <VALUE>  The ETH amount to convert
    
    Options:
      -h, --help  Print help
    
    Aliases: tw, 2w`;
}
