import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ContratoService, Contrato } from "../../../services/contrato.service";
import { Location } from "@angular/common";
import { NotificacionesService } from "../../../services/notificaciones.service";
import { SimapaService } from "../../../services/simapa.service";
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
  contrato: Contrato | undefined;
  formulario: FormGroup | null = null;

  incidencias: Incidencia[] = [];
  impedimentos: Impedimento[] = [];
  constructor(
    private constratoService: ContratoService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private incidenciaService: IncidenciaService,
    private impedimentoService: ImpedimentoService,
    private notiService: NotificacionesService,
    private simapaService: SimapaService
  ) {
    this.detectarParametros();
    this.cargarIncidencias();
    this.cargarImpedimentos();
  }

  detectarParametros() {
    let error = (_: any) => {
      this.cargandoContrato = false;
      this.location.back();
    };

    this.activatedRoute.paramMap.subscribe((dato) => {
      let conPara: string = dato.get("contrato") || "";
      console.log(conPara);
      this.cargandoContrato = true;

      this.constratoService
        .findContrato(conPara)
        .subscribe((contrato: Contrato) => {
          this.contrato = contrato;
          this.cargandoContrato = false;
          this.crearFormulario(contrato);
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
        Validators.required,
        Validators.min(contrato.LecturaAnterior),
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
  submit(model: any, esInvalido: boolean, e: any) {
    this.notiService.toast.correcto("Guardado")
    // this.guardandoLectura = true;
    // this.simapaService.subirLectura(model).subscribe(
    //   (_) => {
    //     this.notiService.toast.correcto("Se cargo la lectura correctamente");
    //     this.location.back();
    //   },
    //   (_) => (this.guardandoLectura = false)
    // );

    this.location.back()
  }
}
