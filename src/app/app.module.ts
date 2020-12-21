import { BrowserModule } from '@angular/platform-browser';

import { COMPILER_OPTIONS, CompilerFactory } from '@angular/core';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';

import { NgModule, Compiler } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MainContainerComponent } from '../../dist/qiuer/core';
// import { ContainerModule } from '../../dist/qiuer/core';
// import { MatSharedModule } from '../../projects/qiuer/core/src/lib/custom/share/mat.share.module';
import { MainContainerComponent, ContainerModule, MatSharedModule } from '@qiuer/core';
import { ComponentModule, ComponentInfo } from '../../projects/qiuer/component/src/lib/component.module';
// import { ComponentModule, ComponentInfo } from '@qiuer/component';
import { FlowModule, FlowInfo } from '../../projects/qiuer/flow/src/lib/flow.module';
import { ChartModule, ChartInfo } from '../../projects/qiuer/chart/src/lib/chart.module';
import { MarkDownModule, MarkdownInfo } from '@qiuer/markdown';
// import { AggridInfo, AggridModule } from '../../projects/qiuer/aggrid/src/lib/aggrid.module';
import { DateAdapter } from '@angular/material/core';
import { MyDateAdapter } from './service/dateAdapter.service';
import {
  FrameModule, NotFoundComponent,
  AuthGuard, CommonComponent, FlowComponent,
} from '@qiuer/frame';

const PlugModule = [ComponentModule, FlowModule, MarkDownModule, ChartModule];
const PlugInfo = [ComponentInfo, FlowInfo, MarkdownInfo, ChartInfo];

const ToolBtns = [];

// const ApiUrl = '/module.get.do?subappid=frm';
const ApiUrl = '/module.get.do';

const routes: Routes = [
  {
    path: 'gridlist', loadChildren: () => import('./gridlist/gridlist.module').then(mod => mod.GridlistTestModule)
  },
  {
    path: 'aggrid', loadChildren: () => import('./aggridTest/agGrid.module').then(mod => mod.AgGridTestModule)
  },
  {
    path: 'tree', loadChildren: () => import('./tree/tree.module').then(mod => mod.TreeTestModule)
  },

  {
    path: 'loopTabs', loadChildren: () => import('./loopTabs/loopTabs.module').then(mod => mod.LoopTabsTestModule)
  },
  {
    path: 'report', loadChildren: () => import('./report/report.module').then(mod => mod.ReportTestModule)
  },
  {
    path: 'ganttTest',
    loadChildren: () => import('./gantt/gantt.module').then(mod => mod.GanttTestModule)
  },
  {
    path: 'flow', children: [
      {
        path: 'desk/:id',
        loadChildren: () => import('./flowTest/flowTest.module').then(mod => mod.FlowTestModule)
      },
      {
        path: 'desk/:id/:param',
        loadChildren: () => import('./flowTest/flowTest.module').then(mod => mod.FlowTestModule)
      }
    ]
  },
  { path: 'frame', loadChildren: () => import('./controllerTest/controllerTest.module').then(mod => mod.ControllerTestModule) },
  { path: 'login', component: LoginComponent },
  { path: 'desk/:id', component: MainContainerComponent },

  { path: '', component: CommonComponent, canActivate: [AuthGuard], children: [] }, // 配置化模块的通用路由

];

// export function createJitCompiler() {
//   return new JitCompilerFactory([{
//     useJit: true
//   }]).createCompiler([{
//     useJit: true
//   }]);
// }

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FrameModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ContainerModule,
    RouterModule.forRoot(routes, { useHash: true }),
    MatSnackBarModule,
    MatSharedModule,
    ...PlugModule
  ],
  exports: [
    ContainerModule
  ],
  providers: [
    // { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    // { provide: CompilerFactory, useClass: JitCompilerFactory, deps: [COMPILER_OPTIONS] },
    // { provide: Compiler, useFactory: createJitCompiler, deps: [CompilerFactory] },
    // { provide: Compiler, useFactory: createJitCompiler },

    {
      provide: 'appConfig',
      useValue: {
        isSso: false,
        apiUrl: ApiUrl,
        toolBtns: ToolBtns,
        plugInfo: PlugInfo
      }
    }, DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
