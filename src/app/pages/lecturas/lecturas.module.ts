import { CommonModule } from "@angular/common";
import { LecturasComponent } from "./lecturas.component";
import { RouterModule, Routes } from "@angular/router";
import { LecturaCrearComponent } from "./lectura-crear/lectura-crear.component";
import { ReactiveErrorHandlerModule } from "@codice-progressio/reactive-error-handler";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser'

const routes: Routes = [
  {
    path: "",
    data: {
      title: "",
      urls: [{ title: "Lectura", url: "/lectura" }, { title: "Lectura" }],
    },
    component: LecturasComponent,
  },
  {
    path: "captura/:contrato",
    // data: {
    //   title: "",
    //   urls: [
    //     { title: "Lectura", url: "/lectura/captura/:id" },
    //     { title: "Lectura" },
    //   ],
    // },
    component: LecturaCrearComponent,
  },
  {
    path: "**",
    redirectTo: "",
  },
];

@NgModule({
  declarations: [LecturasComponent, LecturaCrearComponent],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    // ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class LecturasModule {
  constructor() {
    console.log("si")
  }
}
