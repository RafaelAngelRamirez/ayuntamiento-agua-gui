import { Component } from "@angular/core";
import { IndexedDBService, IDBOpciones } from "@codice-progressio/indexed-db";
import { NotificacionesService } from "./services/notificaciones.service";
import { ContratoService } from "./services/contrato.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(
    private dbService: IndexedDBService,
    private notiService: NotificacionesService,
    private contratoService: ContratoService,
    private idbService: IndexedDBService
  ) {
    let opciones = new IDBOpciones();
    opciones.nombreBD = "simapa";
    opciones.keyPath = "Contrato";
    opciones.objectStore = "contratos";
    this.dbService.inicializar(opciones).subscribe(() => {
      this.cargarContratosEnMemoria();
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
