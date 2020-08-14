import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FullComponent } from "../layouts/full/full.component";
import { UsuarioComponent } from "./usuario/usuario.component";
import { ContratosComponent } from './contratos/contratos.component'

export const Pagesroutes: Routes = [
  { path: "", redirectTo: "/tablero", pathMatch: "full" },
  {
    path: "tablero",
    loadChildren: () =>
      import("../dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "usuario",
    component: UsuarioComponent,
  },
  {
    path: "contratos",
    component: ContratosComponent,
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
