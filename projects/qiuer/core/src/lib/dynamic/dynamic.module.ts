import { NgModule, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { DynamicContainerComponent } from './dynamic.component';

@NgModule({
  declarations: [DynamicContainerComponent],
  exports: [DynamicContainerComponent]
})
export class DynamicComponentModule {
  static withComponents(components: any) {
    return {
      ngModule: DynamicComponentModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: components, multi: true }
      ]
    };
  }
}
