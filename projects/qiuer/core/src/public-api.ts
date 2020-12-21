/*
 * Public API Surface of core
 */

export * from './lib/container/container.module';
export * from './lib/container/container.component';
export * from './lib/container/container.service';
export * from './lib/container/container.event';



export * from './lib/custom/share/mat.share.module';
export * from './lib/custom/custom.module';
export * from './lib/custom/ngx-anchor/anchor.service';

export * from './lib/custom/ngx-anchor/anchor.module';
export * from './lib/custom/ngx-anchor/navigator/navigator.component';
export * from './lib/custom/ngx-anchor/anchor.directive';
export * from './lib/custom/ngx-anchor/with-anchor.directive';
export * from './lib/custom/directive/dialogMaxheight.directive';
export * from './lib/custom/directive/filter.pipe';
export * from './lib/custom/directive/maxHeight.directive';
export * from './lib/custom/directive/layout.directive';
export * from './lib/custom/directive/clazz.directive';
export * from './lib/custom/directive/safeHtml.pipe';




export * from './lib/dynamic/dynamic.module';
export * from './lib/dynamic/dynamic.component';



export * from './lib/main/main.component';
export * from './lib/main/dialog.component';
export * from './lib/main/bsDialog.component';



export * from './lib/root/root.container';
export * from './lib/root/content/content.component';
export * from './lib/root/dialog/dialog.component';
export * from './lib/root/dialog/commonDialog/commonDialog.component';
export * from './lib/root/dialog/bottomSheetDialog/bottomSheetDialog.component';

export * from './lib/root/notFound/notFound.component';

// tslint:disable-next-line:semicolon
export const CoreInfo: any = { name: 'core', version: '1.1.0-beta.17' }
