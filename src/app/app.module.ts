import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { Approutes } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { CommonModule } from "@angular/common";
import { HttpConfigInterceptor } from "./interceptors/http-config.interceptor";
import { ToastrModule } from "ngx-toastr";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";

import { IndexedDBModule } from "@codice-progressio/indexed-db";
import { EstatusConexionModule } from "@codice-progressio/estatus-conexion";

@NgModule({
  declarations: [AppComponent],
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
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
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
