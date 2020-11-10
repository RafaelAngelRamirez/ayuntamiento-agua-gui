import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
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
  parametrosGenerales!: Lecturista;
  vigencia: number | undefined = undefined;
  periodo: number | undefined = undefined;

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
    this.cargarParametrosTicket();
    this.cargarVigenciaYPeriodo();
  }

  cargarVigenciaYPeriodo() {
    this.parametrosService.offline
      .obtenerVigenciaYPeriodo()
      .subscribe((datos) => {
        if (!datos?.vigPer.vigencia || !datos?.vigPer.periodo) {
          this.notiService.toast.error(
            "No has cargado los parametros de vigencia y periodos"
          );

          this.router.navigate(["app/parametros"]);
          return;
        }

        this.vigencia = datos.vigPer.vigencia;
        this.periodo = datos.vigPer.periodo;
      });
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
      if (incidencias.length === 0) {
        this.notiService.toast.error("No hay incidencias sincronizadas");
        return;
      }
      this.incidencias = incidencias;
    });
  }
  cargarImpedimentos() {
    this.impedimentoService.offline.findAll().subscribe((impedimentos) => {
      if (impedimentos.length === 0) {
        this.notiService.toast.error("No hay impedimentos sincronizadas");
        return;
      }
      this.impedimentos = impedimentos;
    });
  }

  cargarParametrosTicket() {
    this.parametrosService.offline
      .obtenerParametrosGenerales()
      .toPromise()
      .then((para) => {
        if (!para) {
          this.notiService.toast.error(
            "No se han cargado los parametros del ticket"
          );
          return;
        }
        this.parametrosGenerales = para.lecturista as Lecturista;
        console.log(`this.parametrosGenerales`, this.parametrosGenerales);
      });
  }

  ngOnInit(): void {}

  f(c: string): AbstractControl {
    return this.formulario?.get(c) as AbstractControl;
  }

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

    this.validacionesDeLectura(this.formulario);
  }

  permitirModificarImpedimento = true;
  validacionesDeLectura(formulario: FormGroup) {
    formulario.get("LecturaActual")?.valueChanges.subscribe((valor) => {
      let impedimentoControl = this.f("IdImpedimento");
      // Lectura actual menor que la lectura anterior HARCODE al id 2
      console.log(valor);
      if (!valor) {
        //Cuando es null quitamos la validacion
        impedimentoControl.setValue("");
        this.permitirModificarImpedimento = true;
        return;
      }

      let esMenor = this.contrato.LecturaAnterior > valor;
      if (esMenor) {
        this.permitirModificarImpedimento = false;
        impedimentoControl.setValue("2");
      } else {
        impedimentoControl.setValue(null);
        this.permitirModificarImpedimento = true;
      }
    });
  }

  obtenerStringImpedimento(id: string) {
    return this.impedimentos.find((x) => x.IdImpedimento === id)
      ?.NombreImpedimento;
  }

  guardandoLectura = false;
  submit(model: Lectura, invalido: boolean, e: any) {
    if (
      this.incidencias.length === 0 ||
      this.impedimentos.length === 0 ||
      !this.parametrosGenerales ||
      !this.vigencia ||
      !this.periodo
    ) {
      this.notiService.toast.error(
        "Debes sincronizar parametros de ticket, vigencia, periodo, incidencias e impedimentos para poder continuar",
        "Faltan sincronizar parametros"
      );
      return;
    }

    this.gpsService
      // Obtenemos la ubicacion actual.
      .findMe()
      .then((position) => {
        if (invalido) {
          e.preventDefault();
          e.stopPropagation();
          this.formulario?.markAsDirty();

          return;
        }
        //Esto es para idb, no para la api. En la api, cuando se guarde
        // la lectura se setean de nuevo. Esto por que se ignora alguna 
        // modificacion hecha al contrato fuera de la lectura tomada. 
        this.contrato.tomada = true;
        // Ponemos este en false para que la funcion de sincronizacion 
        // encuentre el contrato cuanto se este online
        this.contrato.sincronizada = false


        this.contrato.lectura = model;

        //Diez dias

        model.Contrato = this.contrato.Contrato;
        console.log(this.parametrosGenerales);

        model.Vigencia =
          this.parametrosGenerales.parametros.rutas[0].VigenciaRuta + "";
        model.Periodo = this.parametrosGenerales.parametros.rutas[0].PeriodoRuta;

        let usuario = this.usuarioService.obtenerUsuario();
        let idDispositivo = this.parametrosGenerales.parametros.parametros[0]
          .IdDispositivo;

        if (!usuario.lecturista) {
          this.notiService.toast.error("No se pudo encontrar al lecturista");
          return;
        }

        if (!this.parametrosGenerales.IdLecturista) {
          this.notiService.toast.error(
            "Este usuario no tiene id de lecturista. No se puede continuar. "
          );
          return;
        }

        //Traer desde el usuario
        model.idUsuario = usuario._id;
        model.IdLecturista = this.parametrosGenerales.IdLecturista;
        model.IdRuta = this.contrato.IdRuta;
        model.IdTarifa = this.contrato.IdTarifa;

        model.FechaLectura = new Date();
        model.HoraLectura = new Date();

        //Dejamos un espacio en blanco por que
        model.IdDispositivo = idDispositivo ? idDispositivo : " ";
        console.log(`idDispositivo`, idDispositivo);

        // GPS
        model.longitud = position.coords.longitude;
        model.latitud = position.coords.latitude;

        //El consumo actual
        let mt3 = model.LecturaActual - this.contrato.LecturaAnterior
        model.ConsumoMts3 = mt3;

        model.Mts3Cobrados =mt3;

        model.importe = this.calcularImporte(
          model,
          this.contrato,
          this.parametrosGenerales
        );

        console.log("importe: ", model.importe);

        let hayImpedimentos = this.hayAlgunImpedimento();
        if (hayImpedimentos) {
          this.notiService.sweet.confirmacion(
            hayImpedimentos,
            "¿La lectura es correcta?",
            () => {
              this.guardarLectura();
            },
            () => {
              this.notiService.sweet.alerta(
                "No se ha guardado la lectura",
                "SIN GUARDAR",
                "info"
              );
            }
          );
        } else {
          this.guardarLectura();
        }
      })
      .catch(this.gpsService.errorFATAL);
  }

  private hayAlgunImpedimento() {
    let problemas: string[] = [];

    //Sobre pasa el doble del promedio dado por el contrato
    let promedio = this.contrato.Promedio;
    let consumoActual = this.contrato.lectura.ConsumoMts3;
    if (promedio * 2 <= consumoActual) {
      problemas.push(
        `El consumo actual <b> ${consumoActual} </b> supera al doble del promedio <b> ${promedio}</b>`
      );
    }
    let IdIncidencia = this.contrato.lectura.IdIncidencia;
    //Tiene registrada una incidencia
    if (IdIncidencia) {
      let incidencia = this.incidencias.find(
        (x) => x.IdIncidencia === IdIncidencia
      );

      problemas.push(`<b>INCIDENCIA</b>: ${incidencia?.NombreIncidencia}`);
    }
    let IdImpedimento = this.contrato.lectura.IdImpedimento;
    //Tiene registrada una incidencia
    if (IdImpedimento) {
      let impedimento = this.impedimentos.find(
        (x) => x.IdImpedimento === IdImpedimento
      );

      problemas.push(`<b>IMPEDIMENTO</b>: ${impedimento?.NombreImpedimento}`);
    }

    if (problemas.length === 0) return null;

    let problemasMostrar = problemas.map(
      (x) => `<li class="list-group-item">${x}</li>`
    );

    //Esto es para que se imprima en el ticket de incidencias los problemas.
    // No agregamos aqui las observaciones para matenerlo separado. SE hace mas
    // adeletante, en imprimir ticket.
    this.contrato.lectura.problemas = problemas
      .map((x) => x.trim())
      .join(" || ")
      .toString()
      .replace(/\<b>/gi, "")
      .replace(/\<\/b>/gi, "");

    return `
    <ul class="list-group">
      <li class="list-group-item bg-danger text-white">Se encontraron estos problemas en el ticket.</li>
      ${problemasMostrar.join(" ")}
    </ul>

    <h3>¿Aún así quieres continuar?</h3>

    `;
  }

  private guardarLectura() {
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
          this.constratoService.sincronizarContratosTomadosOffline().subscribe(
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
              // this.sincronizarLecturasDeOtros();
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
  }

  private sincronizarLecturasDeOtros() {
    // Sincronizar los contratos generados por otro
    // lecturista.
    // this.constratoService
    //   .sincronizarContratosTomadosPorOtroLecturista()
    //   .subscribe((contratos) => {
    //     let subs = contratos.map((x) =>
    //       this.constratoService.offline.update(x)
    //     );
    //     forkJoin(subs).subscribe((r) => {
    //       console.log("[WORKER] Sincronizados " + "" + (contratos.length - 1));
    //       this.constratoService
    //         .confirmarNotificacion(contratos.map((x) => x._id))
    //         .subscribe(() => {
    //           console.log("Notificado");
    //         });
    //     });
    //   });
    // ----------------------------------------
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

    //La cantidad de periodos que se estan cobrando.
    let periodosGenerados =
      Number(contrato.lectura.Periodo) - Number(contrato.PeriodoAnterior);
    let mesesGenerados = periodosGenerados * 2;

    // El consumo que viene de la diferencia de la lectura anterior y la lectura actual.
    let consumoActualPorMes = model.ConsumoMts3 / mesesGenerados;

    console.log(`consumoActual`, consumoActualPorMes);

    // let servicios = [];
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
        // El consumo actual tiene que ser divido entre la cantidad de periodos
        // generados y el total  de periodos.
        consumoActualMt3: consumoActualPorMes,
        costoM3: t.CostoMt3Excedente,
        cuotaMinima: t.CuotaMinima,
      };
      let subImporte = 0;
      if (consumoActualPorMes >= t.ConsmuoMaximo) {
        //El costo del rango
        desglose.metrosCalculados = t.ConsmuoMaximo - t.ConsumoMinimo + 1;

        subImporte =
          desglose.metrosCalculados * t.CostoMt3Excedente + t.CuotaMinima;
      } else {
        if (consumoActualPorMes >= t.ConsumoMinimo) {
          //AQUI LA HAN CAGAO con el -1
          desglose.metrosCalculados = consumoActualPorMes - t.ConsumoMinimo;
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

    let granTotal =
      (importeTotal +
        importeDrenaje +
        importeInfrastructura +
        importeAguasResiduales) *
      2;
    return granTotal;
  }
}
