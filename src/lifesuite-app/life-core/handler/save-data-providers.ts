import { Provider } from '@angular/core';

import { SaveDataDelegate } from './save-data.delegate';
import { SaveAndCloseDataDelegate } from './save-and-close-data.delegate';
import { SaveTabHandler } from './save-tab.handler';

export const SAVE_DATA_PROVIDERS: Provider[] = [SaveDataDelegate, SaveAndCloseDataDelegate, SaveTabHandler];
