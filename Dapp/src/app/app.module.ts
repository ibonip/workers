import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { ListaformComponent } from './listaform/listaform.component';
import { MasterComponent } from './master/master.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LibreriaService } from './libreria.service';


@NgModule({
  declarations: [
    HomeComponent,
    ListaformComponent,
    MasterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[],
  providers: [LibreriaService],
  bootstrap: [MasterComponent]
})
export class AppModule { }
