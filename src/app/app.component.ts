import { Component, NgModule, OnInit } from '@angular/core';
import { MapComponent } from "./components/map/map.component";
import { EDRComponentComponent } from './components/edrcomponent/edrcomponent.component';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [MapComponent, EDRComponentComponent],
    providers: [DecimalPipe],
})
export class AppComponent implements OnInit {
  title = 'edrClient';

  ngOnInit(): void {
  }
}

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class AppRoutingModule {}