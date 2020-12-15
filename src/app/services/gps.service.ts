import { Injectable } from "@angular/core";
import { NotificacionesService } from "./notificaciones.service";

@Injectable({
  providedIn: "root",
})
export class GpsService {
  /**
   *Callback que genera una url compatible con google maps para abrir
   la ubicacion que se le pase como parametro
   *
   * @memberof GpsService
   */
  maps = (latitude: number, longitude: number) => {
    return `https://www.google.com.mx/maps/dir//${latitude},${longitude}/@${latitude},${longitude},18z`;
  };

  /**
   *Estructura para usar en caso de que se haya desactivado el gps
   Usar siempre que se obtenga la ubicacion. 
   *
   * @memberof GpsService
   */
  errorFATAL = (err: errorFATAL) => {
    console.log("ERROR GPS: ", err)
    let error = err.err as PositionError;
    if (error?.PERMISSION_DENIED === 1)
      this.notiService.toast.error(
        "Es necesario que des permisos de ubicacion para que la aplicacion funcione correctamente. "
      );

  };

  constructor(private notiService: NotificacionesService) {
    if (this.geolocationExist()) {
      this.findMe()
        .then(() => {
          this.notiService.toast.correcto("GPS habilitado");
        })
        .catch(this.errorFATAL);
    } else {
      this.notiService.toast.error(
        "La funcionalidad de la aplicación estará limitada mientras no se habilite el GPS"
      );
    }
  }

  /**
   *Retorna la posicion actual sin hacer ningunga combprobacion sobre el estado del gps. Usuar el catch de esta promesa con `this.errorFATALgps`
   *
   * @returns {Promise<Position>}
   * @memberof GpsService
   */
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

  /**
   *Retorna una url valida
   *
   * @param {number} latitude
   * @param {number} longitud
   * @returns
   * @memberof GpsService
   */
  openGoogleMaps(latitude: number, longitud: number) {
    return this.maps(latitude, longitud);
  }

  private geolocationExist(): boolean {
    return !!navigator.geolocation;
  }
}

export interface errorFATAL {
  msj: string;
  err: PositionError;
}
