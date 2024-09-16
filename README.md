# Tevm Cast Clone

- [Tevm cast website](https://tevm-cast.vercel.app)

Tevm Cast Clone is a web-based Ethereum command-line interface (CLI) emulator similar to [foundry cast](https://book.getfoundry.sh/cast/).

It's goal is:

1. To provide a convenient lightweight peformant interface to do simple ethereum queries in a mobile browser
2. Show off Tevm features such as network forking and in-browser EVM

![image](https://github.com/user-attachments/assets/652e7c98-1e3f-4672-b8d6-34577f632ef6)

## Features

- Support for multiple Ethereum networks (Mainnet, Optimism, Base). Feel free to add new networks
- Real-time network information display (Chain ID, Base Fee, Gas Limit, Fork Block)
- Command history functionality
- Execution of various Ethereum commands, including:
  - `cast block`
  - `cast tx`
  - `cast call`
  - `cast send`
  - `cast chain-id`
  - `cast code`
  - `cast keccak`
  - And more...
- Command history and rpc urls saved in local storage

## How to Use

1. Select a network from the dropdown menu or enter a custom RPC URL.
2. Enter a command in the input area (e.g., `cast bn` for block number).
3. Click the "Run" button or press Enter to execute the command.
4. View the output in the result area below.

## Technical Stack

This website is built using just good old fashioned html and vanilla js

- Frontend: HTML, CSS, TypeScript
- Ethereum Interaction: Tevm library
- Build Tool: Vite

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open the provided localhost URL in your browser

## Files

- `index.html`: The main HTML file that structures the web application's layout and includes necessary scripts and styles.
- `main.css`: The stylesheet that defines the application's appearance, including responsive design and animations.
- `src/main.ts`: The primary TypeScript file that initializes the application, setting up storage, nodes, HTML rendering, command runner, and event listeners.
- `src/Nodes.ts`: Manages the creation and handling of Tevm nodes for different networks.
- `src/Storage.ts`: Handles local storage operations, including Fork URL management and command history.
- `src/Html.ts`: Responsible for rendering and updating HTML elements in the UI.
- `src/EventListeners.ts`: Sets up and manages all event listeners for user interactions.
- `src/CommandRunner.ts`: Contains the logic for executing various Ethereum commands using the Tevm Node library.


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Especially looking for contributions to add more cast commands.

## License

This project is open source and available under the [MIT License](LICENSE).
