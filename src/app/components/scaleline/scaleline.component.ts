import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import ControlScaleLine from 'ol/control/ScaleLine';

@Component({
  selector: 'app-scaleline',
  standalone: true,
  templateUrl: './scaleline.component.html',
  styleUrl: './scaleline.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScalelineComponent implements OnInit {
  @Input()
  map: Map = new Map;
  control: ControlScaleLine = new ControlScaleLine;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.control = new ControlScaleLine({
      target: this.elementRef.nativeElement,
    });
    this.map.addControl(this.control);
  }
}

