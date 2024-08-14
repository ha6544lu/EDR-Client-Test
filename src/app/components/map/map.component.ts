/*BSD 2-Clause License

Copyright 2005-present, OpenLayers Contributors All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/

import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, EventEmitter, Output } from '@angular/core';
import Map from 'ol/Map';
import { Feature, View } from 'ol';
//import { Extent } from 'ol/extent';
import Polygon from 'ol/geom/Polygon';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  @Input()
  map: Map = new Map();
  private draw: Draw | null = null;
  //@ts-ignore
  private vectorLayer: VectorLayer<VectorSource> | null = null;
  @Output() rectangleDrawn = new EventEmitter<[number, number, number, number]>();
  @Output() pointDrawn = new EventEmitter<[number, number]>();

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 3,
        projection: 'EPSG:4326',
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.elementRef.nativeElement,
    });
  }

  private updateMap(bbox: [number, number, number, number] | null): void {
    console.log('Received Bounding Box:', bbox);
    if (bbox && bbox.length === 4) {
      const coordinates = [
        [bbox[0], bbox[1]],  // Bottom-left corner
        [bbox[2], bbox[1]],  // Bottom-right corner
        [bbox[2], bbox[3]],  // Top-right corner
        [bbox[0], bbox[3]],  // Top-left corner
      ];

      const rectangleGeometry = new Polygon([coordinates]);
      const rectangleFeature = new Feature({
        geometry: rectangleGeometry,
      });

      const vectorSource = new VectorSource({
        features: [rectangleFeature],
      });

      if (this.vectorLayer) {
        this.map.removeLayer(this.vectorLayer);
      }
      //@ts-ignore
      this.vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      this.map.addLayer(this.vectorLayer);
      this.map.getView().fit(rectangleGeometry.getExtent());
    } else {
      if (this.vectorLayer) {
        this.map.removeLayer(this.vectorLayer);
        this.vectorLayer = null;
      }
    }
  }

  onDrawButtonClick(): void {
    this.enableDraw('Polygon');
  } 
  
  onPointButtonClick(): void {
    this.enableDraw('Point');
  }

  enableDraw(drawType: 'Point' | 'Polygon'): void {
    this.disableDraw(); 

    const source = new VectorSource();
    const vector = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2,
        }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2,
          }),
        }),
      }),
    });

    if (this.vectorLayer) {
      this.map.removeLayer(this.vectorLayer);
    }
    //@ts-ignore
    this.vectorLayer = vector;
    this.map.addLayer(vector);

    this.draw = new Draw({
      source: source,
      type: drawType,
    });

    this.map.addInteraction(this.draw);

    this.draw.on('drawend', (event: { feature: any; }) => {
      const feature = event.feature;
      if (drawType === 'Polygon') {
        const extent = feature.getGeometry().getExtent();
        console.log('Bounding Box Extent:', extent);
        this.rectangleDrawn.emit(extent as [number, number, number, number]);
      } else if (drawType === 'Point') {
        const coordinates = feature.getGeometry().getCoordinates();
        console.log('Point Coordinates:', coordinates);
        this.pointDrawn.emit(coordinates as [number, number]);
      }
      this.disableDraw();  
    });
  } 

  private disableDraw(): void {
    if (this.draw) {
      this.map.removeInteraction(this.draw);
      this.draw = null;
    }
  }
}
