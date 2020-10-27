import { Routes } from "@angular/router";
import { ValidaLoginGuard } from '../guards/valida-login.guard'

export const Pagesroutes: Routes = [
  { path: "", redirectTo: "/tablero", pathMatch: "full" },
  {
    path: "tablero",
    loadChildren: () =>
      import("../dashboard/dashboard.module").then((m) => m.DashboardModule),
      // canLoad: [ValidaLoginGuard],
      // data: { permission: "menu:dashboard" },
  },
  {
    path: "usuario",
    loadChildren: () =>
      import("./usuario/usuario.module").then((m) => m.UsuarioModule),
      canLoad: [ValidaLoginGuard],
      data: { permission: "administrador" },
  },
  {
    path: "contrato",
    loadChildren: () =>
      import("./contratos/contrato.module").then((m) => m.ContratoModule),
      canLoad: [ValidaLoginGuard],
      data: { permission: "login" },
  },
  {
    path: "lectura",
    loadChildren: () =>
      import("./lecturas/lecturas.module").then((m) => m.LecturasModule),
      canLoad: [ValidaLoginGuard],
      data: { permission: "login" },
  },
  {
    path: "parametros",
    loadChildren: () =>
      import("./parametros/parametros.module").then((m) => m.ParametrosModule),
      canLoad: [ValidaLoginGuard],
      data: { permission: "login" },
  },
  {
    path: "reportes",
    loadChildren: () =>
      import("./reportes/reportes.module").then((m) => m.ReportesModule),
      canLoad: [ValidaLoginGuard],
      data: { permission: "login" },
  },
  // {
  //   path: "component",
  //   loadChildren: () =>
  //     import("../component/component.module").then((m) => m.ComponentsModule),
  //     canLoad: [ValidaLoginGuard],
  //     data: { permission: "login" },
  // },
  {
    path: "**",
    redirectTo: "/app/tablero",
  },
];
