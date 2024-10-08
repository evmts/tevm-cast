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
  public readonly output = document.getElementById('output')! as HTMLPreElement;
  public readonly traceOutput = document.getElementById('traceOutput')! as HTMLDivElement;
  public readonly skeletonLoader = document.getElementById('skeletonLoader')! as HTMLDivElement;
  public readonly helpIcon = document.getElementById('helpIcon')! as HTMLDivElement;
  public readonly runButton = document.getElementById('runButton')! as HTMLButtonElement;
  public readonly historyDropdown = document.getElementById('historyDropdown')! as HTMLSelectElement;
  public readonly exampleButton = document.getElementById('exampleButton')! as HTMLButtonElement;
  private traceJsonView: string = '';
  private traceFormattedView: HTMLElement | null = null;
  private traceTextView: string = '';
  private currentView: 'json' | 'formatted' | 'text' = 'formatted';

  public readonly renderCommandLoading = () => {
    this.output.style.display = 'none';
    this.traceOutput.style.display = 'none';
    this.skeletonLoader.style.display = 'block';
  };

  public readonly renderCommandResult = (content: string, trace?: any) => {
    this.skeletonLoader.style.display = 'none';
    this.output.style.display = 'block';
    
    // Clear previous content
    this.output.innerHTML = '';
    this.traceOutput.innerHTML = '';

    // Render the main output
    if (this.isJson(content)) {
      const highlightedJson = this.syntaxHighlight(content);
      this.output.innerHTML = highlightedJson;
    } else {
      this.output.textContent = content;
    }

    // Render the trace if available
    if (trace) {
      this.renderTrace(trace);
      this.traceOutput.style.display = 'block';
    } else {
      this.traceOutput.style.display = 'none';
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

  public readonly renderTrace = (trace: any) => {
    this.traceOutput.innerHTML = '';
    
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle View (Formatted/JSON/Text)';
    toggleButton.className = 'toggle-trace-view';
    toggleButton.addEventListener('click', this.toggleTraceView);
    
    this.traceOutput.appendChild(toggleButton);

    const traceContainer = document.createElement('div');
    traceContainer.className = 'trace-container';
    
    this.traceJsonView = JSON.stringify(trace, null, 2);
    this.traceFormattedView = this.createTraceTreeView(trace.structLogs);
    this.traceTextView = this.createTraceTextView(trace.structLogs);

    traceContainer.appendChild(this.traceFormattedView);
    this.traceOutput.appendChild(traceContainer);
  };

  private toggleTraceView = () => {
    const traceContainer = this.traceOutput.querySelector('.trace-container');
    if (!traceContainer) return;

    traceContainer.innerHTML = '';

    switch (this.currentView) {
      case 'formatted':
        const pre = document.createElement('pre');
        pre.textContent = this.traceJsonView;
        traceContainer.appendChild(pre);
        this.currentView = 'json';
        break;
      case 'json':
        const textView = document.createElement('pre');
        textView.innerHTML = this.traceTextView;
        traceContainer.appendChild(textView);
        this.currentView = 'text';
        break;
      case 'text':
        traceContainer.appendChild(this.traceFormattedView!);
        this.currentView = 'formatted';
        break;
    }
  };

  private createTraceTreeView(structLogs: any[]): HTMLElement {
    const table = document.createElement('table');
    table.className = 'trace-table';

    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    ['PC', 'Gas', 'Op', 'Stack', 'Memory', 'Storage'].forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });

    const tbody = table.createTBody();
    structLogs.forEach((log, index) => {
      const row = tbody.insertRow();
      row.className = `depth-${log.depth} op-${log.op.toLowerCase()}`;

      const gasUsed = index > 0 ? structLogs[index - 1].gas - log.gas : 0;

      row.innerHTML = `
        <td>${log.pc}</td>
        <td>${gasUsed}/${log.gas}</td>
        <td>${log.op}</td>
        <td>${log.stack ? log.stack.join(', ') : ''}</td>
        <td>${log.memory ? this.formatMemory(log.memory) : ''}</td>
        <td>${log.storage ? JSON.stringify(log.storage) : ''}</td>
      `;
    });

    return table;
  }

  private createTraceTextView(structLogs: any[]): string {
    let output = 'Traces:\n';
    let depth = 0;
    let gasUsed = 0;

    structLogs.forEach((log, index) => {
      if (log.op === 'CALL' || log.op === 'STATICCALL' || log.op === 'DELEGATECALL') {
        const indent = '  '.repeat(depth);
        const prefix = depth > 0 ? (index === structLogs.length - 1 ? '└─ ' : '├─ ') : '';
        output += `${indent}${prefix}[${gasUsed}] ${log.op} ${log.stack[log.stack.length - 2]}\n`;
        depth++;
      } else if (log.op === 'RETURN' || log.op === 'REVERT') {
        depth = Math.max(0, depth - 1);
        const indent = '  '.repeat(depth);
        const returnValue = log.stack[log.stack.length - 1];
        output += `${indent}  └─ ← ${log.op === 'REVERT' ? '[Reverted]' : '[Return]'} ${returnValue}\n`;
      }

      gasUsed += index > 0 ? structLogs[index - 1].gas - log.gas : 0;
    });

    output += `\nTransaction successfully executed.\nGas used: ${gasUsed}`;
    return this.colorizeTraceText(output);
  }

  private colorizeTraceText(text: string): string {
    return text.replace(/(\[.*?\])/g, '<span style="color: #00FFFF;">$1</span>')
               .replace(/(CALL|STATICCALL|DELEGATECALL)/g, '<span style="color: #00FF00;">$1</span>')
               .replace(/(\[Return\]|\[Reverted\])/g, '<span style="color: #FF00FF;">$1</span>')
               .replace(/(Gas used:.*)/g, '<span style="color: #FFFF00;">$1</span>');
  }

  private formatMemory(memory: string): string {
    // This is a simple formatting, you might want to improve it
    return memory.substring(0, 20) + (memory.length > 20 ? '...' : '');
  }
}