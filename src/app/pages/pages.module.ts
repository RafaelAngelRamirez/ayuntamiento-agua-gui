import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { Pagesroutes } from "./pages-routing.module";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [],
  imports: [SharedModule.forRoot(), RouterModule.forChild(Pagesroutes)],
})
export class PagesModule {}
