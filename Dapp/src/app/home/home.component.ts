import { Component, OnInit} from '@angular/core';
import { LibreriaService } from '../libreria.service';
import JSONContract from '../workers.json';
import { EventomenuService } from '../eventomenu.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  menuAdminvisible:boolean=false;
  menuEmpvisible:boolean=false;
  menuSupvisible:boolean=false;
  menuvisible:boolean=false;

  tipomenu:any;

  constructor(private libreria:LibreriaService,private eventBusService: EventomenuService) {
   }

  ngOnInit(): void {

    const parametro="home";
    this.eventBusService.emitEvent({parametro});  // asi el menu sabe que debe mostrar navegador.

    this.tipomenu=sessionStorage.getItem('tipomenu');
    if (this.tipomenu=="admin")
    this.verMenuAdmin();
    if (this.tipomenu=="empleado")
    this.verMenuEmp();
    if (this.tipomenu=="supervisor")
    this.verMenuSup();
    if (this.tipomenu=="")
    this.verSOLOMenuLog();
  }

verSOLOMenuLog(){
    this.menuvisible=false;
}

verMenuAdmin(){
  sessionStorage.setItem('tipomenu', 'admin');
  this.menuvisible=true;
  this.menuAdminvisible=true;
}

verMenuEmp(){

  sessionStorage.setItem('tipomenu', 'empleado');
  this.menuvisible=true;
  this.menuEmpvisible=true;
}

verMenuSup(){
  sessionStorage.setItem('tipomenu', 'supervisor');
  this.menuvisible=true;
  this.menuSupvisible=true;
}


compruebaLogWallet() :Boolean
  {
   let check=true;
   let address=localStorage.getItem('address');
   if (address=="")
   {
     check=false;
     alert("no estas logeado");
   }
     return check;
  }

  goEmpleado(){
    this.compruebalog("empleado");
  }

  goSupervisor(){
    this.compruebalog("supervisor");
  }

  goAdmin(){
    this.compruebalog("admin");
  }

  //////////////////////////////////////////////// clics opciones Admin
  clickAdminEmp(){
    let check=this.compruebaLogWallet();
    if (check==true)
    {
    let parametro_opcion="opemp";
    this.libreria.router.navigate(['/listaform',parametro_opcion]);
    }
  }

  clickAdminTareas(){
    let check=this.compruebaLogWallet();
    if (check==true)
    {
    let parametro_opcion="optar";
    this.libreria.router.navigate(['/listaform',parametro_opcion]);
    }
  }

  clickTareas(){
    let check=this.compruebaLogWallet();
    if (check==true)
    {
    let parametro_opcion="optar";
    this.libreria.router.navigate(['/listaform',parametro_opcion]);
    }
  }

  clickAdminRecompensas(){
    let check=this.compruebaLogWallet();
    if (check==true)
    {
    let parametro_opcion="oprec";
    this.libreria.router.navigate(['/listaform',parametro_opcion]);
    }
  }

  clickRecompensas(){
    let check=this.compruebaLogWallet();
    if (check==true)
    {
    let parametro_opcion="oprec";
    this.libreria.router.navigate(['/listaform',parametro_opcion]);
    }
  }
//////////////////////////////////////////////////////////


  async compruebalog(tipomenu:string){
    let check;
    
    let address:any=localStorage.getItem("address");
    let contractWorkerslocalstorage:any=localStorage.getItem("contratoWorkers");
    let contractWorkers = new this.libreria.web3.eth.Contract(JSONContract.abi, contractWorkerslocalstorage);

    let checkemp = [];

    if (address!=''){
        if(tipomenu=="admin"){
    
            check= await contractWorkers.methods.loggingAdmin(address).call().catch(()=>{
              alert("No ha podido conectarse al Smart Contract");
              return;
            });
           
            if (check==true)
              this.verMenuAdmin();
            
            else
            alert("Sólo administrador");
        }
        else
        {
          checkemp = await contractWorkers.methods.logging(address).call().catch(()=>{
            alert("No ha podido conectarse al Smart Contract");
            return;
          });

          if (checkemp[0]!=null)
          {
            sessionStorage.setItem('idemp', checkemp[0]);
            sessionStorage.setItem('tipocuenta', checkemp[1]);
           
              if (tipomenu=="empleado" && checkemp[1]=="empleado")
              this.verMenuEmp();
              if (tipomenu=="supervisor" && checkemp[1]=="supervisor")
              this.verMenuSup();
          }
          else
          alert("Lo siento tu wallet no figura como empleado")
          
        }
        
      }
    else
    {
    alert("conecta primero tu Wallet");
    return;
    }

  }



}



