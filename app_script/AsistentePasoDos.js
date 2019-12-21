$(document).ready(function () {
    exp: var elem = document.getElementById('principal');
    exp: var regiones = ko.observableArray([]);
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
        self.regionesInstitucion = ko.observableArray(dataR);
        self.comunas = ko.observableArray(dataCC);

        //aca debemos setear los campos en caso que hayan elementos del asistente
        if (asistente.Persona && asistente.Persona.Rut.length <= 0){
            //del formulario
            self.frmNombres = ko.observable("");
            self.frmPrimerApellido = ko.observable("");
            self.frmSegundoApellido = ko.observable("");

            //self.regionesInstitucion = ko.observableArray(dataR);
            //self.comunas = ko.observableArray(dataCC);
            selectedComuna = ko.observable("");
            self.frmDireccion = ko.observable("");
            self.frmRazonSocial = ko.observable("");
            self.frmRut = ko.observable("");
            self.frmTelefono = ko.observable("");
            self.frmCorreoElectronico = ko.observable("");
            self.frmIdRegion = ko.observable("");
            self.frmIdComuna = ko.observable("");
        }


        siguiente = function(item){
            self.frmNombres = ko.observable($("#txtNombres").val());
            self.frmPrimerApellido = ko.observable($("#txtPrimerApellido").val());
            self.frmSegundoApellido = ko.observable($("#txtSegundoApellido").val());

            self.frmDireccion = ko.observable($("#txtDireccion").val());
    
            self.frmRut = ko.observable($("#txtRut").val());
            self.frmTelefono = ko.observable($("#txtTelefono").val());
            self.frmCorreoElectronico = ko.observable($("#txtCorreo").val());
            self.frmIdRegion = ko.observable($("#selectIdRegion").val());
            self.frmIdComuna = ko.observable($("#selectIdComuna").val());

            if (validar(self.frmNombres(), self.frmIdRegion(), self.frmIdComuna(), self.frmDireccion(), 
                self.frmPrimerApellido(), self.frmTelefono(), self.frmCorreoElectronico(), self.frmRut())){

                    asistente.AutentificacionUsuario.CorreoElectronico = this.frmCorreoElectronico();
                    asistente.AutentificacionUsuario.NombreUsuario = this.frmRut();
                    asistente.AutentificacionUsuario.Password = this.frmRut();
                    asistente.Persona.Nombres = this.frmNombres();
                    asistente.Persona.ApellidoPaterno = this.frmPrimerApellido();
                    asistente.Persona.ApellidoMaterno = this.frmSegundoApellido();
                    asistente.Persona.PaiId = asistente.Institucion.PaiId;
                    asistente.Persona.RegId = this.frmIdRegion();
                    asistente.Persona.ComId = this.frmIdComuna();
                    asistente.Persona.DireccionCompleta = this.frmDireccion();
                    asistente.Persona.Rut = this.frmRut();
                    asistente.Persona.Telefonos = this.frmTelefono();
                    var objeto = JSON.stringify(asistente);
                    sessionStorage.setItem("ASISTENTE", objeto);
                    window.location = "AsistentePasoTres.html";
                    //IR A LA PAGINA 3 DEL ASISTENTE


            }
            console.log(self);
        }
        salir = function(){
            sessionStorage.clear();
            window.location.href = "index.html";

        }
        volver = function(){
            //sessionStorage.clear();
            window.location.href = "AsistentePasoUno.html";

        }
        usarDatos = function(){
            if (asistente.Institucion && asistente.Institucion.Rut.length > 1) {
                //seteamos
                self.frmDireccion = ko.observable(asistente.Institucion.Direccion);
    
                self.frmRut = ko.observable(asistente.Institucion.Rut);
                self.frmTelefono = ko.observable(asistente.Institucion.Telefono);
                self.frmCorreoElectronico = ko.observable(asistente.Institucion.CorreoElectronico);
                self.frmIdRegion = ko.observable(asistente.Institucion.RegId);
                selectedRegion = ko.observable(asistente.Institucion.RegId);
                cargarComunas(asistente.Institucion.RegId, asistente.Institucion.ComId);
                selectedComuna = ko.observable(asistente.Institucion.ComId);
            }
        }

    }
    //obtenemos los valores de session storegae
    if (sessionStorage.getItem('ASISTENTE')){
        asistente = JSON.parse(sessionStorage.getItem('ASISTENTE'));
        //aca debemos setear los campos en caso que hayan elementos del asistente
        if (asistente.Persona && asistente.Persona.Rut.length > 1){
            //seteamos
            self.frmNombres = ko.observable(asistente.Persona.Nombres);
            self.frmPrimerApellido = ko.observable(asistente.Persona.ApellidoPaterno);
            self.frmSegundoApellido = ko.observable(asistente.Persona.ApellidoMaterno);
    
            self.frmDireccion = ko.observable(asistente.Persona.DireccionCompleta);
    
            self.frmRut = ko.observable(asistente.Persona.Rut);
            self.frmTelefono = ko.observable(asistente.Persona.Telefonos);
            self.frmCorreoElectronico = ko.observable(asistente.AutentificacionUsuario.CorreoElectronico);
            self.frmIdRegion = ko.observable(asistente.Persona.RegId);
            selectedRegion = ko.observable(asistente.Persona.RegId);
            cargarComunas(asistente.Persona.RegId, asistente.Persona.ComId);
        }
    }

    //console.log(asistente);
    //FIN OBTENCION
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
                //por defecto
                if (asistente.Persona && asistente.Persona.Rut.length <= 0){
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


    function validar(nombres, idRegion, idComuna, direccion, primerApellido, telefono, correo, rut) {
        var retorno = true;
        if (nombres === '' || nombres === null || nombres === undefined){
            getNotify('error', 'Requerido', 'Nombre Requerido.');
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

        if (direccion === '' || direccion === null) {
            getNotify('error', 'Requerido', 'Dirección Requerido.');
            retorno = false;
        }
        if (primerApellido === '' || primerApellido === null) {
            getNotify('error', 'Requerido', 'Apellido Requerido.');
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
