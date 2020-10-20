import { Component, OnInit } from "@angular/core";
import { Usuario, Lecturista } from "../../../models/usuario.model";
import { UsuarioService } from "../../../services/usuario.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { NotificacionesService } from "../../../services/notificaciones.service";
import { ParametrosService } from "../../../services/parametros.service";

@Component({
  selector: "app-usuario-crear-modificar",
  templateUrl: "./usuario-crear-modificar.component.html",
  styleUrls: ["./usuario-crear-modificar.component.css"],
})
export class UsuarioCrearModificarComponent implements OnInit {
  constructor(
    private usuarioSerivce: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private notiService: NotificacionesService,
    private parametrosService: ParametrosService
  ) {}

  usuario!: Usuario;
  cargando = false;
  permisos: any;
  cargandoPermisos = false;
  usuariosSimapa: Lecturista[] = [];

  ngOnInit(): void {
    this.obtenerUsuario();
    this.obtenerPermisos();
    this.obtenerUsuariosSimapa();
  }

  obtenerUsuariosSimapa() {
    this.parametrosService.obtenerUsuariosSimapa().subscribe((lecturistas) => {
      this.usuariosSimapa = lecturistas;
    });
  }

  obtenerPermisos() {
    this.cargandoPermisos = true;
    this.parametrosService.obtenerPermisos().subscribe(
      (permisos) => {
        this.permisos = permisos;
        delete this.permisos.super_admin;
        this.cargandoPermisos = false;
      },
      (_) => (this.cargandoPermisos = false)
    );
  }

  obtenerUsuario() {
    this.activatedRoute.paramMap.subscribe((params) => {
      let id = params.get("id");

      if (!id) {
        this.usuario = new Usuario();
      } else {
        this.usuarioSerivce.findById(id).subscribe(
          (usuario) => {
            this.usuario = usuario;
          },
          () => {
            this.notiService.toast.error(
              "Hubo un problema buscando el usuario"
            );
            this.location.back();
          }
        );
      }
    });
  }

  modificar() {
    this.cargando = true;
    this.usuarioSerivce.update(this.usuario).subscribe(
      (usuario) => {
        this.notiService.toast.correcto(
          "Se modifico el usuario de manera correcta"
        );

        this.usuario = usuario;

        this.cargando = false;
      },
      () => {
        this.cargando = false;
      }
    );
  }

  guardar() {
    this.cargando = true;
    this.usuarioSerivce.save(this.usuario).subscribe(
      (usuario) => {
        this.notiService.toast.correcto(
          "Se guardo el nuevo usuario de manera correcta"
        );
        this.usuario = usuario;
        this.cargando = false;
      },
      () => (this.cargando = false)
    );
  }

  modificandoPermisos = false;

  agregarOQuitarPermiso(permiso: string, event: any) {
    this.modificandoPermisos = true;
    let esSeleccion = event.target.checked;

    if (esSeleccion) {
      this.usuario.permissions.push(permiso);
    } else {
      this.usuario.permissions = this.usuario.permissions.filter(
        (x) => x !== permiso
      );
    }

    this.usuario.permissions = Array.from(new Set(this.usuario.permissions));

    this.usuarioSerivce.updatePermisos(this.usuario).subscribe(
      (usuario) => {
        this.notiService.toast.correcto(
          `Se ${esSeleccion ? "agrego" : "quito"} el permiso ${permiso}`
        );

        this.usuario = usuario;
        this.modificandoPermisos = false;
      },
      (_) => (this.modificandoPermisos = false)
    );
  }

  comprobarPermisos(permiso: string) {
    return this.usuario?.permissions.includes(permiso);
  }

  modificarPassword() {
    if (!this.usuario.password) {
      this.notiService.toast.error("Debes definir un password");
      return;
    }

    if (!this.usuario._id) return;
    this.cargando = true;
    this.usuarioSerivce
      .updatePassword(this.usuario._id, this.usuario.password)
      .subscribe(
        (usuario) => {
          this.notiService.toast.correcto("Se modifico el password");
          this.usuario = usuario;
          this.cargando = false;
        },
        (_) => (this.cargando = false)
      );
  }

  modificarDispositivo() {
    if (!this.usuario.dispositivo) {
      this.notiService.toast.error("Debes definir un dispositivo");
      return;
    }

    if (!this.usuario._id) return;

    this.cargando = true;
    this.usuarioSerivce
      .updateImpresora(this.usuario._id, this.usuario.dispositivo)
      .subscribe(
        (usuario) => {
          this.notiService.toast.correcto("Se modifico el dispositivo");
          this.usuario = usuario;

          this.cargando = false;
        },
        (_) => (this.cargando = false)
      );
  }

  guardarLecturista() {
    if (!this.usuario._id) return;
    if (!this.usuario.lecturista) return;

    this.cargando = true;
    this.usuarioSerivce
      .guardarLecturistaEnUsuario(
        this.usuario._id,
        this.usuario.lecturista.IdLecturista
      )
      .subscribe(
        (usuario) => {
          this.obtenerUsuario();
          this.notiService.toast.correcto("Se asigno el lecturista");
          this.cargando = false;
        },

        (_) => (this.cargando = false)
      );
  }


  rutaLecturista = "/app/lectura"
  rutaTablero = "/app/tablero"






}
