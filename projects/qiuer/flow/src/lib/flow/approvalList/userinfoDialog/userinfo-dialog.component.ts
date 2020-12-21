import { OnInit, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
// import { MatDialog } from '@angular/material';
import { ContainerService } from '@qiuer/core';

export class UserInfo {
  avatar: string;
  name: string;
  department: string;
  post: string;
  cellphone: string;
  telephone: string;
  fax: string;
  email: string;
}

@Component({
  selector: 'userinfo-dialog',
  templateUrl: './userinfo-dialog.component.html',
  styleUrls: ['./userinfo-dialog.component.scss']
})
export class FlowUserinfoComponent implements OnInit {

  public userInfo = {
    avatar: 'assets/img/profile/avatar/null.png',
    name: '空',
    deptname: '空',
    post: '空',
    cellphone: '空',
    telephone: '空',
    fax: '空',
    email: '空'
  };
  showCode = false;
  codeUrl: string;

  constructor(public dialogRef: MatDialogRef<FlowUserinfoComponent>, public _cs: ContainerService,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) {
    if (data) {
      this.getuserinfo();
    }
  }

  getuserinfo() {
    if (this.data['userid']) {
      this._cs.getData('/do/2201.61', { userid: this.data['userid'] }).then(res => {
        this.setUserInfo(res['data']);
      }).catch(res => {
        this._cs.tipDialog(res['msg']);
      });
    }
  }

  setUserInfo(data) {
    for (const i in this.userInfo) {
      if (data[i] && data[i].length !== 0) {
        this.userInfo[i] = data[i];
      }
    }
  }

  copy(e) {
    const range = document.createRange();
    range.selectNode(e);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    this._cs.tipDialog('复制成功');
  }

  opnecard() {
    this.showCode = !this.showCode;
    if (this.showCode) {
      this.codeUrl = this.getcardData();
      this.dialogRef.updateSize('440px', '240px');
    } else {
      this.dialogRef.updateSize('250px', '240px');
    }
  }

  getcardData() {
    const user = this.userInfo;
    let a = '';
    const b = ''; // 姓
    const c = user['name'] || ''; // 名
    const d = user['post'] || '';
    const g = user['cellphone'] || '';
    const h = user['telephone'] || '';
    const j = user['email'] || '';
    a = 'BEGIN:VCARD',
      // tslint:disable-next-line:no-unused-expression
      a += '\r\nFN: ' + c + '  ' + b, d && (a += '\r\nTITLE:' + d),
      // tslint:disable-next-line:no-unused-expression
      g && (a += '\r\nTEL;CELL,VOICE:' + g),
      // tslint:disable-next-line:no-unused-expression
      h && (a += '\r\nTEL;WORK,VOICE:' + h),
      // tslint:disable-next-line:no-unused-expression
      j && (a += '\r\nEMAIL;INTERNET,HOME:' + j),
      a += '\r\nEND:VCARD';
    a = this.utf16to8(a);
    return a;
  }

  utf16to8(str) {
    let out; let i; let len; let c;
    out = '';
    len = str.length;
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      } else if (c > 0x07FF) {
        // tslint:disable-next-line:no-bitwise
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        // tslint:disable-next-line:no-bitwise
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        // tslint:disable-next-line:no-bitwise
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      } else {
        // tslint:disable-next-line:no-bitwise
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        // tslint:disable-next-line:no-bitwise
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
    }
    return out;
  }

  ngOnInit() { }

}
