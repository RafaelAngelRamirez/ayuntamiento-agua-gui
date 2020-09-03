import { Component } from "@angular/core";
import { IndexedDBService, IDBOpciones } from "@codice-progressio/indexed-db";
import { NotificacionesService } from "./services/notificaciones.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(
    private dbService: IndexedDBService,
    private notiService: NotificacionesService
  ) {
    let opciones = new IDBOpciones()
    opciones.nombreBD = "simapa"
    opciones.keyPath = "Contrato"
    opciones.objectStore = "contratos"
    this.dbService.inicializar(opciones).subscribe(() => {
      this.notiService.toast.info("BD en linea");

    });
  }
}
