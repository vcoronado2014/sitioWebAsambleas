/**
 * Created by vcoronado on 05-04-2017.
 */
$(document).ready(function () {

    function PersonViewModel(){
        var self = this;
        //del formulario
        self.frmNombreUsuario = ko.observable("");
        self.frmNombres = ko.observable("");
        self.frmApellidoPaterno = ko.observable("");
        self.frmApellidoMaterno = ko.observable("");
        self.frmRut = ko.observable("");
        self.frmTelefono = ko.observable(sessionStorage.getItem("telefonoInstitucionPrueba"));
        self.frmCorreoElectronico = ko.observable(sessionStorage.getItem("correoInstitucionPrueba"));
        self.frmIdRegion = ko.observable(sessionStorage.getItem("idRegionInstitucionPrueba"));
        self.frmIdComuna = ko.observable(sessionStorage.getItem("idComunaInstitucionPrueba"));
        self.frmDireccion = ko.observable(sessionStorage.getItem("direccionInstitucionPrueba"));
        self.frmNombreInstitucion = ko.observable(sessionStorage.getItem("nombreInstitucionPrueba"));

        self.frmPassword = ko.observable("");
        self.frmNuevaPassword = ko.observable("");


        siguiente = function(item){



            //antes de todo vamos a validar la informaciòn registrada
            if (validar($("#txtRut").val(), $("#txtNombres").val(), $("#txtPrimerApellido").val(), $("#txtRut").val(), $("#txtPassword").val())) {

                sessionStorage.setItem("nombreUsuarioPrueba", frmRut);
                sessionStorage.setItem("nombresUsuarioPrueba", frmNombres);
                sessionStorage.setItem("apellidoPaternoPrueba", frmApellidoPaterno);
                sessionStorage.setItem("apellidoMaternoPrueba", frmApellidoMaterno);
                sessionStorage.setItem("rutPrueba", frmRut);

                var entidad = {
                    Rut: frmRut,
                    Nombres: frmNombres,
                    PrimerApellido: frmApellidoPaterno,
                    SegundoApellido: frmApellidoMaterno,
                    Telefono: sessionStorage.getItem("telefonoInstitucionPrueba"),
                    Correo: sessionStorage.getItem("correoInstitucionPrueba"),
                    IdRegion: sessionStorage.getItem("idRegionInstitucionPrueba"),
                    IdComuna: sessionStorage.getItem("idComunaInstitucionPrueba"),
                    Direccion: sessionStorage.getItem("direccionInstitucionPrueba"),
                    Password: $("#txtPassword").val(),
                    NombreInstitucion: sessionStorage.getItem("nombreInstitucionPrueba"),
                    EsCpas: '0'
                };

                var obtenerDatos = jQuery.ajax({
                    url: ObtenerUrlDos('Asistente'),
                    type: 'PUT',
                    dataType: "json",
                    contentType: "application/json",
                    data: ko.toJSON(entidad)
                });

                //var llamada y promesa, luego de ser correcto borrar las variables de sesion y redireccionarlo al index

                $.when(obtenerDatos).then(
                    function (data) {
                        //aca despues de guardar
                        swal({
                                title: "Guardado",
                                text: "Su cuenta ha sido creada con éxito, puede ingresar a la plataforma con su cuenta recién creada.",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonClass: "btn-success",
                                confirmButtonText: "Ok",
                                cancelButtonText: "No, cancel plx!",
                                closeOnConfirm: false,
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

                    },
                    function () {
                        //alguna ha fallado
                        swal("Error de Servidor");
                    },
                    function () {
                        //acá podemos quitar el elemento cargando
                        //alert('quitar cargando');
                    }
                )
            }


        }
        salir = function(){
            sessionStorage.clear();
            window.location.href = "index.html";

        }
    }

    ko.applyBindings(new PersonViewModel());

    function validar(NombreUsuario, Nombres, ApellidoPaterno, Rut, Password) {
        var retorno = true;
        if (NombreUsuario === '' || NombreUsuario === null || NombreUsuario === undefined){
            getNotify('error', 'Requerido', 'Nombre de Usuario Requerido.');
            retorno = false;
        }
        if (Nombres === '' || Nombres === null){
            getNotify('error', 'Requerido', 'Nombres Requerido.');
            retorno = false;
        }
        if (ApellidoPaterno === '' || ApellidoPaterno === null) {
            getNotify('error', 'Requerido', 'Apellido Paterno Requerido.');
            retorno = false;
        }
        if (Rut === '' || Rut === null){
            getNotify('error', 'Requerido', 'Rut Requerido.');
            retorno = false;
        }
        if (ValidarRut(Rut) == false)
        {
            retorno = false;
        }
        if (Password != '') {
            if (Password.length < 5){
                getNotify('error', 'Password', 'La password debe contener mínimo 5 caracteres.');
                retorno = false;
            }

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
