import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ParametrosComponent } from "./parametros.component";
import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  {
    path: "",
    component: ParametrosComponent,
  },
];

@NgModule({
  declarations: [ParametrosComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class ParametrosModule {}
