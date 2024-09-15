/**
 * Represents the HTML elements and rendering methods for the CLI interface.
 * @class
 */
export class Html {
  public readonly networkSelect = document.getElementById('networkSelect')! as HTMLSelectElement;
  public readonly rpcUrlDiv = document.getElementById('rpcUrl')! as HTMLInputElement;
  public readonly networkInfo = document.getElementById('networkInfo')! as HTMLDivElement;
  public readonly chainIdCell = document.getElementById('chainId')! as HTMLTableCellElement;
  public readonly baseFeeCell = document.getElementById('baseFee')! as HTMLTableCellElement;
  public readonly gasLimitCell = document.getElementById('gasLimit')! as HTMLTableCellElement;
  public readonly forkBlockCell = document.getElementById('forkBlock')! as HTMLTableCellElement;
  public readonly commandInput = document.getElementById('commandInput')! as HTMLInputElement;
  public readonly output = document.getElementById('output')! as HTMLDivElement;
  public readonly skeletonLoader = document.getElementById('skeletonLoader')! as HTMLDivElement;
  public readonly helpIcon = document.getElementById('helpIcon')! as HTMLDivElement;
  public readonly runButton = document.getElementById('runButton')! as HTMLButtonElement;
  public readonly historyDropdown = document.getElementById('historyDropdown')! as HTMLSelectElement;

  renderCommandLoading = () => {
    this.output.style.display = 'none';
    this.skeletonLoader.style.display = 'block';
  };

  renderCommandResult = (content: string) => {
    this.skeletonLoader.style.display = 'none';
    this.output.style.display = 'block';
    this.output.textContent = content;
  };

  renderHistoryDropdown = (history: string[]) => {
    while (this.historyDropdown.options.length > 1) {
      this.historyDropdown.remove(1);
    }
    history.forEach(command => {
      const option = document.createElement('option');
      option.value = command;
      option.textContent = command;
      this.historyDropdown.add(option);
    });
  }

}
