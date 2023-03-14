pragma solidity ^0.8.17; // SPDX-License-Identifier: MIT

contract workers {
   
address public administrador;
uint256 idTarea=0;
uint256 idRecompensa=0;
uint256 idTareaEmp=0;

struct Empleado {
        string idemp;
        address wallet;
        bool activo;
        string tipoemp;
    }


struct WalletEmpleado {
        string idemp;
        bool activo;
        string tipoemp;
    }

struct _tareas {
        uint idt;
        string descripcion;
        uint recompensa;
        uint fechaini;
        uint fechafin;
        bool activo;
    }

struct _tareasEmp {
        uint id;
        uint idt;
        string idemp;
        bool completado;
        bool pagado;
    }

struct _recompensas{
    uint idr;
    string descripcion;
    uint importe;
}

struct _solicitud
{
    uint ids;
    uint idemp;
    uint fecha;
    string descripcion;
    bool aprobada;
}
    

Empleado[] private listaEmpleados;
mapping(address => WalletEmpleado) private empleado;
_tareas[] private Tareas;
_tareasEmp[] private TareasEmp;
_recompensas[] private Recompensas;
_solicitud[] private Solicitud;

    //  return block.timestamp / 1 days;


constructor() {
administrador=msg.sender;
}

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

   modifier onlyAdmin() {
        require(msg.sender == administrador, "solo administrador");
        _;
    }

    modifier onlyEmp() {
        require(empleado[msg.sender].activo==true, "solo empleados");
        _;
    }

    modifier onlySup() {
        require(empleado[msg.sender].activo==true, "solo emppleados");
        require(compareStrings(empleado[msg.sender].tipoemp,"supervisor"), "solo supervisores");
        _;
    }

    function logging(address _wallet) public view returns (string memory,string memory) {

        string memory tipoemp=empleado[_wallet].tipoemp;
        string memory id=empleado[_wallet].idemp;
        return (id,tipoemp);
    } 

    function loggingAdmin(address _wallet) public view returns (bool) {

    bool check=false;
    if (_wallet == administrador)
     check=true;
     return check;
       
    } 

    function addEmpleado(address _wallet,string memory _id, bool _activo,string memory _tipoemp) public onlyAdmin
    {
      listaEmpleados.push(Empleado({idemp:_id, wallet:_wallet,activo:_activo,tipoemp:_tipoemp }));
      empleado[_wallet].idemp=_id;
      empleado[_wallet].activo=_activo;
      empleado[_wallet].tipoemp=_tipoemp;
    }
    
    function addTarea(string memory _descripcion, uint _plazodias,uint _recompensa) public onlyAdmin
    {
      uint plazosegundos=_plazodias *24*60*60;

      uint  _fechaini=block.timestamp;
      uint  _fechafin=_fechaini + plazosegundos;
      bool  _activo=true;

      Tareas.push(_tareas({idt:idTarea,descripcion:_descripcion,recompensa:_recompensa,fechaini:_fechaini,fechafin:_fechafin,activo:_activo }));
      idTarea=idTarea+1;
    }

    function addRecompensa(string memory _descripcion, uint _importe) public onlyAdmin
    {
      Recompensas.push(_recompensas({idr:idRecompensa,descripcion:_descripcion,importe:_importe}));
      idRecompensa=idRecompensa+1;
    }

    function addTareaEmp(uint _idt, string memory _idemp) public onlyEmp
    {
    TareasEmp.push(_tareasEmp({id:idTareaEmp,idt:_idt,idemp:_idemp,completado:false,pagado:false}));
    idTareaEmp=idTareaEmp+1;
    }

   function validarTarea(uint _id) public onlySup
    {
    TareasEmp[_id].completado=true;
    }

   function pagar(uint _id) public onlyAdmin
    {
     require(TareasEmp[_id].completado==true, "la actividad no esta completada");
     require(TareasEmp[_id].pagado==false, "la actividad ya esta pagada");
     TareasEmp[_id].pagado=true;
    }

    function GetListaEmpleados() public view returns (Empleado[] memory) {
        return listaEmpleados;
    } 

    function GetListaTareas() public view returns (_tareas[] memory) {
        return Tareas;
    } 

    function GetListaTareasEmp() public view returns (_tareasEmp[] memory) {
        return TareasEmp;
    } 

    function GetListaRecompensas() public view returns (_recompensas[] memory) {
        return Recompensas;
    } 


}

