import { Component, ViewChild } from "@angular/core";
import { IndexedDBService, IDBOpciones } from "@codice-progressio/indexed-db";
import { NotificacionesService } from "./services/notificaciones.service";
import { ContratoService } from "./services/contrato.service";
import { ImprimirService } from "./services/imprimir.service";
import { ActivationStart, Router, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  @ViewChild(RouterOutlet) outlet!: RouterOutlet;

  constructor(
    private dbService: IndexedDBService,
    private notiService: NotificacionesService,
    private contratoService: ContratoService,
    private idbService: IndexedDBService,
    public imprimirService: ImprimirService,
    private router: Router
  ) {
    let opciones = new IDBOpciones();
    opciones.nombreBD = "simapa";
    opciones.keyPath = "Contrato";
    opciones.objectStore = "contratos";
    this.dbService.inicializar(opciones).subscribe(() => {
      this.cargarContratosEnMemoria();
    });

    //Desactivamos el outlet para que no nos de error de
    // que ya esta
    this.router.events.subscribe((e) => {
      if (e instanceof ActivationStart && e.snapshot.outlet === "print") {
        this.outlet.deactivate();
      }
    });
  }
  cargarContratosEnMemoria() {
    this.idbService.findAll().subscribe(
      (datos) => (this.contratoService.contratos = datos),
      (_) =>
        this.notiService.toast.error(
          "No se pudieron cargar los contratos en memoria"
        )
    );
  }
}
