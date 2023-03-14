
import { Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import { Subscription } from 'rxjs';
import JSONContractToken from '../WorkerRewardToken.json';
import { LibreriaService } from '../libreria.service';
import { EventomenuService } from '../eventomenu.service';


@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit, OnDestroy {
  provider:any;
  chainID:any;
  GoerliChainId:any='0x5';
  BesuChainId:any='0x6c1';  // en decimal es: 1729 esta configurado en el genesis.json de la red besu
  wallet:any = {
    address: '',
    balance:''
  }
  
  contractAddress:any="0xF660C5481724123983f01EA3C0EdA64e807ec195";
  contractToken:any="0xf8A39a85141c80dAbd32CFF822e7Edbf0ABfb4d8";
  contractERC20:any;
  contractWorkers:any;

  menuNav:boolean=false;

  subscription: Subscription;

  constructor(private libreria:LibreriaService, private cd: ChangeDetectorRef,private eventoservicio: EventomenuService) {

    this.subscription = this.eventoservicio.onEvent().subscribe((event) => {
      if (event.parametro=="lista") 
      this.menuNav=true;
      else
       {
      this.menuNav=false;
      this.cd.detectChanges();
       }
    });


    sessionStorage.setItem('address', '');  //variable global de sesion para mantener wallet
    sessionStorage.setItem('chainid', this.BesuChainId);  
    sessionStorage.setItem('tipocuenta', '0'); 
    localStorage.setItem('contratoWorkers', this.contractAddress);  
    localStorage.setItem('contratoToken', this.contractToken);  
     
     this.contractERC20 = new this.libreria.web3.eth.Contract(JSONContractToken.abi, this.contractToken);
  }

  ngOnInit(): void {
    this.provider=this.libreria.window.ethereum; // METAMASK
    this.chainID=sessionStorage.getItem("chainid");

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goMenu() {
    this.libreria.router.navigate(['/home']);
  }

  goInicio() {
    sessionStorage.setItem('tipomenu','');
    let url=this.libreria.router.url;
    if (url=="/home")
    window.location.reload();
    else
    this.libreria.router.navigate(['/home']);
   
  }

  async loginMetamask() {
    if (!this.provider) {
     alert("Metamask no está instalado");
    }
    try {
      const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
      this.compruebaRed();
      this.wallet.address=accounts[0];
      localStorage.setItem('address', this.wallet.address);
      this.getBalanceToken(this.wallet.address);
    } catch (error:any) {
      if (error.code === 4001) {
      alert("Acceso a Metamask Cancelado");
      }
    }
  }

  async getBalanceToken(address:string) {
    this.wallet.address = address;
    var balance=0;
    let check=0;
    balance= await this.contractERC20.methods.balanceOf(address).call().catch(()=>{
      alert("No ha podido conectarse al Smart Contract del Token");
      check=1;
    });
    if (check==1)
    return;

    this.wallet.balance=balance/1000000000000000000;  // podría usar un metodo de conversion ( como con weis de ether) pero para agilizar 
                                                      // simplemente lo divido entre 18 ceros, para pasar de la unidad minima de decimal a total
  }

  async compruebaRed(){

    const chainId = await this.provider.request({ method: 'eth_chainId' });
   
    if(chainId !== this.chainID){
     alert("no estas en la red Besu");
     }

  }

  desconectar() {
   
    this.wallet.address='';
    localStorage.setItem('address', '');
    this.libreria.router.navigate(['/home']);
  }


}
