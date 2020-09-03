import { Component, OnInit } from "@angular/core";
import { ContratoService, Contrato } from "../../services/contrato.service";
import { IndexedDBService } from "@codice-progressio/indexed-db";
import { forkJoin } from "rxjs";
import { NotificacionesService } from "../../services/notificaciones.service";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-contratos",
  templateUrl: "./contratos.component.html",
  styleUrls: ["./contratos.component.css"],
})
export class ContratosComponent implements OnInit {
  constructor(
    private notiService: NotificacionesService,
    private contratoService: ContratoService,
    private idbService: IndexedDBService
  ) {}

  contratos: Contrato[] = [];
  contratosMostrar: Contrato[] = [];

  desde = 0;
  limite = 30;
  skip = this.limite;
  sincronizandoContratos = false;

  leyendoContratosOffline = false;

  buscador = new FormControl();

  ngOnInit(): void {
    this.cargarDatos();
    this.registrarBuscador();
  }

  registrarBuscador() {
    this.buscador.valueChanges.subscribe((value) => {
      if (!value) return;
      this.contratosMostrar = this.contratos
        .map((x: Contrato) => {
          return {
            busqueda: this.contratoService.construirBusqueda(x),
            contrato: x,
          };
        })
        .filter((x) => x.busqueda.includes(value.toLowerCase()))
        .slice(this.desde, this.desde + this.skip)
        .map((x) => x.contrato as Contrato);
    });
  }

  cargarDatos() {

    
    this.leyendoContratosOffline = true;
    this.buscador.disable();

    console.log("EStamos aqui")
    this.idbService.findAll().subscribe(
      (datos) => {
        console.log(datos.length)
        if (datos.length === 0) {
          this.sincronizar();
        } else {

          this.contratos = this.contratoService.contratos = datos;
          this.mostrarContratos();

          this.leyendoContratosOffline = false;
          this.buscador.enable();
        }
      },
      (_) => {
        this.leyendoContratosOffline = false;
        this.buscador.enable();
      }
    );
  }

  sincronizar() {
    if (!this.contratoService.estaOnline) {
      this.notiService.toast.warning(
        "No estas conectado. No se pueden sincronizar los contratos"
      );

      return;
    }

    this.sincronizandoContratos = true;

    //Comprobamos que no tengamos contratos sin sincronizar con la BD
    let contratosPorSincronizar = this.contratoService.contratosPorSubir();
    if (contratosPorSincronizar.length > 0) {
      this.notiService.toast.warning(
        `Hay ${contratosPorSincronizar} contratos pendientes por subir a la nube. Primero debes subirlos para no perder los datos.`
      );

      return;
    }


    console.log("Entro aqui")
    this.contratoService.findAll().subscribe(
      (contratos) => {
        this.contratos = contratos;
        console.log(`Se encontraron contratos`,contratos.length)
        if (contratos.length === 0) {
          this.sincronizandoContratos = false;
          this.leyendoContratosOffline = false;
          this.buscador.enable();
          this.notiService.toast.warning("No hay contratos para sincronizar");
          return;
        }
        console.log(`empieza el fork`)
        forkJoin(contratos.map((c) => this.idbService.update(c))).subscribe(
          () => {
            console.log("Termino fork")
            this.sincronizandoContratos = false;
            this.leyendoContratosOffline = false;
            this.buscador.enable();
            this.notiService.toast.correcto(
              `Se sincronizaron ${this.contratos.length} contratos`
            );
            this.mostrarContratos();
          },

          (_) => {
            console.log("error", _)
            this.sincronizandoContratos = false;
            this.leyendoContratosOffline = false;
            this.buscador.enable();
          },
          ()=> console.log("completede forkJoin")
        );
      },
      (_) => {
        this.sincronizandoContratos = false;
        this.leyendoContratosOffline = false;
      }
    );
    //Comprobamos que no haya contratos sin sincronizar.
  }

  mostrarContratos() {
    this.contratosMostrar = this.contratos.slice(
      this.desde,
      this.desde + this.skip
    );
  }
}
