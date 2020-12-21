/**
 * type: def / align_left / align_right / posi_in_window / posi_in_father
 * width:height:left:right:top:bottom:百分比字符串或数字（'50%' / 200 / 'calc(100% - 20px)'）
 * child_align_direction: "子元素对齐方向 （vertical：纵对齐，上下排列，horizontal：横对齐，左右排列）",
 * child_spindle_align_type: "子元素主轴对齐方式 （center：主轴居中对齐，start：主轴起始位置对齐，end：主轴结束位置对齐，justified：主轴两端对齐，isometric：子元素间距一致）",
 * child_countershaft_align_type: "子元素副轴对齐方式 （center：副轴居中对齐，start：副轴起始位置对齐，end：副轴结束位置对齐）"
 * overflow_x:def/hidden/scroll
 * overflow_y:def/hidden/scrll
 * customize: 自定义样式{'background-color':'#fff','margin': '10px'}
 * media: 4个区间 sm xs md gt_md 可设置值为 0-100的字符串 以及 px 像素值;例：xs:'500px';当值为auto的时候 代表撑满剩余部分;
 * A撑满剩余部分 B定宽 ： A：layput:{media:{xs:'auto'}} B: layput:{media:{xs:'500px'}}
 */

import { Directive, ElementRef, OnDestroy, Input, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dynLayout]'
})

export class DynLayoutDirective implements OnChanges, OnDestroy {

  smMatcher: MediaQueryList;
  xsMatcher: MediaQueryList;
  mdMatcher: MediaQueryList;
  gt_mdMatcher: MediaQueryList;

  flexData = {
    sm: {},
    xs: {},
    md: {},
    gt_md: {}
  };
  ele: any;

  @Input() layout_data: any;
  dictionary = {
    flex: 'flex', margin: 'margin', marginleft: 'margin-left', marginright: 'margin-right', margintop: 'margin-top', marginbottom: 'margin-bottom',
    padding: 'padding', paddingleft: 'padding-left', paddingright: 'padding-right', paddingtop: 'padding-top', paddingbottom: 'padding-bottom',
    width: 'width', minWidth: 'min-width', height: 'height', minHeight: 'min-height'
  };


  public hasListener = false; // 是否有监听media

  constructor(private el: ElementRef, public renderer2: Renderer2, public mediaMatcher: MediaMatcher) {

  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/
  dataInit() {
    if (!this.layout_data) {
      return;
    }
    this.ele = this.el.nativeElement;
    // console.log('=====================', this.ele, Object.assign({}, this.layout_data));
    this.setEleStyle(this.layout_data, this.el.nativeElement);
  }

  setEleStyle(data, ele) {
    const element = ele;
    const attrList = ['sm', 'xs', 'md', 'gt_md'];

    // 判断是否需要监听
    attrList.forEach(item => {
      if (data[item] && data[item] instanceof Object && Object.keys(data[item]).length !== 0) {
        this.hasListener = true;
      }
    });
    // 设置默认data
    if (this.hasListener) {
      attrList.forEach(item => {
        for (const i of Object.keys(data)) {
          data[item] = data[item] || {};
          if (i !== 'xs' && i !== 'sm' && i !== 'md' && i !== 'gt_md' && i !== 'flex') {
            data[item][i] = data[i];
          }
        }
        data[item]['flex'] = data[item]['flex'] || data['flex'] || '100';
        this.flexData[item] = data[item];
      });
      this.renderer2.setStyle(element, 'box-sizing', 'border-box');
      this.addListener(element);
      this.setDefStyle(element);
    } else {
      this.setDictionaryStyle(data, element);
    }

  }

  setDictionaryStyle(data, ele) {
    const attrList = ['sm', 'xs', 'md', 'gt_md'];
    for (const i of Object.keys(this.dictionary)) {
      if (data[i] && attrList.indexOf(i) === -1) {
        if (i === 'flex') {
          this.renderer2.setStyle(ele, 'flex', '1 1 100%');
          if (data['direction'] && data['direction'] === 'column') {
            this.renderer2.setStyle(ele, 'max-height', data[i] + '%');
          } else {
            this.renderer2.setStyle(ele, 'max-width', data[i] + '%');
          }

          //  this.renderer2.setStyle(ele, 'flex', '1 1 ' + (data[i] + '%'));
          if (isNaN(data[i])) {
            //  this.renderer2.setStyle(ele, 'flex', '0 0 ' + data[i]);
          } else if (data[i] === 'auto') {
            //  this.renderer2.setStyle(ele, 'flex', '1');
          } else {
            // this.renderer2.setStyle(ele, 'flex', '1 1 ' + (data[i] + '%'));
            // this.renderer2.setStyle(ele, 'max-width', data[i] + '%');

          }
        } else if (data[i] instanceof Object) {
          for (const j of Object.keys(data[i])) {
            const styleKey = this.dictionary[i] + j;
            this.renderer2.setStyle(ele, this.dictionary[styleKey], data[i][j]);
          }
        } else {
          const addUnitList = ['width', 'minWidth', 'height', 'minHeight'];
          let transform = data[i];
          if (addUnitList.indexOf(i) !== -1) {
            isNaN(data[i]) ? transform = data[i] : transform = data[i] + '%';
          }
          this.renderer2.setStyle(ele, this.dictionary[i], transform);
        }
      }
    }
  }

  setDefStyle(_ele) {
    const winWidth = window.innerWidth;
    const fakeMatches = {
      matches: true,
      ele: _ele
    };
    if (winWidth < 600) {
      this.xsMediaListener(fakeMatches);
    } else if (winWidth >= 600 && winWidth < 960) {
      this.smMediaListener(fakeMatches);
    } else if (winWidth >= 960 && winWidth < 1280) {
      this.mdMediaListener(fakeMatches);
    } else {
      this.gt_mdMediaListener(fakeMatches);
    }
  }

  addListener(ele) {
    this.xsMatcher = this.mediaMatcher.matchMedia('(max-width: 599.99px)');
    this.xsMatcher.addListener(event => {
      event['ele'] = ele;
      this.xsMediaListener(event);
    });
    this.smMatcher = this.mediaMatcher.matchMedia('(min-width: 600px) and (max-width: 959.99px)');
    this.smMatcher.addListener(event => {
      event['ele'] = ele;
      this.smMediaListener(event);
    });
    this.mdMatcher = this.mediaMatcher.matchMedia('(min-width: 960px) and (max-width: 1279.99px)');
    this.mdMatcher.addListener(event => {
      event['ele'] = ele;
      this.mdMediaListener(event);
    });
    this.gt_mdMatcher = this.mediaMatcher.matchMedia('(min-width: 1280px)');
    this.gt_mdMatcher.addListener(event => {
      event['ele'] = ele;
      this.gt_mdMediaListener(event);
    });
  }

  xsMediaListener(event) {
    this.setStyle(event, 'xs');
  }

  smMediaListener(event) {
    this.setStyle(event, 'sm');
  }

  mdMediaListener(event) {
    // console.log(event);
    this.setStyle(event, 'md');
  }

  gt_mdMediaListener(event) {
    this.setStyle(event, 'gt_md');
  }

  setStyle(event, media: string) {
    if (event.matches) {
      this.setDictionaryStyle(this.flexData[media], event.ele);
    }
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.dataInit();
    }
  }

  ngOnDestroy() {
    if (this.hasListener) {
      this.xsMatcher.removeListener(this.xsMediaListener);
      this.smMatcher.removeListener(this.smMediaListener);
      this.mdMatcher.removeListener(this.mdMediaListener);
      this.gt_mdMatcher.removeListener(this.gt_mdMediaListener);
    }
  }

}
