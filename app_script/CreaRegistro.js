$(document).ready(function () {
    exp: var elem = document.getElementById('principal');
    exp: var regiones = ko.observableArray([]);
    exp: var tipoOrganizacion = ko.observableArray([]);
    exp: var institucionesArr = [];
    exp: var instituciones = [];
    exp: var invitaciones = [];
    exp: var nombreUsuario = '';
    //exp: var existe = true;
    //objeto a guardar
    function PersonViewModel(dataR, dataCC, dataT){
        var self = this;
        //del formulario
        self.regionesInstitucion = ko.observableArray(dataR);
        self.tiposOrganizacion = ko.observableArray(dataT);
        self.comunas = ko.observableArray(dataCC);

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

        self.frmIdRegion = ko.observable("");
        self.frmIdComuna = ko.observable("");

        self.frmCorreoElectronico = ko.observable("");
        self.frmPassword = ko.observable('');
        self.frmNuevaPassword = ko.observable('');
        if (invitacionesArr && invitacionesArr.length > 0){

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

            self.frmPassword = ko.observable($("#txtPassword").val());
            self.frmNuevaPassword = ko.observable($("#txtNuevaPassword").val());

            let objeto = {
                Instituciones: [],
                Invitaciones: [],
                Invitado: null
            }

            if (validar(self.frmNombres(), self.frmIdRegion(), self.frmIdComuna(), self.frmDireccion(), 
            self.frmPrimerApellido(), self.frmTelefono(), self.frmCorreoElectronico(), self.frmRut(), self.frmPassword(), self.frmNuevaPassword())){
                //aca correcto enviar la info
                objeto.Instituciones = instituciones;
                objeto.Invitaciones = invitaciones;
                objeto.Invitado = {
                  NombreUsuario: nombreUsuario,
                  Run: self.frmRut(),
                  Nombres: self.frmNombres(),
                  PrimerApellido: self.frmPrimerApellido(),
                  SegundoApellido: self.frmSegundoApellido(),
                  RegId: self.frmIdRegion(),
                  ComId: self.frmIdComuna(),
                  Direccion: self.frmDireccion(),
                  Telefono: self.frmTelefono(),
                  Correo: self.frmCorreoElectronico(),
                  Password: self.frmPassword(),
                }

                $.ajax({
                    url: ObtenerUrl('RegistroUsuario'),
                    type: "POST",
                    data: ko.toJSON({ data: objeto }),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {
                        // ok
                        //evaluar respuesta
                        var datos = data;
                        if (datos.AutentificacionUsuario && datos.AutentificacionUsuario.Id > 0){

                            swal({
                                title: "Guardado",
                                text: "Su Registro ha sido guardado con éxito, utilice su correo electrónico " + nombreUsuario + " y su contraseña creada para ingresar al sistema.",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonClass: "btn-success",
                                confirmButtonText: "Ok",
                                cancelButtonText: "No, cancel plx!",
                                closeOnConfirm: true,
                                customClass: 'sweetalert-xs',
                                closeOnCancel: false
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    sessionStorage.clear();
                                    window.location.href = "index.html";  
    
                                } else {
                                    swal("Cancelled", "Your imaginary file is safe :)", "error");
                                }
                            });
                          }
        
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


                console.log(objeto);



            }


        }
        volver = function(){
            sessionStorage.clear();
            window.location.href = "index.html";

        }
    }
    //obtenemos los valores de session storegae
    if (sessionStorage.getItem('INVITADOS')){
        invitaciones = [];
        instituciones = [];
        invitacionesArr = JSON.parse(sessionStorage.getItem('INVITADOS'));
        console.log(invitacionesArr);
        if (invitacionesArr && invitacionesArr.length > 0){
            invitacionesArr.forEach(elemento => {
                if (elemento.Institucion){
                    if (elemento.Invitados){
                        self.frmCorreoElectronico = ko.observable(elemento.Invitados.Correo);
                        nombreUsuario = elemento.Invitados.Correo;
                        elemento.Institucion.NombreRol = elemento.Invitados.NombreRol;
                        invitaciones.push(elemento.Invitados);
                        
                    }
                    instituciones.push(elemento.Institucion);
                }
            });
            console.log(invitaciones);
            console.log(instituciones);
        }

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
            if (dataR != null) {
                regiones = dataR;
                self.regionesInstitucion = dataR;
                selectedRegion = 0;
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

    function validar(nombres, idRegion, idComuna, direccion, primerApellido, telefono, correo, rut, password, nuevaPassword) {
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
        if (password && nuevaPassword){
            if (password === '' || password === null || password === undefined){
                getNotify('error', 'Requerido', 'Contraseña Requerida.');
                retorno = false;
            }
            if (nuevaPassword === '' || nuevaPassword === null || nuevaPassword === undefined){
                getNotify('error', 'Requerido', 'Repita Contraseña Requerida.');
                retorno = false;
            }
            if (password != nuevaPassword){
                getNotify('error', 'Requerido', 'Las contraseñas deben coincidir.');
                retorno = false;
            }

        }
        else {
            getNotify('error', 'Requerido', 'Verifique las contraseñas.');
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

});
