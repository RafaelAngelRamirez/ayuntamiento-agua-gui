import { Injectable } from "@angular/core";
import { NotificacionesService } from "./notificaciones.service";

@Injectable({
  providedIn: "root",
})
export class GpsService {
  maps = (latitude: number, longitude: number) => {
    return `https://www.google.com.mx/maps/dir//${latitude},${longitude}/@${latitude},${longitude},18z`;
  };

  constructor(private notiService: NotificacionesService) {
    if (this.geolocationExist()) {
      this.findMe()
        .then(() => {
          this.notiService.toast.correcto("GPS habilitado");
        })
        .catch((err) => {
          let error = err.err as PositionError;
          if (error.PERMISSION_DENIED)
            this.notiService.toast.error(
              "Es necesario que des permisos de ubicacion para que la aplicacion funcione correctamente. "
            );
        });
    } else {
      this.notiService.toast.error(
        "La funcionalidad de la aplicación estará limitada mientras no se habilite el GPS"
      );
    }
  }

  thisGPSOn() {}

  findMe(): Promise<Position> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => resolve(position),
        (err) => {
          console.error(err);
          let msj = "Hubo un error obteniendo la ubicacion: " + err.message;
          this.notiService.toast.error(msj, "ERROR GPS");
          return reject({ msj, err });
        }
      );
    });
  }

  openGoogleMaps(latitude: number, longitud: number) {
    return this.maps(latitude, longitud);
  }

  private geolocationExist(): boolean {
    return !!navigator.geolocation;
  }
}
