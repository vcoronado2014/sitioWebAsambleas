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
        

        siguiente = function(item){
            var objeto = JSON.stringify(asistente);
            sessionStorage.setItem("ASISTENTE", objeto);
            window.location = "AsistentePasoCuatro.html";

        }
        salir = function(){
            sessionStorage.clear();
            window.location.href = "index.html";

        }
        volver = function(){
            //sessionStorage.clear();
            window.location.href = "AsistentePasoDos.html";

        }
    }
    //obtenemos los valores de session storegae
    asistente = JSON.parse(sessionStorage.getItem('ASISTENTE'));
    //console.log(asistente);

    ko.applyBindings(new PersonViewModel(asistente.Roles), elem);


});
