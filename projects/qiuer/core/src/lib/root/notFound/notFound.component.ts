import { Component, OnInit } from '@angular/core';
import { ContainerComponent, ContainerMetadata } from '../../container/container.component';
import { ContainerService } from '../../container/container.service';

@Component({
  selector: 'notfound',
  templateUrl: './notFound.component.html',
  styleUrls: ['./notFound.component.scss']
})
export class NotFoundContainerComponent extends ContainerComponent implements OnInit {

  constructor(public _service: ContainerService) {
    super(_service);
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    super.ngOnInit();
  }

}
