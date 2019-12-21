$(document).ready(function () {
    //exp: var elem = document.getElementById('principal');
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
        ],
        Invitados: []
    };

    //exp: var invitados = [];

    function PersonViewModel(data, invitados){
        var self = this;
        self.frmCorreoElectronico = ko.observable('');
        //del formulario
        console.log(data);

        self.rolesInstitucion = ko.observableArray(data);
        self.invitadosInstitucion =  ko.observableArray(invitados);
        

        siguiente = function(item){

            swal({
                title: "Condiciones",
                text: "Declaro estar de acuerdo con las condiciones del Servicio.",
                type: "success",
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Estoy de Acuerdo",
                cancelButtonText: "NO estoy de acuerdo",
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    //swal("Deleted!", "Your imaginary file has been deleted.", "success");
                    var objeto = JSON.parse(sessionStorage.getItem('ASISTENTE'));
                    objeto.Invitados = asistente.Invitados;
                    //sessionStorage.setItem("ASISTENTE", objeto);
                    var jsonObj = objeto;
                    var myData = {
                        Institucion: jsonObj.Institucion,
                        AutentificacionUsuario: jsonObj.AutentificacionUsuario,
                        ConfiguracionInstitucion: jsonObj.ConfiguracionInstitucion,
                        Mailing: jsonObj.mailing,
                        Persona: jsonObj.Persona,
                        Roles: jsonObj.Roles,
                        Invitados: jsonObj.Invitados
                      };
                    //aca procedemos a guardar
                    $.ajax({
                        url: ObtenerUrl('SuscripcionDos'),
                        type: "POST",
                        data: ko.toJSON({ data: myData }),
                        contentType: "application/json",
                        dataType: "json",
                        success: function (data) {
                            // ok
                            //evaluar respuesta
                            var datos = data;
                            if (datos.Institucion && datos.Institucion.Id > 0){
                                getNotify('success', 'Suscrito', 'Se ha suscrito con éxito a asambleas.');
                              }
                              else {
                                getNotify('error', 'Error', 'Ocurrió un error al tratar de suscribirse, contacte al Administrador');
                              }
                              //redireccionamos al indice
                              sessionStorage.clear();
                              window.location.href = "index.html";
            
                        },
                        error: function (error) {
                            if (error.status.toString() == "500") {
                                getNotify('error', 'Error', 'Error de Servidor!');
                            }
                            else {
                                getNotify('error', 'Error', 'Error de Servidor!');
                            }
                        }
                    });

                } else {
                    //swal("Cancelled", "Your imaginary file is safe :)", "error");
                }
            });
        }
        salir = function(){
            sessionStorage.clear();
            window.location.href = "index.html";

        }
        volver = function(){
            //sessionStorage.clear();
            window.location.href = "AsistentePasoCuatro.html";

        }
        agregar = function(){
            
            var correo = $('#txtCorreo').val();
            var idRol = $('#selectIdTo').val();
            var nombreRol = entregaRol();
            var indice = 1;
            if (asistente.Invitados.length > 0){
                indice = asistente.Invitados.length +1;
            }

            var invi = {
                Correo: correo,
                Rol: nombreRol,
                Indice: indice
            }
            
            //self.invitadosInstitucion.push(invi);
            //no insertamos a la lista hasta estar seguros
            if (validar(invi)){
                asistente.Invitados.push(invi);
                insertarLista(invi);
                //limpiamos los elementos
                $('#txtCorreo').val('');
                $('#selectIdTo')[0].options[0].selected = true;
            }

        }
    }

    //obtenemos los valores de session storegae
    //asistente = JSON.parse(sessionStorage.getItem('ASISTENTE'));
    //console.log(asistente);
    //obtenemos los valores de session storegae
/*     if (sessionStorage.getItem('ASISTENTE')) {
        asistente = JSON.parse(sessionStorage.getItem('ASISTENTE'));
    } */

    var elem = document.getElementById('principal')
    ko.applyBindings(new PersonViewModel(asistente.Roles, asistente.Invitados), elem);

    function insertarLista(invi) {
        //antes de insertar en la lista se deben validar los vacios, email correcto, si ya existe el mismo mail
        var elem1 = document.getElementById('listaInvitados')
        //borramos todos los elementos
        elem1.innerHTML = '';
        if (asistente.Invitados && asistente.Invitados.length > 0) {
            var title = document.createElement('h5');
            elem1.appendChild(title);
            title.innerHTML += 'Invitados Agregados';
            asistente.Invitados.forEach(invitado => {
                var span = '<span style="cursor: pointer; font-size: 20px; color: red;" class="glyphicon glyphicon-trash" aria-hidden="true" onclick="eliminar(' +
                    "'" + invitado.Correo + "'" +
                    ')"></span>';
                var ul = document.createElement('ul');
                elem1.appendChild(ul);
                ul.innerHTML += span + '&nbsp;&nbsp;<strong>' + invitado.Correo.toUpperCase() + '</strong>, ' + invitado.Rol;
            });

        }
    }

    function validarEmail(email) {
        var retorno = true;
        expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!expr.test(email)) {
            getNotify('error', 'Email', "La dirección de correo " + email + " es incorrecta.")
            //alert("Error: La dirección de correo " + email + " es incorrecta.");
            retorno = false;
        }
        return retorno;
    }
    eliminar = function(correo){
        //console.log('eliminar' + indice);
        //primero buscamos el elemento de la lista
        if (asistente.Invitados && asistente.Invitados.length >= 0){
            var nueva = [];
            asistente.Invitados.forEach(invitado => {
                if (invitado.Correo.toUpperCase() != correo.toUpperCase()){
                    nueva.push(invitado);
                }
            });
            if (nueva.length >= 0){
                asistente.Invitados = [];
                asistente.Invitados = nueva;
                //ahora recorremos la lista y volvemos a generar los elementos
                if (asistente.Invitados.length > 0){
                    asistente.Invitados.forEach(invi => {
                        insertarLista(invi);
                    });
                }
                else {
                    //borrar todo
                    var elem1 = document.getElementById('listaInvitados')
                    //borramos todos los elementos
                    elem1.innerHTML = '';
                }

            }
        }

    }
    function existeElemento(correo){
        var retorno = false;
        if (asistente.Invitados && asistente.Invitados.length > 0){
            asistente.Invitados.forEach(invitado => {
                if (invitado.Correo.toUpperCase() == correo.toUpperCase()){
                    retorno = true;
                }
            });
        }
        return retorno;
    }
    function validar(invitado){
        retorno = true;

        if (asistente.Invitados.length > 20){
            getNotify('error', 'Requerido', 'No puede agregar más de 20 invitados.');
            retorno = false;
        }
        //validar si ya existe el correo en la lista
        if (existeElemento(invitado.Correo)){
            getNotify('error', 'Requerido', 'Correo ya fue agregado, agregue otro invitado.');
            retorno = false;
        }
        if (invitado.Correo === '' || invitado.Correo === null) {
            getNotify('error', 'Requerido', 'Correo Requerido.');
            retorno = false;
        }

        if (validarEmail(invitado.Correo) == false) {
            retorno = false;

        }
        return retorno;
    }
    function entregaRol(){
        var cmbRol = $('#selectIdTo')[0];
        var retorno = 'Administrador';
        if (cmbRol){
            for (var i=0; i < cmbRol.children.length; i++){
                if (cmbRol.children[i].selected){
                    retorno = cmbRol.children[i].text;
                }
            }
        }
        return retorno;
    }

});