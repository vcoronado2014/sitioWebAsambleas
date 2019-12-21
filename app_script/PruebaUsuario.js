/**
 * Created by vcoronado on 05-04-2017.
 */
$(document).ready(function () {
    exp: var elem = document.getElementById('principal');
    exp: var regiones = ko.observableArray([]);
    exp: var tipoOrganizacion = ko.observableArray([]);
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

    function PersonViewModel(dataR, dataCC, dataT){
        var self = this;
        //del formulario
        
        self.regionesInstitucion = ko.observableArray(dataR);
        self.tiposOrganizacion = ko.observableArray(dataT);
        self.comunas = ko.observableArray(dataCC);

        if (asistente.Institucion && asistente.Institucion.Rut.length <= 0){
            self.frmNombreInstitucion = ko.observable("");
            selectedComuna = ko.observable("");
            self.frmDireccion = ko.observable("");
            self.frmRazonSocial = ko.observable("");
    
            self.frmRut = ko.observable("");
            self.frmTelefono = ko.observable("");
            self.frmCorreoElectronico = ko.observable("");
            self.frmIdRegion = ko.observable("");
            self.frmIdComuna = ko.observable("");
            self.frmIdTo = ko.observable("");
        }
        onChangeInstitucion = function(item){
            var nombre = $('#txtNombreInstitucion').val();
            $.ajax({
                url: ObtenerUrl('Institucion'),
                type: "POST",
                data: ko.toJSON({ BuscarId: nombre, IdUsuario: '1000' }),
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    // ok
                    //evaluar respuesta
                    var datos = data;
                    var institucionesArr = datos.proposals;
                    if (institucionesArr.length > 0){
                      getNotify('error', 'Error', 'El nombre de la Institución ya existe, intente con otro');
                      $('#txtNombreInstitucion').val('');
                    }

                    
                    //ko.cleanNode(elem);
                    //ko.applyBindings(new PersonViewModel(regiones, dataCC), elem);
    
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
        }

        siguiente = function(item){
            self.frmNombreInstitucion = ko.observable($("#txtNombreInstitucion").val());
            self.frmDireccion = ko.observable($("#txtDireccion").val());
            self.frmRazonSocial = ko.observable($("#txtRazonSocial").val());
    
            self.frmRut = ko.observable($("#txtRut").val());
            self.frmTelefono = ko.observable($("#txtTelefono").val());
            self.frmCorreoElectronico = ko.observable($("#txtCorreo").val());
            self.frmIdRegion = ko.observable($("#selectIdRegion").val());
            self.frmIdComuna = ko.observable($("#selectIdComuna").val());
            self.frmIdTo = ko.observable($("#selectIdTo").val());

            if (validar(self.frmNombreInstitucion(), self.frmIdRegion(), self.frmIdComuna(), self.frmDireccion(), 
                self.frmRazonSocial(), self.frmTelefono(), self.frmCorreoElectronico(), self.frmRut(), self.frmIdTo())){

                //ahora guardamos la variable
                asistente.Institucion.Nombre = this.frmNombreInstitucion();
                asistente.Institucion.PaiId = 1;
                asistente.Institucion.RegId = this.frmIdRegion();
                asistente.Institucion.ComId = this.frmIdComuna();
                asistente.Institucion.RazonSocial = this.frmRazonSocial();
                asistente.Institucion.Rut = this.frmRut();
                asistente.Institucion.CorreoElectronico = this.frmCorreoElectronico();
                asistente.Institucion.Telefono = this.frmTelefono();
                asistente.Institucion.Direccion = this.frmDireccion();
                asistente.Institucion.ToId = this.frmIdTo();
                //aca guardar en la variable de session
                var objeto = JSON.stringify(asistente);
                sessionStorage.setItem("ASISTENTE", objeto);
                console.log('guardar');
                window.location.href = "AsistentePasoDos.html";
            }
            console.log(self);
        }
        salir = function(){
            sessionStorage.clear();
            window.location.href = "index.html";

        }
    }
    //obtenemos los valores de session storegae
    if (sessionStorage.getItem('ASISTENTE')){
        asistente = JSON.parse(sessionStorage.getItem('ASISTENTE'));
        //aca debemos setear los campos en caso que hayan elementos del asistente
        if (asistente.Institucion && asistente.Institucion.Rut.length > 1) {
            //seteamos
            self.frmNombreInstitucion = ko.observable(asistente.Institucion.Nombre);
            self.frmDireccion = ko.observable(asistente.Institucion.Direccion);
            self.frmRazonSocial = ko.observable(asistente.Institucion.RazonSocial);
    
    
            self.frmRut = ko.observable(asistente.Institucion.Rut);
            self.frmTelefono = ko.observable(asistente.Institucion.Telefono);
            self.frmCorreoElectronico = ko.observable(asistente.Institucion.CorreoElectronico);
            self.frmIdRegion = ko.observable(asistente.Institucion.RegId);
            selectedRegion = ko.observable(asistente.Institucion.RegId);
            cargarComunas(asistente.Institucion.RegId, asistente.Institucion.ComId);
            selectedComuna = ko.observable(asistente.Institucion.ComId);
            self.frmIdTo = ko.observable(asistente.Institucion.idTo);
        }
    }

    function cargarComunas(idRegion, comSeleccionada){
        $.ajax({
            url: ObtenerUrl('ObtenerComunas'),
            type: "POST",
            data: ko.toJSON({ RegId: idRegion }),
            contentType: "application/json",
            dataType: "json",
            success: function (dataCC) {
                // ok
                //self.Reset();
                self.comunas = dataCC;
                selectedComuna = comSeleccionada;

                //ko.cleanNode(elem);
                //ko.applyBindings(new PersonViewModel(regiones, dataCC), elem);

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
    }
    var obtenerRegiones = jQuery.ajax({
        url : ObtenerUrl('ObtenerRegiones'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: 90 })
    });

    var obtenerTo = jQuery.ajax({
        url : ObtenerUrl('TipoOrganizacion'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: 90 })
    });

    $.when(obtenerRegiones).then(
        function(dataR){
            if (dataR != null)
            {
                regiones = dataR;
                self.regionesInstitucion = dataR;
                if (asistente.Institucion && asistente.Institucion.Rut.length <= 0) {
                    //por defecto
                    selectedRegion = 0;
                }

            }
            $.when(obtenerTo).then(
                function(dataTo){
                    if (dataTo != null)
                    {
                        tipoOrganizacion = dataTo;
                        self.tiposOrganizacion = dataTo;
                        //por defecto
                        //selectedRegion = 0;
                    }
                    ko.applyBindings(new PersonViewModel(dataR, [], dataTo), elem);
                }
            );

            self.onChange = function () {
                var idRegion = $("#selectIdRegion").val();
                $.ajax({
                    url: ObtenerUrl('ObtenerComunas'),
                    type: "POST",
                    data: ko.toJSON({ RegId: idRegion }),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (dataCC) {
                        // ok
                        //self.Reset();
                        self.comunas = dataCC;
                        selectedComuna = 0;

                        ko.cleanNode(elem);
                        ko.applyBindings(new PersonViewModel(regiones, dataCC), elem);

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
            };

            //ko.applyBindings(new PersonViewModel(dataR, []), elem);

        },
        function (){
            //alguna ha fallado
            alert('error');
        },
        function(){
            //acá podemos quitar el elemento cargando
            //ko.applyBindings(new PersonViewModel(dataR, []), elem);
            alert('quitar cargando');
        }
    );
    

    function validar(nombreInstitucion, idRegion, idComuna, direccion, razonSocial, telefono, correo, rut, idTo) {
        var retorno = true;
        if (nombreInstitucion === '' || nombreInstitucion === null || nombreInstitucion === undefined){
            getNotify('error', 'Requerido', 'Nombre Institución.');
            retorno = false;
        }
        if (idRegion === '' || idRegion === null || idRegion === '0'){
            getNotify('error', 'Requerido', 'Región.');
            retorno = false;
        }
        if (idComuna === '' || idComuna === null || idComuna === '0'){
            getNotify('error', 'Requerido', 'Comuna.');
            retorno = false;
        }
        if (idTo === '' || idTo === null || idTo === '0'){
            getNotify('error', 'Requerido', 'Tipo Organización.');
            retorno = false;
        }
        if (direccion === '' || direccion === null) {
            getNotify('error', 'Requerido', 'Dirección Requerido.');
            retorno = false;
        }
        if (razonSocial === '' || razonSocial === null) {
            getNotify('error', 'Requerido', 'Razón Social Requerido.');
            retorno = false;
        }
        if (telefono === '' || telefono === null) {
            getNotify('error', 'Requerido', 'Teléfono Requerido.');
            retorno = false;
        }
        if (rut === '' || rut === null){
            getNotify('error', 'Requerido', 'Rut Requerido.');
            retorno = false;
        }
        if (ValidarRut(rut) == false)
        {
            retorno = false;
        }

        if (validarEmail(correo) == false) {
            retorno = false;

        }

        return retorno;
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
    function revisarDigito(dvr) {
        dv = dvr + ""
        if (dv != '0' && dv != '1' && dv != '2' && dv != '3' && dv != '4' && dv != '5' && dv != '6' && dv != '7' && dv != '8' && dv != '9' && dv != 'k' && dv != 'K') {
            //alert("Debe ingresar un digito verificador valido");
            getNotify('error', 'Dígito verificador', 'Debe ingresar un digito verificador valido.');
            return false;
        }
        return true;
    }

    function revisarDigito2(crut) {
        largo = crut.length;
        if (largo < 2) {
            //alert("Debe ingresar el rut completo")
            getNotify('error', 'Incompleto', 'Debe ingresar el rut completo.');
            return false;
        }
        if (largo > 2)
            rut = crut.substring(0, largo - 1);
        else
            rut = crut.charAt(0);
        dv = crut.charAt(largo - 1);
        revisarDigito(dv);

        if (rut == null || dv == null)
            return 0

        var dvr = '0'
        suma = 0
        mul = 2

        for (i = rut.length - 1 ; i >= 0; i--) {
            suma = suma + rut.charAt(i) * mul
            if (mul == 7)
                mul = 2
            else
                mul++
        }
        res = suma % 11
        if (res == 1)
            dvr = 'k'
        else if (res == 0)
            dvr = '0'
        else {
            dvi = 11 - res
            dvr = dvi + ""
        }
        if (dvr != dv.toLowerCase()) {
            //alert("EL rut es incorrecto")
            getNotify('error', 'Incorrecto', 'El Rut es Incorrecto.');
            return false
        }

        return true
    }

    function ValidarRut(texto) {
        var tmpstr = "";
        for (i = 0; i < texto.length ; i++)
            if (texto.charAt(i) != ' ' && texto.charAt(i) != '.' && texto.charAt(i) != '-')
                tmpstr = tmpstr + texto.charAt(i);
        texto = tmpstr;
        largo = texto.length;

        if (largo < 2) {
            //alert("Debe ingresar el rut completo")
            getNotify('error', 'Incompleto', 'Rut Incompleto.');
            return false;
        }

        for (i = 0; i < largo ; i++) {
            if (texto.charAt(i) != "0" && texto.charAt(i) != "1" && texto.charAt(i) != "2" && texto.charAt(i) != "3" && texto.charAt(i) != "4" && texto.charAt(i) != "5" && texto.charAt(i) != "6" && texto.charAt(i) != "7" && texto.charAt(i) != "8" && texto.charAt(i) != "9" && texto.charAt(i) != "k" && texto.charAt(i) != "K") {
                //alert("El valor ingresado no corresponde a un R.U.T valido");
                getNotify('error', 'Inválido', 'El Rut es Inválido.');
                return false;
            }
        }

        var invertido = "";
        for (i = (largo - 1), j = 0; i >= 0; i--, j++)
            invertido = invertido + texto.charAt(i);
        var dtexto = "";
        dtexto = dtexto + invertido.charAt(0);
        dtexto = dtexto + '-';
        cnt = 0;

        for (i = 1, j = 2; i < largo; i++, j++) {
            //alert("i=[" + i + "] j=[" + j +"]" );
            if (cnt == 3) {
                dtexto = dtexto + '.';
                j++;
                dtexto = dtexto + invertido.charAt(i);
                cnt = 1;
            }
            else {
                dtexto = dtexto + invertido.charAt(i);
                cnt++;
            }
        }

        invertido = "";
        for (i = (dtexto.length - 1), j = 0; i >= 0; i--, j++)
            invertido = invertido + dtexto.charAt(i);

        //window.document.form1.rut.value = invertido.toUpperCase()

        if (revisarDigito2(texto))
            return true;

        return false;
    }

});
