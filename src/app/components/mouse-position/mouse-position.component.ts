import { ChangeDetectionStrategy, Component, OnInit, Input, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import ControlMousePosition from 'ol/control/MousePosition';
import { CoordinateFormatterService } from '../../services/coordinate-formatter.service';


@Component({
  selector: 'app-mouse-position',
  standalone: true,
  imports: [],
  templateUrl: './mouse-position.component.html',
  styleUrl: './mouse-position.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MousePositionComponent implements OnInit {
  @Input() map: Map = new Map;
  @Input() positionTemplate: string = '';
  control: ControlMousePosition = new ControlMousePosition;

  constructor(
    private element: ElementRef,
    private coordinateFormatter: CoordinateFormatterService,
  ) {
  }

  ngOnInit() {
    this.control = new ControlMousePosition({
      className: 'mouseposition-control',
      coordinateFormat: (coordinates: number[] | undefined) => {
        if (!coordinates || coordinates.length !== 2) {
          return ''; // Return an empty string if coordinates are undefined or not in the correct format
        }
        return this.coordinateFormatter.numberCoordinates(coordinates, 4, this.positionTemplate);
      }, 
      target: this.element.nativeElement,  
    });
    this.map.addControl(this.control);
  }
 
}
