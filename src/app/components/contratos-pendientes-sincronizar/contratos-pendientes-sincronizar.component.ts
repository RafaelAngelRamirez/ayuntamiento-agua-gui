import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ParametrosService } from "../../services/parametros.service";
import { NotificacionesService } from "../../services/notificaciones.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-contratos-pendientes-sincronizar",
  templateUrl: "./contratos-pendientes-sincronizar.component.html",
  styleUrls: ["./contratos-pendientes-sincronizar.component.css"],
})
export class ContratosPendientesSincronizarComponent implements OnInit {
  totalDeContratos = 0;
  contratosPendientesDeSincronizar = 0;
  contratosSincronizados = 0;

  @Output() esteComponente = new EventEmitter<this>();

  constructor(
    private parametrosService: ParametrosService,
    private notiService: NotificacionesService
  ) {
    
  }

  ngOnInit(): void {
    this.cargarEstadisticas();
    this.esteComponente.emit(this);
  }

  cargandoEstadisticas = false;
  cargarEstadisticas() {
    this.cargandoEstadisticas = true;
    this.parametrosService.obtenerEstadisticasSincronizacion().subscribe(
      (resultado: any) => {
        this.cargandoEstadisticas = false;
        this.totalDeContratos = resultado.totalDeContratos;
        this.contratosPendientesDeSincronizar =
          resultado.contratosPendientesDeSincronizar;
        this.contratosSincronizados = resultado.contratosSincronizados;
        this.notiService.toast.correcto("Estadisticas sincronizadas");
      },
      (_) => (this.cargandoEstadisticas = false)
    );
  }
}
