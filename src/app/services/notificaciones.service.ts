import { Injectable } from "@angular/core";
import { SweetAlert2LoaderService } from "@sweetalert2/ngx-sweetalert2";
import { ToastrService } from "ngx-toastr";

import Swal, { SweetAlertOptions } from "sweetalert2/dist/sweetalert2.js";

@Injectable({
  providedIn: "root",
})
export class NotificacionesService {
  public toast: Toast = new Toast(this.t);
  public sweet: Sweet = new Sweet();

  constructor(private t: ToastrService) {}

  error(estatus: string, razon: string, err: any) {
    this.toast.error(`${estatus}: ${razon} => ${err}`);
  }
}

class Toast {
  configuraciones = {
    timeOut: 5000,
    progressBar: true,
  };

  constructor(private toast: ToastrService) {}

  error(msj: string, titulo = "") {
    let configuraciones = JSON.parse(JSON.stringify(this.configuraciones));
    configuraciones.timeOut = 10000;
    this.toast.error(msj, titulo, configuraciones);
  }
  warning(msj: string) {
    this.toast.warning(msj, undefined, this.configuraciones);
  }

  correcto(msj: string) {
    this.toast.success(msj, undefined, this.configuraciones);
  }

  info(msj: string) {
    this.toast.info(msj, undefined, this.configuraciones);
  }
}

class Sweet {
  constructor() {}

  alerta(
    text: string,
    titulo: string = "¡Bien!",
    icono:
      | "success"
      | "error"
      | "warning"
      | "info"
      | "question"
      | undefined = "success"
  ) {
    Swal.fire(titulo, text, icono);
  }

  confirmacion(
    text: string,
    title = "¿Estas seguro que quieres hacer esto?",
    cbCorrecto: Function,
    cbIncorrecto: Function,
    opciones: SweetAlertOptions = {
      title,
      html: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }
  ) {
    Swal.fire(opciones).then((result) => {
      if (result.value) {
        cbCorrecto();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        cbIncorrecto();
      }
    });
  }
}
