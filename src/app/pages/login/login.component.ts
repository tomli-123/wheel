import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginComponent as loginTpl, AuthService, LoadService } from '@qiuer/frame';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends loginTpl implements OnInit {
  constructor(public http: HttpClient,
    public authService: AuthService,
    public loadService: LoadService,
    public router: Router,
    public el: ElementRef) {
    super(http, authService, loadService, router, el);
  }

  isSso = false;

  // 切换背景图
  setBgImg() {
    this.bgimg = 'url(../assets/img/page/login/bg' + Math.floor(Math.random() * 10) + '.jpg)';
  }

  ngOnInit() {
    this.setBgImg();
    super.ngOnInit();
  }

}
