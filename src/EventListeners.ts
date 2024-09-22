import type { Nodes, SupportedNetwork } from "./Nodes";
import type { Html } from "./Html";
import type { CommandRunner } from "./CommandRunner";
import type { Storage } from "./Storage";

/**
 * Manages event listeners for the application.
 * This class sets up and handles various user interactions and UI updates.
 */
export class EventListeners {
    /**
     * Creates an instance of EventListeners.
     * @param {Nodes} nodes - The Nodes instance for managing network nodes.
     * @param {Storage} storage - The Storage instance for managing local storage.
     * @param {Html} html - The Html instance for managing UI elements.
     * @param {CommandRunner} runner - The CommandRunner instance for executing commands.
     */
    constructor(
        private readonly getTevmNodes: () => Promise<Nodes>,
        private readonly storage: Storage,
        private readonly html: Html,
        private readonly runner: CommandRunner,
    ) { }

    /**
     * Adds all event listeners to the application.
     * This method sets up listeners for network selection, RPC URL changes,
     * help icon clicks, command execution, history selection, and output copying.
     */
    public readonly addEventListeners = () => {
        const { getTevmNodes, storage, html, runner } = this

        /**
         * Event listener for network selection.
         * Creates a new tevm node and updates the UI when a network is selected.
         */
        html.networkSelect.addEventListener('change', async function onNetworkSelect() {
            const nodes = await getTevmNodes()
            const newNetwork = html.networkSelect.value as SupportedNetwork;
            nodes.network = newNetwork as SupportedNetwork;
            const url = storage.getStoredUrl(newNetwork);
            html.rpcUrlDiv.value = url;
            const node = await nodes[newNetwork].node;

            if (html.networkSelect.value) {
                html.networkInfo.style.display = 'table';
                html.rpcUrlDiv.style.display = 'block';
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

        /**
         * Event listener for RPC URL changes.
         * Creates a new tevm node when the RPC URL is changed.
         */
        html.rpcUrlDiv.addEventListener('blur', async function onRpcUrlChange() {
            const nodes = await getTevmNodes()
            const { Nodes } = await import('./Nodes.js')
            const newUrl = html.rpcUrlDiv.value;
            const currentNetwork = nodes.network;
            try {
                const node = await Nodes.createTevmNode(newUrl, nodes[currentNetwork].common);
                // If tevm node creation is successful, update the stored URL and reinitialize the tevm node
                storage.setStoredUrl(currentNetwork, newUrl);
                nodes[currentNetwork].node = node;
                const [chainId, block] = await Promise.all([node.getVm().then(vm => vm.common.id), node.getVm().then(vm => vm.blockchain.getCanonicalHeadBlock())])
                html.chainIdCell.textContent = chainId.toLocaleString();
                html.baseFeeCell.textContent = block.header.baseFeePerGas?.toLocaleString() ?? '';
                html.gasLimitCell.textContent = block.header.gasLimit.toLocaleString();
                html.forkBlockCell.textContent = block.header.number.toLocaleString();
            } catch (error) {
                // Revert to the previously stored URL
                html.rpcUrlDiv.value = storage.getStoredUrl(currentNetwork);
            }
        });

        /**
         * Event listener for help icon clicks.
         * Runs the 'cast --help' command when the help icon is clicked.
         */
        html.helpIcon.addEventListener('click', async function onHelpIconClick() {
            const nodes = await getTevmNodes()
            const currentNetwork = nodes.network;
            const node = nodes[currentNetwork].node;
            runner.runCommand(node, 'cast --help');
        });

        /**
         * Event listener for run button clicks.
         * Executes the entered command and updates command history.
         */
        html.runButton.addEventListener('click', async function onRunButtonClick() {
            const nodes = await getTevmNodes()
            let command = html.commandInput.value.trim()
            if (command.startsWith('Cast')) {
                command = command.replace('Cast', 'cast')
            }
            if (!command.startsWith('cast')) {
                command = `cast ${command}`
            }
            const currentNetwork = nodes.network;
            const node = await nodes[currentNetwork].node;

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

        /**
         * Event listener for history dropdown changes.
         * Sets the command input value when a history item is selected.
         */
        html.historyDropdown.addEventListener('change', function() {
            html.commandInput.value = html.historyDropdown.value;
            html.historyDropdown.selectedIndex = 0;
        });

        /**
         * Event listener for output clicks.
         * Copies the output to clipboard when clicked and shows a confirmation message.
         */
        html.output.addEventListener('click', function copyOutputToClipboard() {
            const text = html.output.textContent || '';
            navigator.clipboard.writeText(text).then(() => {
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
                const originalBackground = html.output.style.backgroundColor;
                html.output.style.backgroundColor = '#004400';

                // Fade out the message and reset background after a delay
                setTimeout(() => {
                    html.output.style.backgroundColor = originalBackground;
                }, 200);
                setTimeout(() => {
                    copiedMessage.style.opacity = '0';
                    copiedMessage.addEventListener('transitionend', function() {
                        document.body.removeChild(copiedMessage);
                    }, { once: true });
                }, 1500);
            })
        });

        /**
         * Event listener for input focus.
         * Adds the Enter key listener when the input is focused.
         */
        html.commandInput.addEventListener('focus', function onInputFocus() {
            html.addEnterKeyListener();
        });

        /**
         * Event listener for the example button.
         * Sets the network to mainnet, fills the command input with an example command,
         * and triggers the run button click.
         */
        html.exampleButton.addEventListener('click', function onExampleButtonClick() {
            html.networkSelect.value = 'mainnet';
            html.networkSelect.dispatchEvent(new Event('change'));
            html.commandInput.value = 'cast call 0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb "balanceOf(address)" 0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb --trace --access-list';
            html.runButton.click();
        });
    }
}
