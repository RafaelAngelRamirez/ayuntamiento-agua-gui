import { Component, OnInit } from "@angular/core";
import { ContratoService, Contrato } from "../../services/contrato.service";

@Component({
  selector: "app-contratos",
  templateUrl: "./contratos.component.html",
  styleUrls: ["./contratos.component.css"],
})
export class ContratosComponent implements OnInit {
  constructor(private contratoService: ContratoService) {}

  cargando: any = {};
  contratos: Contrato[] = [];

  ngOnInit(): void {
    this.cargando["contrato"] = "Cargando contratos";

    this.contratoService.findAll().subscribe(
      (contratos) => {
        delete this.cargando["contrato"];
        this.contratos = contratos;
      },
      (_) => delete this.cargando["contrato"]
    );
  }

  alerta() {
    alert("No permitido en este demo");
  }
}
