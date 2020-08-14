import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FullComponent } from "../layouts/full/full.component";

export const Pagesroutes: Routes = [
  { path: "", redirectTo: "/tablero", pathMatch: "full" },
  {
    path: "tablero",
    loadChildren: () =>
      import("../dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "component",
    loadChildren: () =>
      import("../component/component.module").then((m) => m.ComponentsModule),
  },
  {
    path: "**",
    redirectTo: "/tablero",
  },
];
