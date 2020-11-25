import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ContratosComponent } from "./contratos.component";
import { SharedModule } from "../../shared/shared.module";
import { ContratosOnlineComponent } from "./contratos-online/contratos-online.component";
import { ContratoDetalleComponent } from "./contrato-detalle/contrato-detalle.component";
import { LecturaDetalleComponent } from "./lectura-detalle/lectura-detalle.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Contrato",
      urls: [{ title: "Contrato", url: "/contrato" }, { title: "Contrato" }],
    },
    component: ContratosComponent,
  },
  {
    path: ":id",
    data: {
      title: "Detalle contrato",
    },
    component: ContratoDetalleComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  declarations: [
    ContratosComponent,
    ContratosOnlineComponent,
    ContratoDetalleComponent,
    LecturaDetalleComponent,
  ],
})
export class ContratoModule {}
