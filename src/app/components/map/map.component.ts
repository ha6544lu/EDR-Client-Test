import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, EventEmitter, Output } from '@angular/core';
import Map from 'ol/Map';
import { Feature, View } from 'ol';
import { Extent } from 'ol/extent';
import Polygon from 'ol/geom/Polygon';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import Draw from 'ol/interaction/Draw';
import { Fill, Stroke, Style } from 'ol/style';
import { MousePositionComponent } from '../mouse-position/mouse-position.component';
import { ScalelineComponent } from '../scaleline/scaleline.component';
import CircleStyle from 'ol/style/Circle';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ScalelineComponent, MousePositionComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  @Input()
  map: Map = new Map();
  private draw: Draw | null = null;
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
    this.disableDraw(); // Disable any existing draw interactions

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
      this.disableDraw();  // Disable drawing after the shape/point is selected
    });
  } 

 /* enableDraw(): void {
    this.disableDraw(); // Disable any existing draw interactions

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
      }),
    });

    if (this.vectorLayer) {
      this.map.removeLayer(this.vectorLayer);
    }

    this.vectorLayer = vector;
    this.map.addLayer(vector);

    this.draw = new Draw({
      source: source,
      type: 'Polygon',
    });

    this.map.addInteraction(this.draw);

    this.draw.on('drawend', (event: { feature: any; }) => {
      const feature = event.feature;
      const extent = feature.getGeometry().getExtent();
      console.log('Bounding Box Extent:', extent);
      this.rectangleDrawn.emit(extent as [number, number, number, number]);
      this.disableDraw();  // Disable drawing after the first shape is completed
    });
  }**/

  private disableDraw(): void {
    if (this.draw) {
      this.map.removeInteraction(this.draw);
      this.draw = null;
    }
  }
}
