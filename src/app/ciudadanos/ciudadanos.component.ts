import { Component, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-ciudadanos",
  templateUrl: "./ciudadanos.component.html",
  styleUrls: [
    "./ciudadanos.component.css",
    "../../assets/ciudadano/css/cover.css",
  ],
  // encapsulation: ViewEncapsulation.None,
})
export class CiudadanosComponent implements OnInit {
  constructor(public renderer: Renderer2) {}

  ngOnInit(): void {
    let body = document.body;
    let html = document.documentElement;
    this.renderer.setStyle(html, "height", "100%");
    this.renderer.setStyle(html, "background-color", "#00046e");
    this.renderer.setStyle(body, "height", "100%");
    this.renderer.setStyle(body, "background-color", "#00046e");

    // this.renderer.setStyle(body, "display", "-ms-flexbox");
    // this.renderer.setStyle(body, "display", "flex");
    this.renderer.setStyle(body, "color", "#fff");
    this.renderer.setStyle(
      body,
      "text-shadow",
      "0 0.05rem 0.1rem rgba(0, 0, 0, 0.5)"
    );
    this.renderer.setStyle(
      body,
      "box-shadow",
      "inset 0 0 5rem rgba(0, 0, 0, 0.5)"
    );
  }
}
