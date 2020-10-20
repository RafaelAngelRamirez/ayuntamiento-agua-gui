import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsuarioComponent } from "./usuario.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { UsuarioCrearModificarComponent } from "./usuario-crear-modificar/usuario-crear-modificar.component";
import { UsuarioDetalleComponent } from "./usuario-detalle/usuario-detalle.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Usuario",
      urls: [{ title: "Usuario", url: "/usuario" }, { title: "Usuario" }],
    },
    component: UsuarioComponent,
  },
  {
    path: "editar/:id",
    data: {
      title: "Crear usuario",
      urls: [
        { title: "Editar usuario", url: "/editar/:id" },
        { title: "Usuario" },
      ],
    },
    component: UsuarioCrearModificarComponent,
  },
  {
    path: "crear",
    data: {
      title: "Editar usuario",
      urls: [{ title: "Editar usuario", url: "/crear" }, { title: "Usuario" }],
    },
    component: UsuarioCrearModificarComponent,
  },
];

@NgModule({
  declarations: [
    UsuarioComponent,
    UsuarioCrearModificarComponent,
    UsuarioDetalleComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
})
export class UsuarioModule {}
