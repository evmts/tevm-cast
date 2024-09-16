import { HelpText } from './HelpText'

export class FetchFunctionSignature {
  constructor() {}

  async run4Byte(args: string[]): Promise<string> {
    if (args.length !== 1) {
      return HelpText.fourByteHelp
    }

    const selector = args[0]
    
    try {
      const response = await fetch(`https://api.openchain.xyz/signature-database/v1/lookup?function=${selector}&filter=true`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: LookupResponse = await response.json()
      
      if (data.ok && data.result.function && data.result.function[selector]) {
        const signatures = data.result.function[selector]
          .filter(sig => !sig.filtered)
          .map(sig => sig.name)
        
        if (signatures.length > 0) {
          return signatures.join('\n')
        } else {
          return 'No matching function signatures found.'
        }
      } else {
        return 'No matching function signatures found.'
      }
    } catch (error) {
      return `Error fetching function signatures: ${error}`
    }
  }

  // ... other methods ...
}

interface LookupResponse {
  ok: boolean
  result: {
    function?: {
      [selector: string]: Array<{
        name: string
        filtered: boolean
      }>
    }
    event?: {
      [topic: string]: Array<{
        name: string
        filtered: boolean
      }>
    }
  }
}