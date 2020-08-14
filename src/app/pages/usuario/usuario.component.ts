import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "../../services/usuario.service";
import { Usuario } from "../../models/usuario.model";

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
  styleUrls: ["./usuario.component.css"],
})
export class UsuarioComponent implements OnInit {
  constructor(private usuarioSerivice: UsuarioService) {}

  cargando: any = {};
  usuarios: Usuario[] = [];

  ngOnInit(): void {
    this.cargando["usuarios"] = "Obteniendo usuarios";
    this.usuarioSerivice.findAll().subscribe(
      (u) => {
        this.usuarios = u;
        
        delete this.cargando["usuarios"];
      },
      (_) => delete this.cargando["usuarios"]
    );
  }
  alerta() {
    alert("No permitido en este demo");
  }
}
