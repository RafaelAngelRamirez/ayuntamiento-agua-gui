export class Usuario {
  constructor(
    public _id?: string,
    public nombre?: string,
    public usuario?: string,
    public password?: string,
    public permissions: string[] = [],
    public dispositivo?: string,
    public lecturista?: Lecturista
  ) {}
}

export interface Lecturista {
  _id: string;
  IdLecturista: string;
  NombreLecturista: string;
  parametros: ParametrosSIMAPA;
}

export interface ParametrosSIMAPA {
  drenaje: Drenaje[];
  parametrosLecturistaSimapa: ParametrosLecturistaSimapa[];
  infrastructura: Infrastructura[];
  aguasResiduales: AguasResiduales[];
  tarifas: Tarifas[];
  rutas: Rutas[];
}

export interface Drenaje {
  Vigencia: number;
  Porcentaje: number;
}
export interface ParametrosLecturistaSimapa {
  IdLecturista: string;
  NombreLecturista: string;
  ContraseñaLecturista: string;
  PorcentajePromedio: number;
  CantidadLecturasPromedio: number;
  IdDispositivo: string;
  UrlWebService: string;
}
export interface Infrastructura {
  Vigencia: string;
  Porcentaje: number;
}
export interface AguasResiduales {
  Vigencia: string;
  Porcentaje: number;
}
export interface Tarifas {
  Vigencia: string;
  IdTarifa: string;
  ConsumoMinimo: number;
  ConsmuoMaximo: number;
  CuotaMinima: number;
  CostoMt3Excedente: number;
}
export interface Rutas {
  IdRuta: string;
  NombreRuta: string;
  VigenciaRuta: number;
  PeriodoRuta: string;
}
