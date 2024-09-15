import { Storage } from './Storage';
import { Html } from './Html';

import { CommandRunner } from './CommandRunner';
import { EventListeners } from './EventListeners';
import type { Nodes as NodesInstanceType } from './Nodes.js';


const storage = new Storage()
storage.migrateLocalStorage()


const html = new Html()
html.renderHistoryDropdown(storage.getStoredHistory());

let nodes: NodesInstanceType | undefined  = undefined
const getTevmNode = async () => {
  // lazy load Nodes because it depends on tevm
  // tevm adds about 300kb as of September 15th
  const {Nodes} = await import('./Nodes.js');
  const out = nodes ?? new Nodes(storage)
  nodes = out
  return out
}

const runner = new CommandRunner(html)
const listeners = new EventListeners(getTevmNode, storage, html, runner)
listeners.addEventListeners()
