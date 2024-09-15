import { Storage } from './Storage';
import { Html } from './Html';

// lazy load anything that depends on tevm because
// tevm adds about 300kb as of September 15th
const lazyCommandRunner = import('./CommandRunner');
const lazyNodes = import('./Nodes.js');
const lazyEventListeners = import('./EventListeners');

const storage = new Storage()
storage.migrateLocalStorage()


const html = new Html()
html.renderHistoryDropdown(storage.getStoredHistory());

Promise.all([lazyCommandRunner, lazyEventListeners, lazyNodes]).then(([{CommandRunner},{EventListeners},{ Nodes }]) => {
  const tevmNodes = new Nodes(storage)
  const runner = new CommandRunner(html)
  const listeners = new EventListeners(tevmNodes, storage, html, runner)
  listeners.addEventListeners()
})
