import { Injectable } from '@angular/core';
import Extent from 'ol/interaction/Extent';
import { BehaviorSubject } from 'rxjs';
import { EDRCollection } from '../EDRCollection';

@Injectable({
  providedIn: 'root'
})
export class BboxService {
  private selectedBboxSubject = new BehaviorSubject<number[]| null>(null);
  private selectedCollectionId = new BehaviorSubject<string>('');
  selectedBbox$ = this.selectedBboxSubject.asObservable();
  selectedDrawing$ = this.selectedCollectionId.asObservable();

  constructor() {}

  setSelectedBbox(bbox: number[] | null) {
    this.selectedBboxSubject.next(bbox);
  }

  setSelectedDrawing(uwl: string) {
    this.selectedCollectionId.next(uwl);
  }
}
