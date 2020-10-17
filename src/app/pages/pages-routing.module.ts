import { Routes } from "@angular/router";

export const Pagesroutes: Routes = [
  { path: "", redirectTo: "/tablero", pathMatch: "full" },
  {
    path: "tablero",
    loadChildren: () =>
      import("../dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "usuario",
    loadChildren: () =>
      import("./usuario/usuario.module").then((m) => m.UsuarioModule),
  },
  {
    path: "contrato",
    loadChildren: () =>
      import("./contratos/contrato.module").then((m) => m.ContratoModule),
  },
  {
    path: "lectura",
    loadChildren: () =>
      import("./lecturas/lecturas.module").then((m) => m.LecturasModule),
  },
  {
    path: "parametros",
    loadChildren: () =>
      import("./parametros/parametros.module").then((m) => m.ParametrosModule),
  },
  {
    path: "reportes",
    loadChildren: () =>
      import("./reportes/reportes.module").then((m) => m.ReportesModule),
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
