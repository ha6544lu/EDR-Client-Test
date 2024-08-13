import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EDRCollection } from '../../EDRCollection';
import { EDRClientService } from '../../services/edrclient.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapComponent } from "../map/map.component";

@Component({
  selector: 'app-edrcomponent',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, MapComponent],
  templateUrl: './edrcomponent.component.html',
  styleUrl: './edrcomponent.component.css',
  providers: []
})
export class EDRComponentComponent implements OnInit {
  collections: EDRCollection[] = [];
  selectedCollection: any | null = null; 
  showButtonCollections: any | null = null; 
  metadataShownForCollection: any | null = null;
  showFilterForm = false; 
  filterCriteria = { area: '', coordinates: '', from: '', to: '', parameters: {} as { [key: string]: boolean }};
  parameters: string[] = [];
  filterType: string | null = null;
  @Output() drawButtonClicked = new EventEmitter<void>(); 
  @Output() pointButtonClicked = new EventEmitter<void>();
  activeView: string | null = null;

  constructor(private edrClientService: EDRClientService) {}

  ngOnInit(): void {
    this.getCollections();
  }

  onDrawButtonClick(): void {
    this.drawButtonClicked.emit();
  }

  onPointButtonClick(): void {
    this.pointButtonClicked.emit();
  }  

  getCollections(): void {
    this.edrClientService.getCollections()
    .subscribe(collections => {
      this.collections = collections; 
      console.log('Collections:', collections);      
    },
    error => {
      console.error('Error fetching collections', error);
    }
  );
  }
  
  getUniqueParameters(collection: EDRCollection): string[] {
    const parameterNames: string[] = [];
    if (collection.parameter_names) {
      Object.values(collection.parameter_names).forEach((value) => {
        parameterNames.push(value.name);
      });
    }
    console.log(collection.parameter_names);
    console.log('Parameter Names:', parameterNames);
    return parameterNames
  }  
      
  downloadMetadata(collection: EDRCollection): void {
    window.open(this.edrClientService.getDownloadMetadataUrl(collection), '_blank');
  }

  downloadAll(collection: EDRCollection): void {
    window.open(this.edrClientService.getDownloadAllUrl(collection), '_blank');   
  }

  onFilterSubmit(): void {
    console.log('Filter criteria:', this.filterCriteria);
    if (this.filterType === 'position') {
      const filterUrlPosition = this.edrClientService.generateFilterUrlPosition(this.filterCriteria, this.showButtonCollections);
      window.open(filterUrlPosition, '_blank');
      console.log(filterUrlPosition);
    } else if (this.filterType === 'cube') {
      const filterUrlCube = this.edrClientService.generateFilterUrlCube(this.filterCriteria, this.showButtonCollections);
      window.open(filterUrlCube, '_blank');
    }
    this.resetFilterCriteria();
  }

  showMetadata(collection: any): void {
    if (this.selectedCollection === collection) {
      this.selectedCollection = null; 
      this.metadataShownForCollection = null;
      this.activeView = null;
    } else {
      this.selectedCollection = collection; 
      this.metadataShownForCollection = collection;
      this.activeView = 'metadata';
    }
  }

  showButtons(collection: EDRCollection): void {
    if (this.showButtonCollections === collection) {
      this.showButtonCollections = null; 
      this.parameters = [];
      this.activeView = null;
    } else {
      this.showButtonCollections = collection;
      this.parameters = this.getUniqueParameters(this.showButtonCollections);
    
    }
  }

  closeButtons() {
    this.showButtonCollections = null; 
    this.activeView = '';
    this.resetFilterCriteria();
  }

  viewFilterForm(): void {
    if (this.showFilterForm && this.filterType) {
      this.filterType = null;
    } else {
      this.activeView = 'filterForm';
      this.showFilterForm = !this.showFilterForm;
      this.filterType = null;
    }
    this.resetFilterCriteria();
  }

  selectFilterType(type: string) {
    this.filterType = type;
  }

  onRectangleDrawn(extent: [number, number, number, number]): void {
    this.filterCriteria.area = `${extent[0]}, ${extent[1]}, ${extent[2]},${extent[3]}`;
  }

  onPointDrawn(coordinates: [number, number]): void {
    this.filterCriteria.coordinates = `${coordinates[0]} ${coordinates[1]}`;
  }

  backToCollection(): void {
    this.activeView = null; 
    this.showFilterForm = false; 
    this.selectedCollection = null;
    this.resetFilterCriteria(); 
  }

  resetFilterCriteria(): void {
    this.filterCriteria = {
      area: '',
      coordinates: '',
      from: '',
      to: '',
      parameters: {}
    };
  }
}


