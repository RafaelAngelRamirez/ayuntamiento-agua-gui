import { Pipe, PipeTransform } from "@angular/core";
import { UsuarioService } from "../services/usuario.service";

@Pipe({
  name: "tienePermiso",
})
export class TienePermisoPipe implements PipeTransform {
  constructor(private usuarioService: UsuarioService) {}

  transform(value: string): boolean {
    let usuario = this.usuarioService.obtenerUsuario();

    return usuario.permissions.includes(value);
  }
}
