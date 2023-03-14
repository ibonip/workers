import { Component, OnInit, ElementRef,ViewChild,Renderer2} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LibreriaService } from '../libreria.service';
import JSONContract from '../workers.json';
import JSONContractToken from '../WorkerRewardToken.json';
import { ActivatedRoute, Params } from '@angular/router';
import { EventomenuService } from '../eventomenu.service';
import { BigNumber } from 'bignumber.js';
import { AnimationKeyframesSequenceMetadata } from '@angular/animations';


@Component({
  selector: 'app-listaform',
  templateUrl: './listaform.component.html',
  styleUrls: ['./listaform.component.scss']
})
export class ListaformComponent implements OnInit {

  myForm = new FormGroup({
    idemp: new FormControl(''),
    wallet: new FormControl(''),
    activo: new FormControl(''),
    tipoemp:new FormControl('')
  });

  myFormT = new FormGroup({
    descripcion: new FormControl(''),
    plazo: new FormControl(''),
    recompensa: new FormControl(''),
  });

  myFormR = new FormGroup({
    descripcion: new FormControl(''),
    importe: new FormControl('')
  });

  ArrayListaEmp = [];
  ArrayListaTareas = [];
  ArrayListaTareasEmp = [];
  ArrayListaRecompensas = [];

  tipoemp = ['empleado', 'supervisor'];
  selectedtipoemp: string = '';
  empactivo: boolean = false;
  botonesemp:boolean=false;

  Listaempvisible:boolean=false;
  ListaTareasvisible:boolean=false;
  ListaRecompensasvisible:boolean=false;

  FormIntroduce:boolean=true;
  botonvalidar:boolean=false;
  botonpagar:boolean=false;

  tipolista:any;
  
  address:any=localStorage.getItem("address");
  contractWorkerslocalstorage:any=localStorage.getItem("contratoWorkers");
  contractTOKENlocalstorage:any=localStorage.getItem("contratoToken");
  contractWorkers = new this.libreria.web3.eth.Contract(JSONContract.abi, this.contractWorkerslocalstorage);
  contractWorkersTOKEN = new this.libreria.web3.eth.Contract(JSONContractToken.abi, this.contractTOKENlocalstorage);
  chainId:any=sessionStorage.getItem("chainid");
  idemp:any=sessionStorage.getItem("idemp");
 
  constructor(private eventBusService: EventomenuService,private libreria:LibreriaService,private renderer2: Renderer2,private route: ActivatedRoute) {
  
   }
  
  ngOnInit(): void {


    const parametro="lista";
    this.eventBusService.emitEvent({parametro});  // asi el menu sabe que debe mostrar navegador.

    this.route.paramMap.subscribe((params: Params) => {
      this.tipolista= params['get']('opcion');
    });

    let tipomenu=sessionStorage.getItem('tipomenu');
    
    if (tipomenu!="admin")
      this.FormIntroduce=false;

    if (tipomenu=="empleado")
       this.botonesemp=true;  

    if (tipomenu=="supervisor")
    this.botonvalidar=true;

    if (tipomenu=="admin")
    this.botonpagar=true;

    if (this.tipolista=="opemp") {
      this.pintaEmpleados(); // pintamos empleados
      this.Listaempvisible=true;
      }

      if (this.tipolista=="optar") {
        this.pintaTareas(); // pintamos tareas
        this.pintaTareasEmp(); // pintamos tareas emp
        this.ListaTareasvisible=true;
     }

     if (this.tipolista=="oprec") {
      this.pintaRecompensas(); // pintamos recompensas
      this.ListaRecompensasvisible=true;
   }

  
  }

  async onSubmitEmp(myForm:any) {

    let idemp=myForm.idemp;
    let wallet=myForm.wallet;
    let activo=myForm.activo;
    let tipoemp=myForm.tipoemp;
     
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
     // gasPrice: this.web3.utils.toHex(10000000000000), // customizable by user during MetaMask confirmation.
     // gas: this.web3.utils.toHex(1000000), // customizable by user during MetaMask confirmation. GAS LIMIT
      to: this.contractWorkerslocalstorage, // Required except during contract publications.
      from: this.address, // must match user's active address.
      value: '0', // Only required to send ether from exteral. Si no tiene requisito payable se deja a cero.
      data:this.contractWorkers.methods.addEmpleado(wallet,idemp,activo,tipoemp).encodeABI(),
      chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };

    let provider=this.libreria.window.ethereum; // METAMASK

   const txHash = await provider.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
     }).then(() => {
      alert("MetaMask está procesando la solicitud");
    }).catch((err:any)=>{
        if (err.code == 4001)
        alert("La transacción ha sido cancelada");
     })

  }


  async onSubmitTarea(myFormT:any) {

    let descripcion=myFormT.descripcion;
    let plazo=myFormT.plazo;
    let recompensa=myFormT.recompensa;
  
    const transactionParameters = {
      nonce: '0x00', 
      to: this.contractWorkerslocalstorage, 
      from: this.address, 
      value: '0', 
      data:this.contractWorkers.methods.addTarea(descripcion,plazo,recompensa).encodeABI(),
      chainId: this.chainId, 
    };

    let provider=this.libreria.window.ethereum; // METAMASK

   const txHash = await provider.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
     }).then(() => {
      alert("MetaMask está procesando la solicitud");
    }).catch((err:any)=>{
        if (err.code == 4001)
        alert("La transacción ha sido cancelada");
     })

  }


  async onSubmitRecompensa(myFormR:any) {

    let descripcion=myFormR.descripcion;
    let importe=myFormR.importe;
  
    const transactionParameters = {
      nonce: '0x00', 
      to: this.contractWorkerslocalstorage, 
      from: this.address, 
      value: '0', 
      data:this.contractWorkers.methods.addRecompensa(descripcion,importe).encodeABI(),
      chainId: this.chainId, 
    };

    let provider=this.libreria.window.ethereum; // METAMASK

   const txHash = await provider.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
     }).then(() => {
      alert("MetaMask está procesando la solicitud");
    }).catch((err:any)=>{
        if (err.code == 4001)
        alert("La transacción ha sido cancelada");
     })

  }


  async clickunirse(idt:any) {

    const transactionParameters = {
      nonce: '0x00', 
      to: this.contractWorkerslocalstorage, 
      from: this.address, 
      value: '0', 
      data:this.contractWorkers.methods.addTareaEmp(idt,this.idemp).encodeABI(),
      chainId: this.chainId, 
    };

    let provider=this.libreria.window.ethereum; // METAMASK

    

   const txHash = await provider.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
     }).then(() => {
      alert("MetaMask está procesando la solicitud");
    }).catch((err:any)=>{
        if (err.code == 4001)
        alert("La transacción ha sido cancelada");
     })

  }


  async clickValidar(id:any) {

    const transactionParameters = {
      nonce: '0x00', 
      to: this.contractWorkerslocalstorage, 
      from: this.address, 
      value: '0', 
      data:this.contractWorkers.methods.validarTarea(id).encodeABI(),
      chainId: this.chainId, 
    };

    let provider=this.libreria.window.ethereum; // METAMASK

  
   const txHash = await provider.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
     }).then(() => {
      alert("MetaMask está procesando la solicitud");
    }).catch((err:any)=>{
        if (err.code == 4001)
        alert("La transacción ha sido cancelada");
     })

  }

  async WalletEmpleado(idemp:any) :Promise<string>
  {
    let wallet="";
     await this.pintaEmpleados();

     for (let p=0;p<this.ArrayListaEmp.length;p+=1)
      {
          if (this.ArrayListaEmp[p][0]==idemp)
          wallet=this.ArrayListaEmp[p][1];
      }

    return wallet;

  }

  async pagar(id:any,idemp:any,cantidadTokens:number) {

    let wallet=await this.WalletEmpleado(idemp); // hacemos que primero rellene el array de empleados para buscar su cuenta.

    const cantidadTokensEnWei = new BigNumber(cantidadTokens).times(new BigNumber(10).pow(18));

     const transactionParameters = {
      nonce: '0x00', 
      to: this.contractTOKENlocalstorage, 
      from: this.address, 
      value: '0', 
      data:this.contractWorkersTOKEN.methods.transfer(wallet,cantidadTokensEnWei).encodeABI(),
      chainId: this.chainId, 
    };

    let provider=this.libreria.window.ethereum; // METAMASK

    const txHash = await provider
        .request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        })
        .then((result: any) => {
          alert('Transacción enviada');
          // Espera a que se confirme la transacción
          return provider.request({
            method: 'eth_getTransactionReceipt',
            params: [result],
          });
        })
        .then((receipt:any) => {
          alert('Transacción confirmada');
          this.apuntarpago(id);
        })
        .catch((error:any) => {
          alert('La transacción ha fallado');
        });
  
}

  async clickPagar(id:any,idemp:any,cantidadTokens:number){
    await this.pagar(id,idemp,cantidadTokens);  // TRANSFERIMOS TOKENS WRC
  }

  async apuntarpago(id:any){

     const transactionParameters = {
      nonce: '0x00', 
      to: this.contractWorkerslocalstorage, 
      from: this.address, 
      value: '0', 
      data:this.contractWorkers.methods.pagar(id).encodeABI(),
      chainId: this.chainId, 
    };

    let provider=this.libreria.window.ethereum; // METAMASK

  
   const txHash = await provider.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
     }).then(() => {
      alert("MetaMask está procesando la solicitud");
    }).catch((err:any)=>{
        if (err.code == 4001)
        alert("La transacción ha sido cancelada");
     })
  }


  async pintaEmpleados(){
  let check=0;
  this.ArrayListaEmp= await this.contractWorkers.methods.GetListaEmpleados().call().catch(()=>{
    alert("No ha podido conectarse al Smart Contract");
    check=1;
  });
  if (check==1)
  return;
  }


  async pintaTareas(){
    let check=0;
    this.ArrayListaTareas= await this.contractWorkers.methods.GetListaTareas().call().catch(()=>{
      alert("No ha podido conectarse al Smart Contract");
      check=1;
    });
    if (check==1)
    return;
    }

    async pintaTareasEmp(){
      let check=0;
      this.ArrayListaTareasEmp= await this.contractWorkers.methods.GetListaTareasEmp().call().catch(()=>{
        alert("No ha podido conectarse al Smart Contract");
        check=1;
      });
      if (check==1)
      return; 
      }
  

  async pintaRecompensas(){
    let check=0;
     this.ArrayListaRecompensas= await this.contractWorkers.methods.GetListaRecompensas().call().catch(()=>{
        alert("No ha podido conectarse al Smart Contract");
        check=1;
    });
    if (check==1)
      return;
      }


   timeConverter(UNIX_timestamp:any){
      var a = new Date(UNIX_timestamp * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
      return time;
    }


}



/*


   function pagar(uint _id) public onlyAdmin
    {
     require(TareasEmp[_id].completado==true, "la actividad no esta completada");
     require(TareasEmp[_id].pagado==false, "la actividad ya esta pagada");
     TareasEmp[_id].pagado=true;
 
    }

    */