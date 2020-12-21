import { Type } from '@angular/core';

import { ContainerComponent } from './container.component';
import { NotFoundContainerComponent } from '../root/notFound/notFound.component';
// root

import { ContentRootComponent } from '../root/content/content.component';
import { CommonDialogComponent } from '../root/dialog/commonDialog/commonDialog.component';
import { BottomSheetDialogComponent } from '../root/dialog/bottomSheetDialog/bottomSheetDialog.component';

export const containerMapping: { [type: string]: Type<ContainerComponent> } = {
  // 特殊的
  notfound: NotFoundContainerComponent,
  // 根
  content: ContentRootComponent, // 标准内容 content
  'common-dialog': CommonDialogComponent, // 对话框
  'bottomSheet-dialog': BottomSheetDialogComponent, // 底部对话框
};

export class ContainerConfig {

  public static getContainerClass(type: string, mapping: any[]): Type<ContainerComponent> {
    const clz: Type<ContainerComponent> = containerMapping[type];
    if (clz) { return clz; }
    let dlz: Type<ContainerComponent>;
    mapping.forEach(map => {
      if (map['mapping'] && map['mapping'][type]) { dlz = map['mapping'][type]; }
    });
    if (dlz) { return dlz; }
    type = 'notfound';
    return containerMapping[type];
  }

}


export const containers: Type<ContainerComponent>[] = [
  NotFoundContainerComponent,
  // root
  ContentRootComponent,
  CommonDialogComponent,
  BottomSheetDialogComponent
];
