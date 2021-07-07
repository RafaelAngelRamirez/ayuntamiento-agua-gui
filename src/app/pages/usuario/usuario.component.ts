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

  cargando = false
  usuarios: Usuario[] = [];

  ngOnInit(): void {
    this.cargando = true
    this.usuarioSerivice.findAll().subscribe(
      (u) => {
        this.usuarios = u;
        this.cargando = false
      },
      (_) => this.cargando = false
    );
  }
}
