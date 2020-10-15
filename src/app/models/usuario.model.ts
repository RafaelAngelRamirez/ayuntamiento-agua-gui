export class Usuario {
  constructor(
    public _id: string,
    public nombre: string,
    public usuario: string,
    public permissions: string[],
    public dispositivo: string,
    public navegacionDefault: string = "tablero",
    public lecturista: Lecturista
  ) {}
}

export interface Lecturista {
  _id: string;
  IdLecturista: string;
  NombreLecturista: string;
  parametros: string;
}
