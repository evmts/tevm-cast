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

  public readonly renderCommandLoading = () => {
    this.output.style.display = 'none';
    this.skeletonLoader.style.display = 'block';
  };

  public readonly renderCommandResult = (content: string) => {
    this.skeletonLoader.style.display = 'none';
    this.output.style.display = 'block';
    if (this.isJson(content)) {
      const highlightedJson = this.syntaxHighlight(content);
      this.output.innerHTML = highlightedJson;
    } else {
      this.output.textContent = content;
    }
  };

  public readonly renderHistoryDropdown = (history: string[]) => {
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

  /**
   * Focuses on the command input and registers the Enter key listener.
   * Removes the listener when the input loses focus.
   */
  public readonly focusOnCommandInput = () => {
    this.commandInput.focus();
    this.addEnterKeyListener()
  }

  public readonly addEnterKeyListener = () => {
    this.commandInput.addEventListener('keydown', this.handleCommandEnterKey);
    this.commandInput.addEventListener('blur', () => {
      this.commandInput.removeEventListener('keydown', this.handleCommandEnterKey);
    });
  }

  /**
   * Handles the Enter key press on the command input.
   * Triggers the run button click when Enter is pressed.
   */
  public readonly handleCommandEnterKey = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      this.runButton.click(); 
    }
  };

  private syntaxHighlight(json: string): string {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  private isJson(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
}