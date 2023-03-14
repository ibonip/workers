import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaformComponent } from './listaform/listaform.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {path:'',redirectTo:'/home',pathMatch:'full'},
  {path:'listaform/:opcion',component:ListaformComponent},
  {path:'home',component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
