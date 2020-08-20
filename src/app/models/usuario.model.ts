export class Usuario {
  constructor(
    public nombre: string,
    public usuario: string,
    public permissions: string[],
    public dispositivo: string,
    public navegacionDefault: string = "tablero"
  ) {}
}
