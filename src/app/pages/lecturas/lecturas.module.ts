import { CommonModule } from "@angular/common";
import { LecturasComponent } from "./lecturas.component";
import { RouterModule, Routes } from "@angular/router";
import { LecturaCrearComponent } from "./lectura-crear/lectura-crear.component";
import { NgModule } from "@angular/core";
import { TicketComponent } from "./ticket/ticket.component";
import { SharedModule } from '../../shared/shared.module'

const routes: Routes = [
  {
    path: "",
    data: {
      title: "",
      urls: [{ title: "Lectura", url: "/lectura" }, { title: "Lectura" }],
    },
    component: LecturasComponent,
  },
  {
    path: "captura/:contrato",
    component: LecturaCrearComponent,
  },
  {
    path: "imprime/:contrato",
    component: TicketComponent,
  },
  {
    path: "**",
    redirectTo: "",
  },
];

@NgModule({
  declarations: [LecturasComponent, LecturaCrearComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
})
export class LecturasModule {
  constructor() {}
}
