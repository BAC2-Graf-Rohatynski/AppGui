import { OverlayRef } from '@angular/cdk/overlay';
0
export class ModelOverlayRef {

  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.overlayRef.dispose();
  }
}

