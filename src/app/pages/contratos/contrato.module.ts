import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ContratosComponent } from "./contratos.component";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Contrato",
      urls: [{ title: "Contrato", url: "/contrato" }, { title: "Contrato" }],
    },
    component: ContratosComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  declarations: [ContratosComponent],
})
export class ContratoModule {}
