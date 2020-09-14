import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewChildren,
} from "@angular/core";
import { ContratoService, Contrato } from "../../services/contrato.service";
import { FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "app-lecturas",
  templateUrl: "./lecturas.component.html",
  styleUrls: ["./lecturas.component.css"],
})
export class LecturasComponent implements OnInit {
  buscador = new FormControl();

  cargando = false;

  contratos: Contrato[] = [];
  constructor(
    private router: Router,
    private contratoService: ContratoService
  ) {}

  ngOnInit(): void {
    document.getElementById("buscador")?.focus();
    this.registrarBuscador();
  }

  registrarBuscador() {
    this.buscador.valueChanges
      .pipe(
        tap((_) => (this.cargando = true)),
        debounceTime(500)
      )
      .subscribe(
        (termino) => {
          this.contratos = this.contratoService.buscarPorTermino(termino);
          this.cargando = false;
        },
        (_) => (this.cargando = false)
      );
  }

  irA(contrato: Contrato) {
    let ruta = contrato.tomada ? "imprime" : "captura";
    this.router.navigate(["app","lectura", ruta, contrato.Contrato]);
  }
}
