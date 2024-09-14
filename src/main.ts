import { Nodes } from './Nodes';
import { Storage } from './Storage';
import { Html } from './Html';
import { EventListeners } from './EventListeners';
import { CommandRunner } from './CommandRunner';

const storage = new Storage()
storage.migrateLocalStorage()

const tevmNodes = new Nodes(storage)

const html = new Html()
html.renderHistoryDropdown(storage.getStoredHistory());

const runner = new CommandRunner(html)

const listeners = new EventListeners(tevmNodes, storage, html, runner)

listeners.addEventListeners()
