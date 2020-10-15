import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReciboComponent } from './recibo.component';
import { ReciboNoExisteComponent } from './recibo-no-existe/recibo-no-existe.component';


const routes: Routes = [
  { path: ':parametros', component: ReciboComponent },
  { path: '**', component: ReciboNoExisteComponent}
];

@NgModule({
  declarations: [ReciboComponent, ReciboNoExisteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ReciboModule { }
