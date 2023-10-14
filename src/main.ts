import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// Este código es propiedad de Tomasz Wroblewski y está protegido por las leyes de derechos de autor.
// Se prohíbe su copia, modificación, distribución o uso comercial sin el consentimiento expreso del autor.
//   Contacto: vizaint @gmail.com
console.info("%cEste código es propiedad de Diservitec y está protegido por las leyes de derechos de autor. " +
  "Se prohíbe su copia, modificación, distribución o uso comercial sin el consentimiento expreso del autor. " +
  "Contacto: vizaint@gmail.com", "color:#000; font-size: 20px; background: #ff0")

