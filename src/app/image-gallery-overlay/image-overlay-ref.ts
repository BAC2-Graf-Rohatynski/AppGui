import {OverlayRef} from "@angular/cdk/overlay";

export class ImageOverlayRef {

  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.overlayRef.dispose();
  }

}
