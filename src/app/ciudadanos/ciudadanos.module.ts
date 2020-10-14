import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { CiudadanosComponent } from "./ciudadanos.component";

const routes: Routes = [
  { path: "", component: CiudadanosComponent },
  {
    path: "recibo",
    loadChildren: () =>
      import("./recibo/recibo.module").then((m) => m.ReciboModule),
  },
];

@NgModule({
  declarations: [CiudadanosComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CiudadanosModule {}
