import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

@Component({
  template: `123123123ControllerTestComponent<router-outlet> </router-outlet>`
})
export class ControllerTestComponent {
  constructor() {
    console.log('test===========', () => import('./chips/chips.module').then(mod => mod.ChipsTestModule));
  }
}

const reportRoutes: Routes = [
  { path: '', component: ControllerTestComponent },
  { path: 'chips', loadChildren: () => import('./chips/chips.module').then(mod => mod.ChipsTestModule) },
  { path: 'htmldataset', loadChildren: './htmldataset/htmldataset.module#HtmlDatasetTestModule' },
  { path: 'dropTable', loadChildren: './dropTable/dropTable.module#DropTableTestModule' },
  { path: 'ueditor', loadChildren: './ueditor/ueditor.module#UEditorTestModule' },
  { path: 'treedataset', loadChildren: () => import('./treedataset/treedataset.module').then(mod => mod.TreeDatasetTestModule) },
  { path: 'monaco', loadChildren: () => import('./monaco/monaco.module').then(mod => mod.MonacoTestModule) },
  { path: 'preview', loadChildren: () => import('./preview/preview.module').then(mod => mod.PreviewTestModule) },
  { path: 'table', loadChildren: () => import('./table/table.module').then(mod => mod.TableTestModule) },
  { path: 'template', loadChildren: () => import('./template/template.module').then(mod => mod.TemplateTestModule) },
  { path: 'menu', loadChildren: () => import('./menu/menu.module').then(mod => mod.MenuTestModule) },
  { path: 'tabs', loadChildren: () => import('./tabs/tabs.module').then(mod => mod.TabsTestModule) },
  { path: 'datepicker', loadChildren: () => import('./datepicker/datepicker.module').then(mod => mod.DatepickerTestModule) }
];

@NgModule({
  imports: [
    RouterModule.forChild(reportRoutes)
  ],
  declarations: [
    ControllerTestComponent
  ],
  entryComponents: []
})
export class ControllerTestModule {
}
