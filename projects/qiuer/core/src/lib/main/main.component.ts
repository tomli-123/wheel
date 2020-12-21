import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ContainerService } from '../container/container.service';
import { DynamicContainerComponent } from '../dynamic/dynamic.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'main',
  templateUrl: './main.component.html',
  animations: [
    trigger('fadeout', [
      state('show', style({ opacity: 1, 'z-index': 999, display: 'block' })),
      state('hidden', style({ opacity: 0, 'z-index': 0, display: 'none' })),
      transition('show => hidden', [animate('.2s')]),
    ])
  ],
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.main-host]': 'true'
  }
})

export class MainContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DynamicContainerComponent, { static: true }) public container: DynamicContainerComponent;

  xiex = 'god';

  public urlId = ''; // 从url上获取的id
  public notFound = false;
  public repaint = true;

  public _type = 'report'; // 容器的默认类型,给不同容器进行功能和样式调整
  public _metadata: any = null;
  public _data: any = null;
  public routerEventChange: any;

  public _showMaskImg = true;
  private _hiddenMaskScribe: any;


  constructor(public _service: ContainerService, public route: ActivatedRoute, public router: Router) {
    this._hiddenMaskScribe = this._service.eventChange.subscribe((maskState: any) => {
      if (maskState.type === 'mask') {
        setTimeout(() => { this._showMaskImg = maskState.data; }, null);
      }
    });
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/

  public get metadata() {
    return this._metadata;
  }

  @Input() public set metadata(metadata) {
    this.hideLoading();
    if (this._service.registerContainers(metadata)) {
      this._metadata = this._service.getBootstrapContainer();
    } else {
      this.showNotFound();
    }
  }

  public get data() {
    return this._data;
  }

  @Input() public set data(data) {
    this._data = data;
  }

  public get type() {
    return this._type;
  }

  @Input() public set type(type: string) {
    this._type = type;
  }

  getBootstrap() {
    return this.container.getContainer();
  }

  getContainer() {
    const id = this.route.snapshot.paramMap.get('id');
    const param = this.route.snapshot.paramMap.get('param');
    const urlParam = this.getCustParam(param);
    if (id && this.urlId !== id) {
      this.urlId = id;
      this.showLoading();
      this._service.postData('/do/' + this.urlId, urlParam).then(res => {
        if (res['code'] && res['code'] === -1) {
          this._service.goToLogin();
        }
        if (res['code'] && res['code'] !== 0) {
          this.showNotFound();
          this._service.tipDialog(res['msg']);
        }
        if (res['metadata']) {
          this.metadata = res['metadata'];
          this.data = res['data'];
        }
        if (res['type']) {
          this.type = res['type'];
        }
      }).catch(
        result => {
          this.showNotFound();
        }
      );
    }
  }

  hideLoading() {
    setTimeout(() => {
      this._service.hideMask();
      this.notFound = false;
    }, 200);
  }

  showLoading() {
    this._service.showMask();
    this.notFound = false;
  }

  showNotFound() {
    setTimeout(() => {
      this._service.hideMask();
      this.notFound = true;
    }, 100);
  }


  ngOnInit() {
    this.routerEventChange = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getContainer();
      }
    });
    this.getContainer();
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this._hiddenMaskScribe.unsubscribe();
  }



  // tslint:disable-next-line:member-ordering
  regu = /^\s*function.*}$/;
  // tslint:disable-next-line:member-ordering
  re = new RegExp(this.regu);

  // tslint:disable-next-line:member-ordering
  reguForEs6 = /=>\s*.*}$/;
  // tslint:disable-next-line:member-ordering
  reForEs6 = new RegExp(this.reguForEs6);

  evalObj(obj) {
    if (!obj || obj instanceof Object !== true) {
      // console.log('return');
      return null;
    }
    for (const i of Object.keys(obj)) {
      if (typeof obj[i] === 'string' && (this.re.test(obj[i]) || this.reForEs6.test(obj[i]))) {
        // tslint:disable-next-line:no-eval
        obj[i] = eval('(' + obj[i] + ')');
      }
      if (obj[i] instanceof Object === true) {
        this.evalObj(obj[i]);
      }
      if (obj[i] instanceof Array === true) {
        for (const j of obj[i]) {
          this.evalObj(j);
        }
      }
    }
  }

  // 获取自定义参数
  getCustParam(param: string) {
    const params = new Object();
    if (param === null) { return {}; }
    const paramArray = param.split('$');
    for (const item of paramArray) {
      params[item.split('@')[0]] = decodeURI(item.split('@')[1]);
    }
    // for (let i = 0; i < paramArray.length; i++) {
    //   params[paramArray[i].split('@')[0]] = decodeURI(paramArray[i].split('@')[1]);
    // }
    return params;
  }


}
