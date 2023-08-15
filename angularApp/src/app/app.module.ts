import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './shared/components/header/header.component';

import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { PanelModule } from 'primeng/panel';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PanelModule,
    BrowserAnimationsModule,
    ToastModule,
    ConfirmPopupModule,
    FormsModule,
    HttpClientModule
   
    
  ],
  providers: [ConfirmationService , MessageService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
