import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
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
import { Approutes } from "app/app-routing.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
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
      ],
    };
  }
}
