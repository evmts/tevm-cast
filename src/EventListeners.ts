import { Nodes, SupportedNetwork } from "./Nodes";
import { Html } from "./Html";
import { CommandRunner } from "./CommandRunner";
import { Storage } from "./Storage";

export class EventListeners {
    constructor(
        private readonly nodes: Nodes,
        private readonly  storage: Storage,
        private readonly html: Html,
        private readonly runner: CommandRunner,
    ){}

  public readonly addEventListeners = () => {
    const { nodes, storage, html, runner } = this
    // when network is selected create a new tevm node and update the ui
    html.networkSelect.addEventListener('change', async function onNetworkSelect() {
        const newNetwork = this.value as SupportedNetwork;
        nodes.network = newNetwork as SupportedNetwork;
        const url = storage.getStoredUrl(newNetwork);
        html.rpcUrlDiv.value = url;
        const node = await nodes[newNetwork].lazyLoadedNode;

        if (this.value) {
        html.networkInfo.style.display = 'table';
        html.rpcUrlDiv.style.display = 'block';
        // Simulating network info
        const [chainId, block] = await Promise.all([node.getVm().then(vm => vm.common.id), node.getVm().then(vm => vm.blockchain.getCanonicalHeadBlock())])
        html.chainIdCell.textContent = chainId.toLocaleString();
        html.baseFeeCell.textContent = block.header.baseFeePerGas?.toLocaleString() ?? '';
        html.gasLimitCell.textContent = block.header.gasLimit.toLocaleString();
        html.forkBlockCell.textContent = block.header.number.toLocaleString();
        } else {
        html.networkInfo.style.display = 'none';
        html.rpcUrlDiv.style.display = 'none';
        }
    });

    // when rpc url changes make a new tevm node
    html.rpcUrlDiv.addEventListener('blur', async function onRpcUrlChange() {
        const newUrl = this.value;
        const currentNetwork = nodes.network;
        try {
        const node = await Nodes.lazyLoadedTevmNode(newUrl, nodes[currentNetwork].common);
        // If tevm node creation is successful, update the stored URL and reinitialize the tevm node
        storage.setStoredUrl(currentNetwork, newUrl);
        nodes[currentNetwork].lazyLoadedNode = Promise.resolve(node);
        } catch (error) {
        console.error('Failed to create tevm node with new URL:', error);
        // Revert to the previously stored URL
        this.value = storage.getStoredUrl(currentNetwork);
        }
    });

    html.helpIcon.addEventListener('click', async function onHelpIconClick() {
        const currentNetwork = nodes.network;
        const node = await nodes[currentNetwork].lazyLoadedNode;
        runner.runCommand(node, 'cast --help');
    });

    html.runButton.addEventListener('click', async function onRunButtonClick() {
        const command = html.commandInput.value.trim();
        const currentNetwork = nodes.network;
        const node = await nodes[currentNetwork].lazyLoadedNode;

        let history = storage.getStoredHistory();
        const existingIndex = history.indexOf(command);

        if (existingIndex !== -1) {
        history.splice(existingIndex, 1);
        }

        history.unshift(command);

        history = history.slice(0, 10);

        storage.setStoredHistory(history);

        html.renderHistoryDropdown(storage.getStoredHistory());

        runner.runCommand(node, command);
    });

    // Set command input from history
    html.historyDropdown.addEventListener('change', function() {
        html.commandInput.value = this.value;
        this.selectedIndex = 0;
    });

    // Copy output to clipboard when clicked
    html.output.addEventListener('click', function copyOutputToClipboard() {
        const text = this.textContent || '';
        navigator.clipboard.writeText(text).then(() => {
        console.log('Output copied to clipboard');
        // Create and show a temporary "Copied!" message
        const copiedMessage = document.createElement('div');
        copiedMessage.textContent = 'Copied to clipboard!';
        copiedMessage.style.position = 'fixed';
        copiedMessage.style.top = '20px';
        copiedMessage.style.left = '50%';
        copiedMessage.style.transform = 'translateX(-50%)';
        copiedMessage.style.backgroundColor = '#004400';
        copiedMessage.style.color = '#00FF00';
        copiedMessage.style.padding = '10px';
        copiedMessage.style.borderRadius = '5px';
        copiedMessage.style.zIndex = '1000';
        copiedMessage.style.opacity = '0';
        copiedMessage.style.transition = 'opacity 0.2s ease-in-out';
        document.body.appendChild(copiedMessage);

        // Trigger reflow to ensure the transition applies
        copiedMessage.offsetHeight;

        // Fade in the message
        copiedMessage.style.opacity = '1';

        // Provide visual feedback
        const originalBackground = this.style.backgroundColor;
        this.style.backgroundColor = '#004400';

        // Fade out the message and reset background after a delay
        setTimeout(() => {
            this.style.backgroundColor = originalBackground;
        }, 200);
        setTimeout(() => {
            copiedMessage.style.opacity = '0';
            copiedMessage.addEventListener('transitionend', function() {
            document.body.removeChild(copiedMessage);
            }, { once: true });
        }, 1500);
        }).catch(err => {
        console.error('Failed to copy text: ', err);
        });
    });
    }
}