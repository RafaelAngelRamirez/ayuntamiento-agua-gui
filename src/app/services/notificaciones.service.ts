import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ToastService } from "../component/toast/toast.service";

@Injectable({
  providedIn: "root",
})
export class NotificacionesService {
  public toast: Toast = new Toast(this.t);
  constructor(private t: ToastrService) {}

  error(estatus: string, razon: string) {
    console.log("estatus", estatus, "razon", razon);
    this.t.error(razon, estatus);
  }
}

class Toast {
  constructor(private toast: ToastrService) {}

  error(msj: string) {
    this.toast.error(msj);
  }

  correcto(msj: string) {
    this.toast.success(msj);
  }

  info(msj: string) {
    this.toast.info(msj);
  }
}
