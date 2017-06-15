/**
 * Created by vcoronado on 05-04-2017.
 */
$(document).ready(function () {

    function InstitucionViewModel(data, dataR, dataC, dataF) {
        var self = this;
        //self.people = ko.observableArray([]);

        self.comunas = ko.observableArray(dataC);
        self.regiones = ko.observableArray(dataR);
        self.roles = ko.observableArray(dataF);
        self.elem = document.getElementById('principal');

        //del formulario
        self.frmNombreInstitucion = ko.observable();
        self.frmTelefono = ko.observable();
        self.frmCorreoElectronico = ko.observable();
        self.frmDireccion = ko.observable();


        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);

        cancelar = function () {
            window.location.href = "ListarInstitucion.html";

        }
        siguiente = function(item){
            //alert(frmCorreoElectronico);
            //antes hay que validar
            if (validar($("#txtNombreUsuario").val(), $("#selectIdComuna").val(), $("#txtCorreo").val(), $("#txtTelefono").val(), $("#txtDireccion").val())) {
                sessionStorage.setItem("correoInstitucionPrueba", frmCorreoElectronico);
                sessionStorage.setItem("telefonoInstitucionPrueba", frmTelefono);
                sessionStorage.setItem("nombreInstitucionPrueba", frmNombreInstitucion + "_prueba");
                sessionStorage.setItem("direccionInstitucionPrueba", frmDireccion);
                var idRegion = $("#selectIdRegion").val();
                sessionStorage.setItem("idRegionInstitucionPrueba", idRegion);
                var idComuna = $("#selectIdComuna").val();
                sessionStorage.setItem("idComunaInstitucionPrueba", idComuna);
                window.location.href = "PruebaUsuario.html";
            }

        }
        salir = function(){
            sessionStorage.clear();
            window.location.href = "index.html";

        }
        onChangeInstitucion = function () {
            var nombreInstitucion = $("#txtNombreUsuario").val();
            var consulta = { NombreInstitucion: nombreInstitucion};
            var consultar = jQuery.ajax({
                url: ObtenerUrlDos('Asistente'),
                type: 'POST',
                dataType: "json",
                contentType: "application/json",
                data: ko.toJSON(consulta)
            });

            //var llamada y promesa, luego de ser correcto borrar las variables de sesion y redireccionarlo al index

            $.when(consultar).then(
                function (data) {
                    //aca despues de guardar
                    if (data.Id > 0) {
                        swal({
                                title: "Ya Existe",
                                text: "Esta institución ya existe, intente con otra",
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
                                    $("#txtNombreUsuario").val('');

                                } else {
                                    swal("Cancelled", "Your imaginary file is safe :)", "error");
                                }
                            });
                    }

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

        };
    }


        $("#txtNombreUsuario").removeAttr('disabled');
        var data = [];
        $.ajax({
            url: ObtenerUrl('ObtenerRegiones'),
            type: "POST",
            data: ko.toJSON({ InstId: 90 }),
            contentType: "application/json",
            dataType: "json",
            success: function (dataR) {
                // ok
                self.regiones = dataR;
                selectedRegion = 0;

                $.ajax({
                    url: ObtenerUrl('ObtenerComunas'),
                    type: "POST",
                    data: ko.toJSON({ RegId: 13 }),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (dataC) {
                        // ok
                        self.comunas = dataC;
                        selectedComuna = 0;
                        dataF = [];
                        ko.applyBindings(new InstitucionViewModel(data, dataR, dataC, dataF), self.elem);

                        self.onChange = function () {
                            var idRegion = $("#selectIdRegion").val();
                            //alert(frmIdRegion);
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
                                    //ko.applyBindings(new PersonViewModel(dataCC));
                                    elem = document.getElementById('page-top');
                                    ko.cleanNode(elem);
                                    ko.applyBindings(new InstitucionViewModel(data, dataR, dataCC, self.roles));

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

        self.onChange = function () {
            var idRegion = $("#selectIdRegion").val();
            //alert(frmIdRegion);
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
                    //ko.applyBindings(new PersonViewModel(dataCC));
                    elem = document.getElementById('page-top');
                    ko.cleanNode(elem);
                    ko.applyBindings(new InstitucionViewModel(data, dataR, dataCC, []), elem);

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



    function validar(NombreInstitucion, IdComuna, CorreoElectronico, Telefono, Direccion) {
        var retorno = true;
        if (NombreInstitucion === '' || NombreInstitucion === null) {
            getNotify('error', 'Requerido', 'Nombre de Institución Requerida.');
            retorno = false;
        }
        if (CorreoElectronico === '' || CorreoElectronico === null) {
            getNotify('error', 'Requerido', 'Correo Electrónico Requerido.');
            retorno = false;
        }
        if (validarEmail(CorreoElectronico) == false)
        {
            getNotify('error', 'Inválido', 'Correo Electrónico Inválido.');
            retorno = false;
        }
        if (Telefono === '' || Telefono === null) {
            getNotify('error', 'Requerido', 'Teléfono Requerido.');
            retorno = false;
        }
        if (Direccion === '' || Direccion === null) {
            getNotify('error', 'Requerido', 'Direccion Requerida.');
            retorno = false;
        }

        if (IdComuna === '0' || IdComuna === null) {
            getNotify('error', 'Requerido', 'Comuna Requerida.');
            retorno = false;
        }

        return retorno;
    }

    function getParameterByName(name, url) {

        //// query string: ?foo=lorem&bar=&baz
        //var foo = getParameterByName('foo'); // "lorem"
        //var bar = getParameterByName('bar'); // "" (present with empty value)
        //var baz = getParameterByName('baz'); // "" (present with no value)
        //var qux = getParameterByName('qux'); // null (absent)

        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    function getNotify(type, title, message) {
        if (type == 'error') {
            new PNotify({
                title: title,
                text: message,
                type: 'error'
            });
        }
        if (type == 'success') {
            new PNotify({
                title: title,
                text: message,
                icon: 'glyphicon glyphicon-ok'
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

});
function Volver() {
    window.location.href = "ListarInstitucion.html";
}
function buscar(regId) {
    alert(regId);
}

