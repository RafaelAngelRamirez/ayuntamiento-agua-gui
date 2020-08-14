import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { Pagesroutes } from "./pages-routing.module";
import { RouterModule } from "@angular/router";
import { UsuarioComponent } from './usuario/usuario.component';
import { ContratosComponent } from './contratos/contratos.component';

@NgModule({
  declarations: [UsuarioComponent, ContratosComponent],
  imports: [SharedModule.forRoot(), RouterModule.forChild(Pagesroutes)],
})
export class PagesModule {}
