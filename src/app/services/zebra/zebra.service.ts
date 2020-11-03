import { Injectable } from "@angular/core";
import { NotificacionesService } from "../notificaciones.service";
import { UsuarioService } from "../usuario.service";

declare const BrowserPrint: any;

@Injectable({
  providedIn: "root",
})
export class ZebraService {
  constructor(
    private notiService: NotificacionesService,
    private usuarioService: UsuarioService
  ) {}
  selected_device: any;
  devices: any[] = [];

  opciones: string[] = [];
  titulo = "[ IMPRESION ]";

  setup() {
    //Get the default device from the application as a first step. Discovery takes longer to complete.
    BrowserPrint.getDefaultDevice(
      "printer",
      (device: any) => {
        //Add device to list of devices and to html select element
        this.selected_device = device;
        this.devices.push(device);
        this.opciones.push(device.name);

        //Discover any other devices available to the application
        BrowserPrint.getLocalDevices(
          (device_list: any[]) => {
            for (var i = 0; i < device_list.length; i++) {
              //Add device to list of devices and to html select element
              var device = device_list[i];
              if (
                !this.selected_device ||
                device.uid != this.selected_device.uid
              ) {
                this.devices.push(device);
                this.opciones.push(device.name);
              }
            }
          },
          () => {
            console.log("Error getting local devices");
            this.notiService.toast.error(
              "Error obteniendo los dispositivos locales",
              this.titulo
            );
          },
          "printer"
        );
      },
      (error: any) => {
        this.notiService.toast.error(
          error.concat(" Puede ser un error conexión?"),
          this.titulo
        );
        console.log("error", error);
      }
    );
  }

  getConfig() {
    BrowserPrint.getApplicationConfiguration(
      function (config: any) {
        alert(JSON.stringify(config));
      },
      function (error: any) {
        alert(JSON.stringify(new BrowserPrint.ApplicationConfiguration()));
      }
    );
  }

  writeToSelectedPrinter(dataToWrite: string) {
    let dispositivo = this.usuarioService.obtenerUsuario().dispositivo;
    let uid = this.selected_device?.uid;

    // if (uid !== dispositivo) {
    //   this.notiService.toast.error(
    //     this.titulo.concat(" Imposible imprimir"),
    //     "No se reconoce el dispositivo. Reportalo al administrador".concat(
    //       ` [${uid}]`
    //     )
    //   );
    // } else {
      this.selected_device.send(dataToWrite, undefined, this.errorCallback);
    // }
  }

  readCallback = (readData: string) => {
    if (readData === undefined || readData === null || readData === "") {
      this.notiService.toast.error(
        "No hay respuesta del dispositivo",
        this.titulo
      );
    } else {
      alert(readData);
    }
  };
  errorCallback = (errorMessage: string) => {
    this.notiService.toast.error(errorMessage, this.titulo);
    console.error(errorMessage);
  };
  readFromSelectedPrinter() {
    this.selected_device.read(this.readCallback, this.errorCallback);
  }
  getDeviceCallback(deviceList: any[]) {
    alert("Devices: \n" + JSON.stringify(deviceList, null, 4));
  }

  sendImage(imageUrl: string) {
    let url = window.location.href.substring(
      0,
      window.location.href.lastIndexOf("/")
    );
    url = url + "/" + imageUrl;
    this.selected_device.convertAndSendFile(url, undefined, this.errorCallback);
  }

  sendFile(fileUrl: string) {
    let url = window.location.href.substring(
      0,
      window.location.href.lastIndexOf("/")
    );
    url = url + "/" + fileUrl;
    this.selected_device.sendFile(url, undefined, this.errorCallback);
  }
  onDeviceSelected(selected: any) {
    for (var i = 0; i < this.devices.length; ++i) {
      if (selected.value == this.devices[i].uid) {
        this.selected_device = this.devices[i];
        return;
      }
    }
  }
}
