import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: [ '', Validators.required],
    pais: [ '', Validators.required],
    frontera: [ '', Validators.required],
  });

  // Llenar Selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  paisesFronterizos: PaisSmall[] | null = [];
  cargando: boolean = false;

  constructor( private fb: FormBuilder,
                private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // Cuando cambie la region
  //   this.miFormulario.get('region')?.valueChanges
  //     .subscribe( region => {
  //       console.log(region);
  //       this.paisesService.getPaisesPorRegion(region)
  //         .subscribe(paises => {
  //           console.log(paises);
  //           this.paises = paises;
  //         })
  //     });
  
  this.miFormulario.get('region')?.valueChanges
  .pipe(
    tap( region => {
      console.log(region);
      this.miFormulario.get('pais')?.reset('');
      this.cargando = true;
    }),
    switchMap( region => this.paisesService.getPaisesPorRegion(region))
  )
  .subscribe( paises => {
    console.log(paises);
    this.paises = paises;
    this.cargando = false;
  });


  // Cuando seleccionas un pais
  this.miFormulario.get('pais')?.valueChanges
  .pipe(
    tap( pais => {
      console.log(pais);
      this.miFormulario.get('frontera')?.reset('');
      this.cargando = true;
    }),
    switchMap( codPais => this.paisesService.getPaisPorCodigo(codPais)),
    switchMap( pais => this.paisesService.getPaisesPorCodigos(pais?.borders!))
  )
  .subscribe (detallePais => {
    console.log(detallePais);
    this.paisesFronterizos = detallePais;
    this.cargando = false;
  });
}


  guardar(){
    console.log(this.miFormulario.value);
    
  }
}
