import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlowUserinfoComponent } from './userinfoDialog/userinfo-dialog.component';
import { FlowService } from '../flow.service';
export class ApprovalStates {
  name: string;
  state: string;
}
export class FlowApprovalListMetadata {
  states: ApprovalStates[];
}

@Component({
  selector: 'approvalList-container',
  templateUrl: './approvalList.component.html',
  styleUrls: ['./approvalList.component.scss']
})
export class FlowApprovalListComponent implements OnInit {

  public diagram: string; // 流程图路径
  public procItems: any = []; //  处理后的元数据
  public selected = 0; //  tab选中index
  public _states: ApprovalStates[]; // 流程状态数组

  @Input() readonly scope: any; // 数据集

  protected _metadata: FlowApprovalListMetadata;
  private imgControlMap = [
    { name: '同意', url: 'assets/img/approval/agree.png' },
    { name: '拟同意', url: 'assets/img/approval/consent.png' },
    { name: '完成', url: 'assets/img/approval/complete.png' },
    { name: '驳回', url: 'assets/img/approval/overrule.png' },
    { name: '阅', url: 'assets/img/approval/read.png' }
  ];

  constructor(public dialog: MatDialog, public _fs: FlowService) {
  }
  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                 */
  /***********************************************************************************/
  @Input() public set states(states: ApprovalStates[]) {
    this._states = states && states instanceof Array ? states : [];
    this.listInit(this._states || [], [...this.scope['tasks'] || [], ...this.scope['candidacies'] || []]);
  }
  public get states() { return this._states; }
  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/
  timeIsStr(val) {
    return isNaN(val);
  }

  itemInit(item) {
    let title = '';
    item['starttime'] ? title += '开始　:　' + item['starttime'] : title += '';
    item['endtime'] ? title += '\n结束　:　' + item['endtime'] : title += '';
    item['duration'] ? title += '\n耗时　:　' + item['duration'] : title += '';
    return title;
  }

  listInit(states, data) {
    if (!states || data instanceof Array === false) {
      return;
    }
    let node_index = 0;
    const list = Object.assign([], states);
    list.forEach((state, index) => {
      state['items'] = [];
      data.forEach(item => {
        if ((item.state === state.state) && (item.operator || item.candidates)) {

          const _arr = data.filter(_data => _data.state === state.state);
          if (_arr.every(_obj => !_obj.candidates)) {
            node_index = index;
          }
          if (item.candidates) {
            state['candidatesNode'] = true;
          }

          if (state['items'][state['items'].length - 1] && state['items'][state['items'].length - 1]['unsubmit'] === true) {
            state['items'][state['items'].length - 1] = item;
          } else {
            state['items'].push(item);
          }
        }
      });
    });
    // console.log(list);
    this.procItems = list;
    const _id = this.scope['tid'] ? this.scope['tid'] : '';
    this.scope['opinions'] = this._fs.getOpinionData(list, this.scope.state, _id);
    if (this['_fs'] && this['_fs']['name']) {
      let node_name = '发起';
      if (this.scope && this.scope['state']) { // 待办，取 scope.state 对比 states 获取节点名称
        const node_arr = states.filter(state => state.state === this.scope['state']);
        if (node_arr.length === 1) { node_name = node_arr[0]['name'] || ''; }
      } else { // 已办或发起 取 states[node_index]
        node_name = states[node_index]['name'] || '';
      }
      let _title = document.title;
      if (_title && typeof (_title) === 'string') {
        _title = _title.split('-')[0];
        document.title = _title + '-' + this['_fs']['name'] + '-' + node_name;
      }
    }
  }

  // 展示用户详情弹窗
  showUser(_userid, e) {
    const X = e.clientX + 'px'; const winH = window.innerHeight;
    let Y = e.clientY + 'px';
    if (winH - e.clientY < 242) {
      Y = winH - 242 + 'px';
    }
    this.dialog.open(FlowUserinfoComponent, {
      width: '250px',
      height: '240px',
      position: { top: Y, left: X },
      data: {
        userid: _userid
      },
      disableClose: false,
      backdropClass: 'bg'
    });
  }

  // 切换tab页
  selectChange(e) {
    if (e || e === 0) {
      this.selected = e;
    }
  }

  showFont(name) {
    const url = this.imgControlMap.filter(item => item.name === name);
    if (url.length !== 0) {
      return url[0].url;
    } else {
      return false;
    }
  }

  setBgColor(item) {
    if (item.unsubmit) {
      return '#ffffa5';
    } else if (item.candidates) {
      return '#ededed';
    } else {
      return '#ffffff';
    }
  }

  candidateTitle(item, user) {
    let readerTxt = '';
    if (item['reader'] && item['reader']['userid'] === user['userid']) {
      // item.reader.name +
      readerTxt = '　于　' + item.readtime + '　首次阅读';
    }
    return readerTxt;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    // console.log(Object.assign({}, this.scope));
    if (this.scope['pid']) {
      this.diagram = window.location.origin + '/do/2201.71?pid=' + this.scope['pid'];
    } else if (this.scope['tid']) {
      this.diagram = window.location.origin + '/do/2201.71?tid=' + this.scope['tid'];
    } else if (this.scope['prockey']) {
      this.diagram = window.location.origin + '/do/2201.70?prockey=' + this.scope['prockey'];
    }
  }

}
