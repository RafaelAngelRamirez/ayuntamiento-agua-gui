import { Component, OnInit } from "@angular/core";
import { ContratoService, Contrato } from "../../services/contrato.service";
import { IndexedDBService } from "@codice-progressio/indexed-db";
import { forkJoin } from "rxjs";
import { NotificacionesService } from "../../services/notificaciones.service";
import { FormControl } from "@angular/forms";
import { ParametrosService } from "../../services/parametros.service";
import { Rutas } from "../../models/usuario.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-contratos",
  templateUrl: "./contratos.component.html",
  styleUrls: ["./contratos.component.css"],
})
export class ContratosComponent implements OnInit {
  constructor(
    private router: Router,
    private parametrosService: ParametrosService,
    private notiService: NotificacionesService,
    private contratoService: ContratoService
  ) {}

  contratos: Contrato[] = [];
  contratosMostrar: Contrato[] = [];

  rutaParaSincronizar: Rutas | undefined = undefined;

  desde = 0;
  limite = 30;
  skip = this.limite;
  sincronizandoContratos = false;

  leyendoContratosOffline = false;

  buscador = new FormControl();

  ngOnInit(): void {
    this.registrarBuscador();
    this.cargarRutaParaSincronizarContratos();
  }

  cargarRutaParaSincronizarContratos() {
    this.parametrosService.offline
      .obtenerRutaSeleccionada()
      .subscribe((ruta) => {
        this.rutaParaSincronizar = ruta as Rutas;
        this.cargarDatos();
      });
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

    this.contratoService.offline.findAll().subscribe(
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

    let idRuta = this.rutaParaSincronizar?.IdRuta;

    if (!idRuta) {
      this.notiService.sweet.confirmacion(
        "No haz definido una ruta para sincronizar contratos. ¿Quieres ir parametros ahora? ",
        "Faltan parametros",
        () => {
          this.router.navigate(["app", "parametros"]);
        },
        () => {
          this.notiService.toast.error(
            "No puedes sincronizar contratos si no defines la ruta a trabajar"
          );
        }
      );

      return;
    }

    this.sincronizandoContratos = true;

    //Comprobamos que no tengamos contratos sin sincronizar con la BD

    this.contratoService
      .sincronizarContratosTomadosOffline()
      .subscribe((cantidad) => {
        this.notiService.toast.correcto(`Se subieron ${cantidad} contratos`);
        if (!idRuta) return;
        this.contratoService.findAllInRoute(idRuta).subscribe(
          (contratos) => {
            this.contratos = contratos;
            if (contratos.length === 0) {
              this.sincronizandoContratos = false;
              this.leyendoContratosOffline = false;
              this.buscador.enable();
              this.notiService.toast.warning(
                "No hay contratos para sincronizar"
              );
              return;
            }
            forkJoin(
              contratos.map((c) => this.contratoService.offline.update(c))
            ).subscribe(
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
      });
  }

  mostrarContratos() {
    this.contratosMostrar = this.contratos.slice(
      this.desde,
      this.desde + this.skip
    );
  }
}
