import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";

import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ImprimirService } from "../../services/imprimir.service";
import { ZebraService } from "../../services/zebra/zebra.service";
import { NotificacionesService } from "../../services/notificaciones.service";
import { UsuarioService } from "../../services/usuario.service";

@Component({
  selector: "app-full-layout",
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.scss"],
})
export class FullComponent implements OnInit {
  color = "defaultdark";
  showSettings = false;
  showMinisidebar = true;
  showDarktheme = true;

  public innerWidth: number = -1;

  public config: PerfectScrollbarConfigInterface = {};

  constructor(
    private notiService: NotificacionesService,
    public imprimirService: ImprimirService,
    public router: Router,
    private zebraService: ZebraService,
    private usuarioSerivce: UsuarioService
  ) {}

  ngOnInit() {
    if (this.router.url === "/") {
      this.router.navigate(["/dashboard/dashboard1"]);
    }

    setTimeout(() => {
      this.handleLayout();
    }, 1000);

    this.comprobarMiniPrinter();
  }

  comprobarMiniPrinter() {
    //Si el usuario usa un iphone
    // no hacemos el setup a la impresora

    let usuario = this.usuarioSerivce.obtenerUsuario();
    if (!usuario.esIphone) {
      this.zebraService
        .setup()
        .then((device: any) => {
          this.zebraService.selected_device = device;
          this.notiService.toast.correcto(
            "Mini printer configurada: " + device.uid
          );
        })
        .catch((error) => this.notiService.toast.error(error));
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: string) {
    this.handleLayout();
  }

  toggleSidebar() {
    this.showMinisidebar = !this.showMinisidebar;
  }

  handleLayout() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 925) {
      this.showMinisidebar = true;
    } else {
      this.showMinisidebar = false;
    }
  }
}
