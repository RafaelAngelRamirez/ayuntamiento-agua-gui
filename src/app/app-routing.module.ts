import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { FullComponent } from "./layouts/full/full.component";
import { ValidaLoginGuard } from './guards/valida-login.guard';

export const Approutes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "",
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
