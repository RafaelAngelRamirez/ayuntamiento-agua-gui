import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class NotificacionesService {
  public toast: Toast = new Toast();
  constructor() {}

  error(estatus: string, razon: string) {
    console.log("estatus", estatus, "razon", razon);
  }
}

class Toast {
  error(msj: string) {
    alert(msj);
  }

  correcto(msj: string) {
    alert(msj);
  }

  info(msj: string) {
    alert(msj);
  }
}
