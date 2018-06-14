import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirstExcerciseComponent } from './first-excercise/first-excercise.component';
import { ThirdExcerciseComponent } from './third-excercise/third-excercise.component';
import { FourthExcerciseComponent } from './fourth-excercise/fourth-excercise.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'first'},
  {path: 'first', component: FirstExcerciseComponent},
  {path: 'third', component: ThirdExcerciseComponent},
  {path: 'fourth', component: FourthExcerciseComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export const routingComponents = [FirstExcerciseComponent,ThirdExcerciseComponent,FourthExcerciseComponent];