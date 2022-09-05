import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PedidoLoQueSeaComponent } from './components/pedido-lo-que-sea/pedido-lo-que-sea.component';

@NgModule({
  declarations: [
    AppComponent,
    PedidoLoQueSeaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
