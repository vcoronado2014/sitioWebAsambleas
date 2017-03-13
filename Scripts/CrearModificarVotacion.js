﻿$(document).ready(function () {
    if (sessionStorage != null) {

        if (sessionStorage.getItem("Id") != null) {
            $('#ancoreSesion').html('<i class="fa fa-close"></i> Cerrar Sesión');
        }
        else {
            $('#ancoreSesion').html('<i class="fa fa-sign-in"></i> Iniciar Sesión');
            window.location.href = "login.html";
            return;
        }
    }
    else {
        window.location.href = "login.html";
    }

    $('#ancoreSesion').on('click', function () {
        if ($('#ancoreSesion').html() == '<i class="fa fa-close"></i> Cerrar Sesión') {
            //acá debe direccionarlo directamente al login y vaciar la variable de session
            sessionStorage.clear();
            window.location.href = "login.html";
            return;
        }
        else {
            //directo al login
            window.location.href = "login.html";
        }


    });
    //manejo de las fechas
    $("#txtFechaInicio").datepicker({
        dateFormat: "dd-mm-yy",
        maxDate: 30,
        minDate: 0,
        onSelect: function (dateText) {
            // Parse the selected string into moment object
            var momDate = moment(dateText, 'DD-MM-YYYY');
            // Get gap string
            // gap can be something like 'in 10 hours'
            var gap = momDate.fromNow();
            // Get difference as integer
            var gapInt = momDate.diff(moment().startOf('d'), 'd');

            // Here you can use add() to modify you moment object
            momDate.add(gapInt, 'days');

            //// Get date formatted as you like
            //var dateFormatted = momDate.format('YYYY-M-DD');
            //console.log(dateFormatted);
        }
    });
    $("#txtFechaTermino").datepicker({
        dateFormat: "dd-mm-yy",
        maxDate: 90,
        minDate: 0,
        onSelect: function (dateText) {
            // Parse the selected string into moment object
            var momDate = moment(dateText, 'DD-MM-YYYY');
            // Get gap string
            // gap can be something like 'in 10 hours'
            var gap = momDate.fromNow();
            // Get difference as integer
            var gapInt = momDate.diff(moment().startOf('d'), 'd');

            // Here you can use add() to modify you moment object
            momDate.add(gapInt, 'days');

            //// Get date formatted as you like
            //var dateFormatted = momDate.format('YYYY-M-DD');
            //console.log(dateFormatted);
        }
    });

    $('[data-toggle="tooltip"]').tooltip()
    function VotacionViewModel(data) {
        var self = this;
        //self.people = ko.observableArray([]);
        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        self.idUsuario = getParameterByName('idUsuario');

        self.elem = document.getElementById('principal');

        //del formulario
        self.frmNombre = ko.observable("");
        self.frmObjetivo = ko.observable("");
        self.frmFechaInicio = ko.observable("");
        self.frmFechaTermino = ko.observable("");
        self.frmFechaCreacion = ko.observable("");

        self.details = ko.observable("Pinche aquí para abrir");

        //guardar = function () {

        //    //acá hay que validar todo!!

        //    if (validar($("#txtNombreUsuario").val(), $("#txtNumeroComprobante").val(), $("#txtMonto").val())) {
        //        var idTipoMovimiento = $("#selectIdTipoMovimiento").val();
        //        var id = getParameterByName('id');
        //        var instId = sessionStorage.getItem("InstId");
        //        var idUsuario = sessionStorage.getItem("Id");
        //        var nombreArchivo = $("#txtArchivo").val();
        //        var file_data = $("#txtArchivo").prop("files")[0];
                

        //    }
        //    //ahora se podría guardar

        //    var rendicion = {
        //        Id: id,
        //        Detalle: frmNombreUsuario,
        //        NumeroComprobante: frmNumeroComprobante,
        //        Monto: frmMonto,
        //        IdTipoMovimiento: idTipoMovimiento,
        //        IdUsuario: idUsuario,
        //        NombreArchivo: nombreArchivo,
        //        InstId: instId
        //    };
        //    var dataF = new FormData();

        //    var files = $("#txtArchivo").get(0).files;

        //    // Add the uploaded image content to the form data collection
        //    if (files.length > 0) {
        //        dataF.append("UploadedImage", files[0]);
                
        //    }
        //    dataF.append("rendicion", JSON.stringify(rendicion));


        //           $.ajax({
        //               type: "POST",
        //               url: "http://localhost:48909/api/File",
        //               contentType: false,
        //               processData: false,
        //               dataType: "json",
        //               data: dataF,
        //                success: function (result) {
        //                    //TODO OK INFORMAR EL GUARDADO CORRECTO

        //                    swal({
        //                        title: "Guardado",
        //                        text: "El Registro ha sido guardado con éxito.",
        //                        type: "success",
        //                        showCancelButton: false,
        //                        confirmButtonClass: "btn-success",
        //                        confirmButtonText: "Ok",
        //                        cancelButtonText: "No, cancel plx!",
        //                        closeOnConfirm: false,
        //                        customClass: 'sweetalert-xs',
        //                        closeOnCancel: false
        //                    },
        //                    function (isConfirm) {
        //                        if (isConfirm) {
        //                            //swal("Deleted!", "Your imaginary file has been deleted.", "success");
        //                            window.location.href = "ListarRendicion.html";
        //                        } else {
        //                            swal("Cancelled", "Your imaginary file is safe :)", "error");
        //                        }
        //                    });
        //                },
        //                error: function (error) {
        //                    if (error.status.toString() == "500") {
        //                        getNotify('error', 'Error', 'Error en el Servidor.');
        //                    }
        //                    else {
        //                        getNotify('error', 'Error', 'Error en el Servidor.');
        //                        //alert("fail");
        //                    }
        //                }
        //            });


 
        //    }

        cancelar = function () {
            window.location.href = "ListarRendicion.html";

        }
    }
    var id = getParameterByName('id');
    var elimina = getParameterByName('ELIMINAR');
    if (id > 0) {


        $.ajax({
            url: "http://localhost:48909/api/Votacion",
            type: "POST",
            data: ko.toJSON({ BuscarId: id, InstId: sessionStorage.getItem("InstId") }),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                // ok

                self.frmNombre = data.proposals[0].NombreUsuario;
                self.frmObjetivo = data.proposals[0].NombreCompleto;
                //self.frmFechaInicio = moment(data.proposals[0].OtroUno).format("MM-DD-YYYY");
                self.frmFechaInicio = data.proposals[0].OtroUno;
                self.frmFechaTermino = data.proposals[0].OtroDos;
                self.frmFechaCreacion = data.proposals[0].OtroTres;
               
                self.details= "Pinche aqui para abrir";
                //getNotify('success', 'Éxito', 'Recuperado con éxito!');
                self.onChangeUsuario = function () {
                    var nombreUsuario = $("#txtNombreUsuario").val();

                };
                ko.applyBindings(new VotacionViewModel(data), self.elem);





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

        if (elimina == 1) {
            //determinar si es el mismo usuario a eliminar

            //bloquear todos los controles y cambiar el nombre del botòn
            $("#txtFecha").attr('disabled', 'disabled');
            $("#selectIdTipoMovimiento").attr('disabled', 'disabled');
            $("#txtNumeroComprobante").attr('disabled', 'disabled');
            $("#txtMonto").attr('disabled', 'disabled');
            $("#txtArchivo").attr('disabled', 'disabled');
            $("#txtNombreUsuario").attr('disabled', 'disabled');

            swal({
                title: "Eliminar",
                text: "¿Está seguro de eliminar a este Movimiento?",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    

                        setTimeout(function () {

                            $.ajax({
                                url: "http://localhost:48909/api/Rendicion",
                                type: "DELETE",
                                data: ko.toJSON({ Id: id }),
                                contentType: "application/json",
                                dataType: "json",
                                success: function (dataF) {
                                    //ok
                                    swal({
                                        title: "Eliminado",
                                        text: "El Registro ha sido eliminado con éxito.",
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
                                            //swal("Deleted!", "Your imaginary file has been deleted.", "success");
                                            window.location.href = "ListarRendicion.html";
                                        } else {
                                            swal("Cancelled", "Your imaginary file is safe :)", "error");
                                        }
                                    });

                                    //swal("Eliminado con éxito!");
                                },
                                error: function (error) {
                                    if (error.status.toString() == "500") {
                                        //getNotify('error', 'Error', 'Error de Servidor!');
                                        swal("Error de Servidor");
                                    }
                                    else {
                                        //getNotify('error', 'Error', 'Error de Servidor!');
                                        swal("Error de Servidor");
                                    }
                                }
                            });

                            //swal("Ajax request finished!");

                        }, 2000);
  
                }
                else {
                    window.location.href = "listarRendicion.html";
                }
            });

        }
    }
    else {
        $("#txtNombreUsuario").removeAttr('disabled');
        var data = [];

        self.onChangeUsuario = function () {
            var nombreUsuario = $("#txtNombreUsuario").val();

            $.ajax({
                url: "http://localhost:48909/api/Rendicion",
                type: "POST",
                data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), BuscarId: nombreUsuario }),
                contentType: "application/json",
                dataType: "json",
                success: function (usuario) {
                    //// ok
                    if (usuario.proposals != undefined) {
                        if (usuario.proposals.length == 1) {
                            swal({
                                title: "Existe",
                                text: "Este detalle de rendición ya existe intente con otro",
                                type: "warning",
                                customClass: 'sweetalert-xs'
                            });
                            $("#txtNombreUsuario").val("");

                        }
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
        };

        ko.applyBindings(new VotacionViewModel(data), self.elem);


    }

    function validar(NombreUsuario, NumeroComprobante, Monto) {
        var retorno = true;
        if (NombreUsuario === '' || NombreUsuario === null || NombreUsuario === undefined) {
            getNotify('error', 'Requerido', 'Detalle Requerido.');
            retorno = false;
        }
        if (NumeroComprobante === '' || NumeroComprobante === null) {
            getNotify('error', 'Requerido', 'Número Comprobante Requerido.');
            retorno = false;
        }
        if (Monto === '' || Monto === null) {
            getNotify('error', 'Requerido', 'Monto Requerido.');
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

    //
    // Validador de Rut
    // Descargado desde http://www.juque.cl/
    //
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

    function Rut(texto) {
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
function Volver() {
    window.location.href = "inicio.html";
}
function buscar(regId) {
    alert(regId);
}
