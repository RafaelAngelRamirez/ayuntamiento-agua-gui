import { Component, AfterViewInit, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ROUTES } from "./menu-items";
import { RouteInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute } from "@angular/router";
import { UsuarioService } from "../../services/usuario.service";
//declare var $: any;
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  showMenu = "";
  showSubMenu = "";
  public sidebarnavItems: RouteInfo[] = [];

  // this is for the open close
  addExpandClass(element: string) {
    if (element === this.showMenu) {
      this.showMenu = "0";
    } else {
      this.showMenu = element;
    }
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioSerivce: UsuarioService
  ) {}
  // End open close
  ngOnInit() {
    let permisos = this.usuarioSerivce.obtenerUsuario().permissions;

    this.sidebarnavItems = ROUTES.filter(
      (sidebarnavItem) => sidebarnavItem
    ).filter((x) => {

      let p = x.permission
      if( p=== '' ) return true
      return permisos.includes(x.permission)});
  }
}
