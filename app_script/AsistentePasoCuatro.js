$(document).ready(function () {
    exp: var elem = document.getElementById('principal');
    //objeto a guardar
    exp: var asistente = {
        Institucion: {
            Nombre: '',
            RegId: 0,
            PaiId: 0,
            ComId: 0,
            Telefono: '',
            CorreoElectronico: '',
            RazonSocial: '',
            Rut: '',
            Direccion: '',
            ToId: 0,
        },
        ConfiguracionInstitucion: {
            EnviaDocumentos: 0,
            EnviaRendiciones: 0,
            EnviaProyectos: 0,
            EnviaCorreoEventos: 0,
            Eliminado: 0,
            MuestraSlide: 0
        },
        mailing: {
            CreaUsuario: 0,
            ModificaUsuario: 0,
            EliminaUsuario: 0,
            CreaInstitucion: 0,
            ModificaInstitucion: 0,
            EliminaInstitucion: 0,
            CreaDocumento: 0,
            EliminaDocumento: 0,
            CreaCalendario: 0,
            ModificaCalendario: 0,
            EliminaCalendario: 0,
            CreaTricel: 0,
            ModificaTricel: 0,
            EliminaTricel: 0,
            CreaProyecto: 0,
            ModificaProyecto: 0,
            EliminaProyecto: 0,
            CreaRendicion: 0,
            ModificaRendicion: 0,
            EliminaRendicion: 0,
            CreaRol: 0,
            ModificaRol: 0,
            EliminaRol: 0,
            CreaMuro: 0,
            ModificaMuro: 0,
            EliminaMuro: 0
        },
        AutentificacionUsuario: {
            NombreUsuario: '',
            Password: '',
            CorreoElectronico: ''
        },
        Persona: {
            Rut: '',
            Nombres: '',
            ApellidoPaterno: '',
            ApellidoMaterno: '',
            PaiId: 0,
            RegId: 0,
            ComId: 0,
            DireccionCompleta: '',
            Telefonos: ''
        },
        Roles: [
            {
                //rol por defecto
                Nombre: 'Administrador',
                Descripcion: 'Administrador del Sistema'
            },
            {
                //rol por defecto
                Nombre: 'Presidente',
                Descripcion: 'Presidente de la Institución'
            },
            {
                //rol por defecto
                Nombre: 'Secretario',
                Descripcion: 'Secretario de la Institución'
            },
            {
                //rol por defecto
                Nombre: 'Tesorero',
                Descripcion: 'Tesorero de la Institución'
            },
            {
                //rol por defecto
                Nombre: 'Asistente',
                Descripcion: 'Usuario Normal'
            }
        ]
    };

    function PersonViewModel(data){
        var self = this;
        //del formulario
        console.log(data);

        self.rolesInstitucion = ko.observableArray(data);

        self.frmChkCreaUsuario = ko.observable(false);
        self.frmChkModificaUsuario = ko.observable(false);
        self.frmChkEliminaUsuario = ko.observable(false);

        self.frmChkCreaRol = ko.observable(false);
        self.frmChkModificaRol = ko.observable(false);
        self.frmChkEliminaRol = ko.observable(false);

        self.frmChkCreaDocumento = ko.observable(true);
        self.frmChkEliminaDocumento = ko.observable(true);

        self.frmChkCreaRendicion = ko.observable(true);
        self.frmChkModificaRendicion = ko.observable(true);
        self.frmChkEliminaRendicion = ko.observable(true);

        self.frmChkCreaCalendario = ko.observable(true);
        self.frmChkModificaCalendario = ko.observable(true);
        self.frmChkEliminaCalendario = ko.observable(true);

        self.frmChkCreaProyecto = ko.observable(true);
        self.frmChkModificaProyecto = ko.observable(true);
        self.frmChkEliminaProyecto = ko.observable(true);

        self.frmChkCreaTricel = ko.observable(false);
        self.frmChkModificaTricel = ko.observable(false);
        self.frmChkEliminaTricel = ko.observable(false);

        self.frmChkCreaMuro = ko.observable(true);
        self.frmChkModificaMuro = ko.observable(true);
        self.frmChkEliminaMuro = ko.observable(true);
        

        siguiente = function(item){
            self.frmChkCreaUsuario() ? asistente.mailing.CreaUsuario = 1 : asistente.mailing.CreaUsuario = 0;
            self.frmChkModificaUsuario() ? asistente.mailing.ModificaUsuario = 1 : asistente.mailing.ModificaUsuario = 0;
            self.frmChkEliminaUsuario() ? asistente.mailing.EliminaUsuario = 1 : asistente.mailing.EliminaUsuario = 0;

            self.frmChkCreaRol() ? asistente.mailing.CreaRol = 1 : asistente.mailing.CreaRol = 0;
            self.frmChkModificaRol() ? asistente.mailing.ModificaRol = 1 : asistente.mailing.ModificaRol = 0;
            self.frmChkEliminaRol() ? asistente.mailing.EliminaRol = 1 : asistente.mailing.EliminaRol = 0;

            self.frmChkCreaDocumento() ? asistente.mailing.CreaDocumento = 1 : asistente.mailing.CreaDocumento = 0;
            self.frmChkEliminaDocumento() ? asistente.mailing.EliminaDocumento = 1 : asistente.mailing.EliminaDocumento = 0;

            self.frmChkCreaRendicion() ? asistente.mailing.CreaRendicion = 1 : asistente.mailing.CreaRendicion = 0;
            self.frmChkModificaRendicion() ? asistente.mailing.ModificaRendicion = 1 : asistente.mailing.ModificaRendicion = 0;
            self.frmChkEliminaRendicion() ? asistente.mailing.EliminaRendicion = 1 : asistente.mailing.EliminaRendicion = 0;

            self.frmChkCreaCalendario() ? asistente.mailing.CreaCalendario = 1 : asistente.mailing.CreaCalendario = 0;
            self.frmChkModificaCalendario() ? asistente.mailing.ModificaCalendario = 1 : asistente.mailing.ModificaCalendario = 0;
            self.frmChkEliminaCalendario() ? asistente.mailing.EliminaCalendario = 1 : asistente.mailing.EliminaCalendario = 0;

            self.frmChkCreaProyecto() ? asistente.mailing.CreaProyecto = 1 : asistente.mailing.CreaProyecto = 0;
            self.frmChkModificaProyecto() ? asistente.mailing.ModificaProyecto = 1 : asistente.mailing.ModificaProyecto = 0;
            self.frmChkEliminaProyecto() ? asistente.mailing.EliminaProyecto = 1 : asistente.mailing.EliminaProyecto = 0;

            self.frmChkCreaTricel() ? asistente.mailing.CreaTricel = 1 : asistente.mailing.CreaTricel = 0;
            self.frmChkModificaTricel() ? asistente.mailing.ModificaTricel = 1 : asistente.mailing.ModificaTricel = 0;
            self.frmChkEliminaTricel() ? asistente.mailing.EliminaTricel = 1 : asistente.mailing.EliminaTricel = 0;

            self.frmChkCreaMuro() ? asistente.mailing.CreaMuro = 1 : asistente.mailing.CreaMuro = 0;
            self.frmChkModificaMuro() ? asistente.mailing.ModificaMuro = 1 : asistente.mailing.ModificaMuro = 0;
            self.frmChkEliminaMuro() ? asistente.mailing.EliminaMuro = 1 : asistente.mailing.EliminaMuro = 0;


            var objeto = JSON.stringify(asistente);
            sessionStorage.setItem("ASISTENTE", objeto);

            window.location = "AsistentePasoCinco.html";

        }
        salir = function(){
            sessionStorage.clear();
            window.location.href = "index.html";

        }
        volver = function(){
            //sessionStorage.clear();
            window.location.href = "AsistentePasoTres.html";

        }
        updateElement = function(event, name){
            console.log(event);
        }
    }
    //obtenemos los valores de session storegae
    asistente = JSON.parse(sessionStorage.getItem('ASISTENTE'));
    //console.log(asistente);

    ko.applyBindings(new PersonViewModel(asistente.Roles), elem);


});
function updateElement(event, name){
    console.log(event);
    
}