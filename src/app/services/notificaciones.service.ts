import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NavigationComponent } from "../shared/header-navigation/navigation.component";

@Injectable({
  providedIn: "root",
})
export class NotificacionesService {
  public toast: Toast = new Toast(this.t);
  constructor(private t: ToastrService) {}

  error(estatus: string, razon: string, err: any) {
    console.log("estatus", estatus, "razon", razon);
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
