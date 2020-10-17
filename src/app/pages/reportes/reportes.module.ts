import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReportesDashboardComponent } from "./reportes-dashboard/reportes-dashboard.component";
import { Routes, RouterModule } from "@angular/router";

export const Reportesroutes: Routes = [
  {
    path: "",
    component: ReportesDashboardComponent,
  },
];

@NgModule({
  declarations: [ReportesDashboardComponent],
  imports: [CommonModule, RouterModule.forChild(Reportesroutes)],
})
export class ReportesModule {}
