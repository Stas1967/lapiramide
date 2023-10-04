import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { enableIndexedDbPersistence } from 'firebase/firestore';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

