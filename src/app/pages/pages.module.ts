import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { Pagesroutes } from "./pages-routing.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule.forRoot(),
    RouterModule.forChild(Pagesroutes),
  ],
})
export class PagesModule {}
