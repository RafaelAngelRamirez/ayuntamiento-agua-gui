import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, RouterModule, Router } from "@angular/router";
import {
  ContratoService,
  Contrato,
  Lectura,
} from "../../../services/contrato.service";
import { Location } from "@angular/common";
import { NotificacionesService } from "../../../services/notificaciones.service";
import { SimapaService } from "../../../services/simapa.service";
import { IndexedDBService } from "@codice-progressio/indexed-db";
import { GpsService } from "../../../services/gps.service";
import { UsuarioService } from "../../../services/usuario.service";
import { ParametrosService } from "../../../services/parametros.service";
import {
  IncidenciaService,
  Incidencia,
} from "../../../services/incidencia.service";
import {
  ImpedimentoService,
  Impedimento,
} from "../../../services/impedimento.service";

@Component({
  selector: "app-lectura-crear",
  templateUrl: "./lectura-crear.component.html",
  styleUrls: ["./lectura-crear.component.css"],
})
export class LecturaCrearComponent implements OnInit {
  cargandoContrato = false;
  contrato!: Contrato;
  formulario: FormGroup | null = null;

  incidencias: Incidencia[] = [];
  impedimentos: Impedimento[] = [];
  constructor(
    private idbService: IndexedDBService,
    private constratoService: ContratoService,
    private parametrosService: ParametrosService,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private incidenciaService: IncidenciaService,
    private impedimentoService: ImpedimentoService,
    private notiService: NotificacionesService,
    private router: Router,
    private gpsService: GpsService
  ) {
    this.cargaContrato();
    this.cargarIncidencias();
    this.cargarImpedimentos();
  }

  cargaContrato() {
    let error = (_: any) => {
      this.cargandoContrato = false;
      this.location.back();
    };

    this.activatedRoute.paramMap.subscribe((dato) => {
      let conPara: string = dato.get("contrato") || "";
      this.cargandoContrato = true;
      console.log(conPara)
      this.constratoService.offline.findById(conPara).subscribe((contrato) => {
        this.contrato = contrato as Contrato;
        this.cargandoContrato = false;
        this.crearFormulario(this.contrato);

        setTimeout(() => {
          console.log("entro");
          document.getElementById("lecturaActual")?.focus();
        }, 100);
      }, error);
    }, error);
  }

  cargarIncidencias() {
    this.incidenciaService.findAll().subscribe((incidencias) => {
      this.incidencias = incidencias;
    });
  }
  cargarImpedimentos() {
    this.impedimentoService.findAll().subscribe((impedimentos) => {
      this.impedimentos = impedimentos;
    });
  }

  ngOnInit(): void {}

  crearFormulario(contrato: Contrato) {
    this.formulario = new FormGroup({
      Contrato: new FormControl(),
      Vigencia: new FormControl(),
      Periodo: new FormControl(),
      IdLecturista: new FormControl(),
      IdRuta: new FormControl(),
      IdTarifa: new FormControl(),
      FechaLectura: new FormControl(),
      HoraLectura: new FormControl(),
      LecturaActual: new FormControl("", [
        // Validators.required,
        // Validators.min(contrato.LecturaAnterior),
      ]),
      IdImpedimento: new FormControl(),
      IdIncidencia: new FormControl(),
      ConsumoMts3: new FormControl(),
      Mts3Cobrados: new FormControl(),
      Observaciones: new FormControl(),
      IdDispositivo: new FormControl(),
      Estado: new FormControl(),
    });
  }

  guardandoLectura = false;
  submit(model: Lectura, invalido: boolean, e: any) {
    this.gpsService
      .findMe()
      .then((position) => {
        if (invalido) {
          e.preventDefault();
          e.stopPropagation();
          this.formulario?.markAsDirty();

          return;
        }
        //Esto es para idb, no para la api
        this.contrato.tomada = true;
        this.contrato.lectura = model;

        //Diez dias

        model.Contrato = this.contrato.Contrato;

        model.Vigencia = this.parametrosService.obtenerVigenciaActual();
        model.Periodo = this.parametrosService.obtenerPeriodoActual();

        //Traer desde el usuario
        model.IdLecturista = this.usuarioService.obtenerUsuario().lecturista.IdLecturista;
        model.IdRuta = this.contrato.IdRuta;
        model.IdTarifa = this.contrato.IdTarifa;

        model.FechaLectura = new Date();
        model.HoraLectura = new Date();
        model.ConsumoMts3 = model.LecturaActual - this.contrato.LecturaAnterior;

        model.Mts3Cobrados =
          model.LecturaActual - this.contrato.LecturaAnterior;

        model.IdDispositivo = this.usuarioService.obtenerUsuario().dispositivo;
        // GPS
        model.longitud = position.coords.longitude;
        model.latitud = position.coords.latitude;

        //Primero guardamos en local para que no haya problemas si nos falla
        // la conexion

        this.guardandoLectura = true;
        this.constratoService.offline.update(this.contrato).subscribe(
          () => {
            //  Remplazamos los datos guardados en memoria.

            let index = this.constratoService.contratos.findIndex(
              (x) => x.Contrato === this.contrato.Contrato
            );
            this.constratoService.contratos[index] = this.contrato;

            //Despues verificamos si hay conexion

            if (this.constratoService.estaOnline) {
              // Si hay conexion sincronizamos de una vez
              this.constratoService
                .sincronizarContratosTomadosOffline()
                .subscribe(
                  (cantidad) => {
                    this.notiService.toast.correcto(
                      `Se sincronizaron ${cantidad} ${
                        cantidad > 1 ? "contratos" : "contrato"
                      }`
                    );

                    this.router.navigate([
                      "/app/lectura/imprime",
                      this.contrato.Contrato,
                    ]);
                  },
                  (_) => {
                    this.guardandoLectura = false;
                  }
                );
            } else {
              // Si no hay conexion continuamos.
              this.notiService.toast.info("Lectura en espera de conexion");
              this.router.navigate([
                "/app/lectura/imprime",
                this.contrato.Contrato,
              ]);
            }
          },
          () => (this.guardandoLectura = false)
        );
      })
      .catch(this.gpsService.errorFATAL);
  }
}
