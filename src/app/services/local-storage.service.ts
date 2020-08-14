import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  constructor() {}

  leer(key: string): string | null {
    return localStorage.getItem(key);
  }
  guardar(key: string, data: string) {
    localStorage.setItem(key, data);
  }
  eliminar(key: string) {
    localStorage.removeItem(key);
  }

  eliminarTodo(exepciones: string[] = []) {
    if (exepciones.length > 0) {
      exepciones.forEach((x) => this.eliminar(x));
      return;
    }

    localStorage.clear();
  }
}
