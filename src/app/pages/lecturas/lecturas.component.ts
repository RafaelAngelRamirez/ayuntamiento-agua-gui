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
import { ZebraService } from "../../services/zebra/zebra.service";
import { UsuarioService } from "../../services/usuario.service";
import { NotificacionesService } from "../../services/notificaciones.service";
import { TienePermisoPipe } from "../../pipes/tiene-permiso.pipe";

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
    private zebraService: ZebraService,
    private router: Router,
    private contratoService: ContratoService,
    private usuarioService: UsuarioService,
    private notiService: NotificacionesService,
    private tienePermiso: TienePermisoPipe
  ) {}

  ngOnInit(): void {
    document.getElementById("buscador")?.focus();
    this.registrarBuscador();

    if (!this.zebraService.selected_device) {
      this.zebraService.setup().then((device: any) => {
        this.zebraService.selected_device = device;
        if (!this.equipoCorrecto()) {
          this.notiService.sweet.alerta(
            "No estas usando la miniprinter que te fue asignada. Si es un error reportalo con el administrador. No podras tomar lecturas por el momento. ",
            "¡Hay un problema!",
            "info"
          );
        }
      });
    }
  }

  equipoCorrecto() {
    let usuario = this.usuarioService.obtenerUsuario();
    if (usuario.esIphone) return true;
    // if(this.tienePermiso.transform("administrador"))return true

    let equipo = usuario.dispositivo;
    return this.zebraService.selected_device?.uid === equipo;
  }

  registrarBuscador() {
    this.buscador.valueChanges
      .pipe(
        tap((_) => (this.cargando = true)),
        debounceTime(500)
      )
      .subscribe(
        (termino) => {
          // if (this.tienePermiso.transform("administrador")) {
          //   this.contratoService.findByTerm(termino.trim()).subscribe(
          //     (contratos) => {
          //       this.contratos = contratos;
          //       this.cargando = false;
          //     },
          //     (_) => (this.cargando = false)
          //   );
          // } else {
            this.contratos = this.contratoService.buscarPorTermino(termino);
            this.cargando = false;
          // }
        },
        (_) => (this.cargando = false)
      );
  }

  irA(contrato: Contrato) {
    if (!this.equipoCorrecto()) {
      this.notiService.sweet.alerta(
        "No puedes imprimir con este equipo. Si es un error reportaselo al administrador.",
        "Mini printer no valida",
        "error"
      );

      return;
    }
    let ruta = contrato.tomada ? "imprime" : "captura";
    this.router.navigate(["app", "lectura", ruta, contrato.Contrato]);
  }
}
