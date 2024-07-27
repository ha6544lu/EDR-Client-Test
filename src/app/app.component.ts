import { Component, NgModule, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from "./components/map/map.component";
import { ScalelineComponent } from './components/scaleline/scaleline.component';
import { MousePositionComponent } from './components/mouse-position/mouse-position.component';
import { EDRComponentComponent } from './components/edrcomponent/edrcomponent.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [MapComponent, ScalelineComponent, MousePositionComponent, EDRComponentComponent],
    providers: [DecimalPipe],
})
export class AppComponent implements OnInit {
  title = 'edrClient';
  //map: Map = new Map; 

  ngOnInit(): void {
   /** this.map = new Map({
      view: new View({
        center: [0,0],
        zoom: 1,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'ol-map'
    }); */
  }
}

const routes: Routes = [
  { path: 'edrcomponent', component: EDRComponentComponent },
  // Add more routes as needed
];

@NgModule({
  declarations: [],
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule, RouterOutlet],
 // providers: [DecimalPipe],
  //bootstrap: [AppComponent]
})
export class AppRoutingModule {}