import { Component, ViewChild } from "@angular/core";
import { NotificacionesService } from "./services/notificaciones.service";
import { ContratoService } from "./services/contrato.service";
import { ImprimirService } from "./services/imprimir.service";
import { ActivationStart, Router, RouterOutlet } from "@angular/router";
import { IndexedDbService } from "./services/offline/indexed-db.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  @ViewChild(RouterOutlet) outlet!: RouterOutlet;

  constructor(
    private notiService: NotificacionesService,
    private contratoService: ContratoService,
    public imprimirService: ImprimirService,
    private router: Router,
    private idbService: IndexedDbService
  ) {
    //Desactivamos el outlet para que no nos de error de
    // que ya esta
    this.router.events.subscribe((e) => {
      if (e instanceof ActivationStart && e.snapshot.outlet === "print") {
        this.outlet.deactivate();
      }
    });

    this.idbService.inicializar().subscribe(() => {
      this.cargarContratosEnMemoria();
    });
  }
  cargarContratosEnMemoria() {
    this.contratoService.offline.findAll().subscribe(
      (datos) => (this.contratoService.contratos = datos),
      (_) =>
        this.notiService.toast.error(
          "No se pudieron cargar los contratos en memoria"
        )
    );
  }
}
