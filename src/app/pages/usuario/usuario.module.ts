import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsuarioComponent } from "./usuario.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Usuario",
      urls: [{ title: "Usuario", url: "/usuario" }, { title: "Usuario" }],
    },
    component: UsuarioComponent,
  },
];

@NgModule({
  declarations: [UsuarioComponent],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
})
export class UsuarioModule {}
