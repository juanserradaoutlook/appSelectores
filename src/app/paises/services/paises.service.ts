import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  private baseUrl = 'https://restcountries.com/v3.1/region';
  private baseUrl2 = 'https://restcountries.com/v2/alpha';

  get regiones(): string[] {
    return [ ...this._regiones];
  }
  constructor( private http: HttpClient) { }

  getPaisesPorRegion( region: string): Observable<PaisSmall[]> {

    const url: string = `${this.baseUrl}/${region}?fields=name,cca3`;

    return this.http.get<PaisSmall[]>( url );
  }


  getPaisPorCodigo( codigo: string): Observable<Pais | null> {

    if(!codigo){
      return of(null)
    }
    const url: string = `${this.baseUrl2}/${codigo}`;

    return this.http.get<Pais>( url );
  }

  getPaisPorCodigoSmall( codigo: string): Observable<PaisSmall> {

    const url: string = `${this.baseUrl2}/${codigo}?fields=name,cca3`;

    return this.http.get<PaisSmall>( url );
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[] | null>{
    if(!borders){
      return of ([]);
    }
    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);

  }

}
