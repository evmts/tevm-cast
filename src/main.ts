import { Storage } from './Storage';
import { Html } from './Html';

import { CommandRunner } from './CommandRunner';
import { EventListeners } from './EventListeners';
import { Nodes } from './Nodes';
import { LazyTevm } from './LazyTevm';

const html = new Html()

html.focusOnCommandInput()

const storage = new Storage()
storage.migrateLocalStorage()

html.renderHistoryDropdown(storage.getStoredHistory());

const tevmNodes = new Nodes(storage)

const runner = new CommandRunner(html)
const listeners = new EventListeners(tevmNodes, storage, html, runner)
listeners.addEventListeners()

LazyTevm.eagerlyLoad()
