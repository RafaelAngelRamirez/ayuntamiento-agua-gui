import { Component, Input, OnInit } from "@angular/core";
import { Lectura } from "../../../services/contrato.service";

@Component({
  selector: "app-lectura-detalle",
  templateUrl: "./lectura-detalle.component.html",
  styleUrls: ["./lectura-detalle.component.css"],
})
export class LecturaDetalleComponent implements OnInit {
  @Input() lectura: Lectura | undefined;

  constructor() {}

  ngOnInit(): void {}
}
