import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";

import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ImprimirService } from "../../services/imprimir.service";

@Component({
  selector: "app-full-layout",
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.scss"],
})
export class FullComponent implements OnInit {
  color = "defaultdark";
  showSettings = false;
  showMinisidebar = false;
  showDarktheme = false;

  public innerWidth: number = -1;

  public config: PerfectScrollbarConfigInterface = {};

  constructor(public imprimirService: ImprimirService, public router: Router) {}

  ngOnInit() {
    if (this.router.url === "/") {
      this.router.navigate(["/dashboard/dashboard1"]);
    }
    this.handleLayout();
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
    if (this.innerWidth < 1170) {
      this.showMinisidebar = true;
    } else {
      this.showMinisidebar = false;
    }
  }

}
