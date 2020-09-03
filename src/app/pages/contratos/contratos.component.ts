import { Component, OnInit } from "@angular/core";
import { ContratoService, Contrato } from "../../services/contrato.service";
import { IndexedDBService } from "@codice-progressio/indexed-db";
import { forkJoin } from "rxjs";
import { NotificacionesService } from "../../services/notificaciones.service";

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

  desde = 0;
  limite = 30;
  skip = this.limite;
  sincronizandoContratos = false;

  ngOnInit(): void {
    console.log("Entro");
    this.idbService.findAll().subscribe((datos) => {
      if (datos.length === 0) {
        console.log("Aqui sigue");
        this.sincronizar();
      } else {
        this.contratos = datos.slice(this.desde, this.skip);
      }
    });
  }

  sincronizar() {
    console.log("sincronizando");
    this.sincronizandoContratos = true;

    this.contratoService.findAll().subscribe(
      (contratos) => {
        this.contratos = contratos;

        console.log("Se obtuvieron los contratos", this.contratos.length);
        console.log(this.idbService._opciones.objectStore);

        if (contratos.length === 0) {
          this.sincronizandoContratos = false;
          this.notiService.toast.warning("No hay contratos para sincronizar");
          return;
        }
        
        forkJoin([...contratos.map((c) => this.idbService.save(c))])
        .subscribe(
          () => {
            this.sincronizandoContratos = false;
            this.notiService.toast.correcto(
              `Se sincronizaron ${this.contratos.length} contratos`
            );

            console.log("Estamos aqui")
          },

          (_) => console.log(_)
          , ()=> console.log("Finally")
        );




      },
      (_) => (this.sincronizandoContratos = false)
    );
    //Comprobamos que no haya contratos sin sincronizar.
  }
}
