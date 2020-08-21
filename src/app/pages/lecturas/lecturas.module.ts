import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LecturasComponent } from "./lecturas.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Lectura",
      urls: [{ title: "Lectura", url: "/lectura" }, { title: "Lectura" }],
    },
    component: LecturasComponent,
  },
];

@NgModule({
  declarations: [LecturasComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class LecturasModule {}
