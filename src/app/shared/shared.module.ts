import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule, CurrencyPipe, DecimalPipe } from "@angular/common";
import { SpinnerComponent } from "./spinner.component";
import { FullComponent } from "app/layouts/full/full.component";
import { NavigationComponent } from "./header-navigation/navigation.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { ChartsModule } from "ng2-charts";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "../login/login.component";
import { NoPageFoundComponent } from "../no-page-found/no-page-found.component";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DomicilioPipe } from "../pipes/domicilio.pipe";
import { TienePermisoPipe } from "../pipes/tiene-permiso.pipe";
import { ContratosPendientesSincronizarComponent } from "../components/contratos-pendientes-sincronizar/contratos-pendientes-sincronizar.component";
import { TotalDeContratosComponent } from '../components/metricas/total-de-contratos/total-de-contratos.component'
import { PromedioDeTiempoEntreLecturasComponent } from '../components/metricas/promedio-de-tiempo-entre-lecturas/promedio-de-tiempo-entre-lecturas.component'
import { DineroRecaudadoComponent } from '../components/metricas/dinero-recaudado/dinero-recaudado.component'
import { ContratosPendientesTomarLecturaComponent } from '../components/metricas/contratos-pendientes-tomar-lectura/contratos-pendientes-tomar-lectura.component'
import { LecturasAnormalesComponent } from '../components/metricas/lecturas-anormales/lecturas-anormales.component'
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
};

@NgModule({
  declarations: [
    FullComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent,
    SpinnerComponent,
    LoginComponent,
    NoPageFoundComponent,
    DomicilioPipe,
    TienePermisoPipe,
    // DecimalPipe,
    // CurrencyPipe,

    ContratosPendientesSincronizarComponent,
    TotalDeContratosComponent,
    PromedioDeTiempoEntreLecturasComponent, 
    DineroRecaudadoComponent,
    ContratosPendientesTomarLecturaComponent,
    LecturasAnormalesComponent
  ],
  exports: [
    FullComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent,
    SpinnerComponent,
    LoginComponent,
    NoPageFoundComponent,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    DomicilioPipe,
    TienePermisoPipe,
    // DecimalPipe,
    // CurrencyPipe,
    ContratosPendientesSincronizarComponent,
    TotalDeContratosComponent,
    PromedioDeTiempoEntreLecturasComponent, 
    DineroRecaudadoComponent,
    ContratosPendientesTomarLecturaComponent,
    LecturasAnormalesComponent
  ],

  imports: [
    RouterModule,
    PerfectScrollbarModule,
    ChartsModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        {
          provide: PERFECT_SCROLLBAR_CONFIG,
          useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
        },
        DomicilioPipe,
        TienePermisoPipe,
        DecimalPipe,
        CurrencyPipe,
      ],
    };
  }
}
