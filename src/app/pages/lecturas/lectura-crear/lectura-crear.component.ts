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
  Lecturista,
  Infrastructura,
  Tarifas,
} from "../../../models/usuario.model";
import {
  IncidenciaService,
  Incidencia,
} from "../../../services/incidencia.service";
import {
  ImpedimentoService,
  Impedimento,
} from "../../../services/impedimento.service";
import { forkJoin } from "rxjs";

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
      console.log(conPara);
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
    this.incidenciaService.offline.findAll().subscribe((incidencias) => {
      this.incidencias = incidencias;
    });
  }
  cargarImpedimentos() {
    this.impedimentoService.offline.findAll().subscribe((impedimentos) => {
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
        Validators.required,
        Validators.min(0),
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
    let parametrosGenerales: Lecturista;

    this.parametrosService.offline
      .obtenerParametrosGenerales()
      .toPromise()
      .then((para) => {
        parametrosGenerales = para.lecturista as Lecturista;

        return this.gpsService.findMe();
      })
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

        model.Vigencia =
          parametrosGenerales.parametros.rutas[0].VigenciaRuta + "";
        model.Periodo = parametrosGenerales.parametros.rutas[0].PeriodoRuta;

        let usuario = this.usuarioService.obtenerUsuario();

        if (!usuario.lecturista) {
          this.notiService.toast.error("No se pudo encontrar al lecturista");
          return;
        }
        //Traer desde el usuario
        model.IdLecturista = usuario.lecturista.IdLecturista;
        model.IdRuta = this.contrato.IdRuta;
        model.IdTarifa = this.contrato.IdTarifa;

        model.FechaLectura = new Date();
        model.HoraLectura = new Date();

        model.IdDispositivo =
          parametrosGenerales.parametros.parametros[0].IdLecturista;
        // GPS
        model.longitud = position.coords.longitude;
        model.latitud = position.coords.latitude;

        model.ConsumoMts3 = model.LecturaActual - this.contrato.LecturaAnterior;

        model.Mts3Cobrados =
          model.LecturaActual - this.contrato.LecturaAnterior;

        model.importe = this.calcularImporte(
          model,
          this.contrato,
          parametrosGenerales
        );

        console.log("importe: ", model.importe);

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

                    // Sincronizar los contratos generados por otro
                    // lecturista.
                    this.constratoService
                      .sincronizarContratosTomadosPorOtroLecturista()
                      .subscribe((contratos) => {
                        let subs = contratos.map((x) =>
                          this.constratoService.offline.update(x)
                        );

                        forkJoin(subs).subscribe((r) => {
                          console.log(
                            "[WORKER] Sincronizados " +
                              "" +
                              (contratos.length - 1)
                          );

                          this.constratoService
                            .confirmarNotificacion(contratos.map((x) => x._id))
                            .subscribe(() => {
                              console.log("Notificado");
                            });
                        });
                      });
                    // ----------------------------------------
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
  calcularImporte(
    model: Lectura,
    contrato: Contrato,
    parametrosGenerales: Lecturista
  ): number {
    let parametros = parametrosGenerales.parametros;

    //Obtenemos las tarifas(Parece que hay un problema con el nombre del tipo de tarifa y tiene un espacio al final. Usamos trim para evitar purrunes. )
    let tarifas = parametros.tarifas.filter((x) => {
      return x.IdTarifa.trim() === contrato.IdTarifa.trim();
    });

    console.log(`tarifas`, tarifas);
    // El consumo que viene de la diferencia de la lectura anterior y la lectura actual.
    let consumoActual = model.ConsumoMts3;

    console.log(`consumoActual`, consumoActual);

    let servicios = [];
    // Obtenemos aguasResiduales
    let aguasResiduales = parametros.aguasResiduales[0]
      ? parametros.aguasResiduales[0].Porcentaje
      : null;
    //Obtenemos drenaje
    let drenaje = parametros.drenaje[0]
      ? parametros.drenaje[0].Porcentaje
      : null;
    // Obtenemos infrastructura
    let infrastructura = parametros.infrastructura[0]
      ? parametros.infrastructura[0].Porcentaje
      : null;

    console.log(`aguasResiduales`, aguasResiduales);
    console.log(`drenaje`, drenaje);
    console.log(`infrastructura`, infrastructura);

    // //Recorremos las tarifas
    let importeTotal = 0;

    let desgloses: {
      tarifa: Tarifas;
      min: number;
      max: number;
      consumoActualMt3: number;
      costoM3: number;
      cuotaMinima: number;
      importeRango: number;

      metrosCalculados: number;
    }[] = [];

    for (const t of tarifas) {
      //Si no esta igual comprobamos hasta donde haq que cobrar

      let desglose = {
        importeRango: 0,
        metrosCalculados: 0,
        tarifa: t,
        min: t.ConsumoMinimo,
        max: t.ConsmuoMaximo,
        consumoActualMt3: consumoActual,
        costoM3: t.CostoMt3Excedente,
        cuotaMinima: t.CuotaMinima,
      };
      let subImporte = 0;
      if (consumoActual >= t.ConsmuoMaximo) {
        //El costo del rango
        desglose.metrosCalculados = t.ConsmuoMaximo - t.ConsumoMinimo + 1;

        subImporte =
          desglose.metrosCalculados * t.CostoMt3Excedente + t.CuotaMinima;
      } else {
        if (consumoActual >= t.ConsumoMinimo) {
          //AQUI LA HAN CAGAO con el -1
          desglose.metrosCalculados = consumoActual - t.ConsumoMinimo;
          subImporte =
            desglose.metrosCalculados * t.CostoMt3Excedente + t.CuotaMinima;
        }
      }
      //Sumamos al importe global.
      importeTotal += subImporte;

      //Registramos el importe del rango en el desglose.
      desglose.importeRango = subImporte;
      desgloses.push(desglose);
    }
    console.log("desglose", desgloses);

    // Sumamos los porcentajes de servicios

    let importeAguasResiduales = aguasResiduales
      ? importeTotal * (aguasResiduales / 100)
      : 0;

    console.log(`importeAguasResiduales`, importeAguasResiduales);

    let importeInfrastructura = infrastructura
      ? importeTotal * (infrastructura / 100)
      : 0;

    console.log(`importeInfrastructura`, importeInfrastructura);

    let importeDrenaje = drenaje ? importeTotal * (drenaje / 100) : 0;

    console.log(`importeDrenaje`, importeDrenaje);

    return (
      importeTotal +
      importeDrenaje +
      importeInfrastructura +
      importeAguasResiduales
    );
  }
}
