import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { FullComponent } from "./layouts/full/full.component";
import { NoPageFoundComponent } from "./no-page-found/no-page-found.component";
import { ValidaLoginGuard } from './guards/valida-login.guard';

export const Approutes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "tablero",
    component: FullComponent,
    canActivate: [ValidaLoginGuard],
    loadChildren: () =>
      import("./pages/pages.module").then((m) => m.PagesModule),
  },
  {
    // redirijos a tablero siempre y en el activate revisamos si esta logueado. 
    path: "",
    redirectTo: "/tablero",
    pathMatch: "full",
  },
];
