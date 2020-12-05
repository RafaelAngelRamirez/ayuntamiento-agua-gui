import { Pipe, PipeTransform } from "@angular/core";
import { UsuarioService } from "../services/usuario.service";

@Pipe({
  name: "tienePermiso",
})
export class TienePermisoPipe implements PipeTransform {
  constructor(private usuarioService: UsuarioService) {}

  /**
   *Debe tener por lo menos uno de los permisos solicitados
   *
   * @param {string[]} args
   * @returns {boolean}
   * @memberof TienePermisoPipe
   */
  transform(permiso:string, ...args: string[]): boolean {
    let usuario = this.usuarioService.obtenerUsuario();

    
    if (usuario.permissions.includes(permiso)) return true;

    for (let i = 0; i < args.length; i++) {
      const p = args[i];

      if (usuario.permissions.includes(p)) return true;
    }

    return false;
  }
}
