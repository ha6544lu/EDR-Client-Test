import { Injectable } from '@angular/core';
import { EDRCollection } from '../EDRCollection';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service'; 

@Injectable({
  providedIn: 'root'
})
export class EDRClientService {

  private edrUrl = 'http://localhost:5050/collections'; 


  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})

  };

  constructor(
    private messageService: MessageService, private http: HttpClient) {
    
     }

  /** GET collections from the server */
  getCollections(): Observable<EDRCollection[]> {
    return this.http.get<any>(this.edrUrl)
      .pipe(
        map(response => response.collections),
        tap(_ => this.log('fetched collections')),
        catchError(this.handleError<EDRCollection[]>('getCollections', []))
      );
  }

  getDownloadMetadataUrl(collection: EDRCollection) {
    return this.edrUrl+'/'+collection.id+'?f=json'
  }

  getDownloadAllUrl(collection: any) {
    return this.edrUrl+'/'+collection.id+'/cube?bbox='+collection.extent.spatial.bbox[0]+'&f=json'
  }

  generateFilterUrlCube(filterCriteria: any, collection: EDRCollection): string {
    const baseUrl = this.edrUrl+'/'+collection.id+'/cube';
    const params = new URLSearchParams();
    if (filterCriteria.area) {
      params.set('bbox', filterCriteria.area);
    }
    if (filterCriteria.from && filterCriteria.to) {
      const datetimePicked = `${filterCriteria.from}/${filterCriteria.to}`
      params.set('datetime', datetimePicked);
    }
    if (filterCriteria.parameters && collection.parameter_names) {
      Object.entries(collection.parameter_names).forEach(([key, value]) => {
        if (filterCriteria.parameters[value.name]) {
          params.append('parameter-name', key);
        }
      });
    }
    params.append('f', 'json');
    return `${baseUrl}?${params.toString()}`;
  }

  generateFilterUrlPosition(filterCriteria: any, collection: EDRCollection): string {
    const baseUrl = this.edrUrl+'/'+collection.id+'/position';
    const params = new URLSearchParams();
    if (filterCriteria.coordinates) {
      const coordinates =  `POINT(${filterCriteria.coordinates})`
      params.set('coords', coordinates);
    }
    if (filterCriteria.from && filterCriteria.to) {
      const datetimePicked = `${filterCriteria.from}/${filterCriteria.to}`
      params.set('datetime', datetimePicked);
    }
    if (filterCriteria.parameters && collection.parameter_names) {
      Object.entries(collection.parameter_names).forEach(([key, value]) => {
        if (filterCriteria.parameters[value.name]) {
          params.append('parameter-name', key);
        }
      });
    }
    params.append('f', 'json');
    return `${baseUrl}?${params.toString()}`;
  }


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

  private log(message:string) {
    this.messageService.add('CollectionService:' + message);
  }
}
