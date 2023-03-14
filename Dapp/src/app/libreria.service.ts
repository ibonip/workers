import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
//@Injectable({
//  providedIn: 'root'
//}) // si lo dejas vacio es lo mismo que poner 'root'

// web3 librerias
import Web3 from 'web3';

@Injectable()
export class LibreriaService {
web3:any;
window:any;
providerInfura:string="https://goerli.infura.io/v3/cdb31d0cd0aa40d894216d4e272f6bb4";
providerBesu:string="http://192.168.0.15:8545";
  constructor(public router: Router,@Inject(DOCUMENT) private document: Document) {

    this.window = document.defaultView;
    this.web3 = new Web3;
    this.web3.setProvider(
      new this.web3.providers.HttpProvider(this.providerBesu));
      
   }
}
