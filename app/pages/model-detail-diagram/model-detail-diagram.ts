import {Page, NavController, Loading} from 'ionic-angular';
import {ViewChild, ElementRef} from '@angular/core';
import {ModelService} from '../../providers/model-service/model-service';
import {Model} from '../../data-types/data-types';
import {Observable} from 'rxjs/Observable';

declare var joint : any;

@Page({
  templateUrl: 'build/pages/model-detail-diagram/model-detail-diagram.html'
})
export class ModelDetailDiagramPage {

  @ViewChild('map') map: ElementRef;
  public loading : Loading;

  private _modelSubscription = null;

  constructor(public nav: NavController,
              private _modelService: ModelService) {
    // View does not exist yet
  }

  ngAfterViewInit(){
    this._modelSubscription = this._modelService.selectedModel$.subscribe(
      data  => {
        console.log("receive new model");
        this.draw(data);
      },
      error => console.log(error)
    );

  }

  ngOnDestroy() {
    console.log("view diagram destroyed");
    this._modelSubscription.unsubscribe(); // TBC utile ?
  }

  draw(model : Model) {
    //this.presentLoading();
    console.log('loading')
      console.log('******DRAW******');
      console.log(this.map.nativeElement);
      let w = this.map.nativeElement.clientWidth;
      let h = this.map.nativeElement.clientHeight;
      console.log(`size = ${h} / ${w}`);
      console.log('****************');

      let graph = new joint.dia.Graph;
      let el = this.map.nativeElement;
      let paper = new joint.dia.Paper({
          el       : el,
          width    : 200,//el.clientWidth = 0
          height   : 200,//el.clientHeight = 0
          gridSize : 1,
          model    : graph,
          perpendicularLinks : true
        });

        /*paper.on('cell:pointerclick',
         function (cellView, evt, x, y) {
             var dsp = $('#dsp').text();
             var m = cellView.model
             //var data = m.attributes.prop.data;
             window.location = "index.html?view=model_param&block_label=" + m.id + "&model_name=" + json['model_name'];
         });*/

      graph.fromJSON(model);
      /*var rect = new joint.shapes.basic.Rect({
         position: { x: 100, y: 30 },
         size: { width: 100, height: 30 },
         attrs: { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' } }
       });
       graph.addCell(rect);*/

       paper.scaleContentToFit();
       paper.setOrigin(paper.options.origin["x"], 50);
       console.log('done')
       //this.loading.dismiss();
    }

  presentLoading() {
    this.loading = Loading.create({
      content: 'Drawing...',
      duration: 5000});
    this.nav.present(this.loading);
    /*setTimeout(() => {
      loading.dismiss();
    }, 5000);*/
  }
}