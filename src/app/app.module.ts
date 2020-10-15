import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { CommonModule } from "@angular/common";
import { HttpConfigInterceptor } from "./interceptors/http-config.interceptor";
import { ToastrModule } from "ngx-toastr";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";

import { IndexedDBModule } from "@codice-progressio/indexed-db";
import { EstatusConexionModule } from "@codice-progressio/estatus-conexion";
import { TicketComponent } from "./pages/lecturas/ticket/ticket.component";
import { PrintLayoutComponent } from "./print/print-layout/print-layout.component";
import { QRCodeModule } from "angularx-qrcode";
import { EstaLogueadoGuard } from "./guards/esta-logueado.guard";
import { ValidaLoginGuard } from "./guards/valida-login.guard";
import { FullComponent } from "./layouts/full/full.component";
import { LoginComponent } from "./login/login.component";
import { TicketImprimirComponent } from "./print/ticket-imprimir/ticket-imprimir.component";
import { CiudadanosComponent } from "./ciudadanos/ciudadanos.component";

export const Approutes: Routes = [
  //Imprecion
  {
    path: "ticket",
    canActivate: [ValidaLoginGuard],
    component: TicketImprimirComponent,
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [EstaLogueadoGuard],
  },
  {
    path: "app",
    component: FullComponent,
    canActivate: [ValidaLoginGuard],
    data: { permission: "login" },
    loadChildren: () =>
      import("./pages/pages.module").then((m) => m.PagesModule),
  },

  {
    // redirijos a tablero siempre y en el activate revisamos si esta logueado.
    path: "",
    redirectTo: "/app/tablero",
    pathMatch: "full",
  },
  {
    path: "ciudadanos",
    component: CiudadanosComponent,
    loadChildren: () =>
      import("./ciudadanos/ciudadanos.module").then((m) => m.CiudadanosModule),
  },
];
@NgModule({
  declarations: [
    AppComponent,
    TicketComponent,
    PrintLayoutComponent,
    TicketImprimirComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // required animations module
    HttpClientModule,
    RouterModule.forRoot(Approutes),
    FormsModule,
    ToastrModule.forRoot(), // ToastrModule added
    SharedModule.forRoot(),
    IndexedDBModule,
    EstatusConexionModule,
    QRCodeModule,
    SharedModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
