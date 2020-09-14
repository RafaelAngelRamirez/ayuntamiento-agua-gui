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
      this.contratosMostrar = this.contratoService.buscarPorTermino(
        value,
        this.desde,
        this.skip
      );
    });
  }

  cargarDatos() {
    this.leyendoContratosOffline = true;
    this.buscador.disable();

    this.idbService.findAll().subscribe(
      (datos) => {
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

    this.contratoService.findAll().subscribe(
      (contratos) => {
        this.contratos = contratos;
        if (contratos.length === 0) {
          this.sincronizandoContratos = false;
          this.leyendoContratosOffline = false;
          this.buscador.enable();
          this.notiService.toast.warning("No hay contratos para sincronizar");
          return;
        }
        forkJoin(contratos.map((c) => this.idbService.update(c))).subscribe(
          () => {
            this.sincronizandoContratos = false;
            this.leyendoContratosOffline = false;
            this.buscador.enable();
            this.notiService.toast.correcto(
              `Se sincronizaron ${this.contratos.length} contratos`
            );
            this.mostrarContratos();
          },

          (_) => {
            this.sincronizandoContratos = false;
            this.leyendoContratosOffline = false;
            this.buscador.enable();
          }
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
