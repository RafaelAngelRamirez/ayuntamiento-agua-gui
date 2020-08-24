import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ParametrosComponent } from "./parametros.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: ParametrosComponent,
  },
];

@NgModule({
  declarations: [ParametrosComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ParametrosModule {}
