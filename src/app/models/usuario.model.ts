export class Usuario {
  constructor(
    public _id: string = '',
    public nombre?: string,
    public usuario?: string,
    public password?: string,
    public permissions: string[] = [],
    public dispositivo?: string,
    public lecturista?: Lecturista,
    public navegacionDefault: string = "tablero",

    //Si es un iphone tenemos que usar mobi print 
    // que es de paga. Utiliza una url con base64
    // arrowhead://x-callback-url/zplcode?code=<ZPL_CODE>
    public esIphone:boolean = false
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
  parametros: ParametrosLecturistaSimapa[];
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
  VigenciaRuta: string;
  PeriodoRuta: string;
}
