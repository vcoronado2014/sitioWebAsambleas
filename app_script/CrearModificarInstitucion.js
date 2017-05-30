$(document).ready(function () {
    if (sessionStorage != null) {

        if (sessionStorage.getItem("Id") != null) {
            $('#ancoreSesion').html('<i class="fa fa-close"></i> Cerrar Sesión');
        }
        else {
            $('#ancoreSesion').html('<i class="fa fa-sign-in"></i> Iniciar Sesión');
            window.location.href = "index.html";
            return;
        }
    }
    else {
        window.location.href = "index.html";
    }

    $('#ancoreSesion').on('click', function () {
        if ($('#ancoreSesion').html() == '<i class="fa fa-close"></i> Cerrar Sesión')
        {
            //acá debe direccionarlo directamente al login y vaciar la variable de session

            if (sessionStorage.getItem("ES_CPAS") == "true")
            {
                window.location.href = 'indexCpas.html';
            }
            else
            {
                window.location.href = 'index.html';
            }
            sessionStorage.clear();
            return;
        }
        else
        {
            //directo al login
            if (sessionStorage.getItem("ES_CPAS") == "true")
            {
                window.location.href = 'indexcpas.html';
            }
            else
            {
                window.location.href = 'index.html';
            }
        }


    });

    function InstitucionViewModel(data, dataR, dataC, dataF) {
        var self = this;
        //self.people = ko.observableArray([]);
        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.idInstitucion = getParameterByName('id');
        self.comunas = ko.observableArray(dataC);
        self.regiones = ko.observableArray(dataR);
        self.roles = ko.observableArray(dataF);
        self.elem = document.getElementById('principal');

        //del formulario
        self.frmNombreInstitucion = ko.observable();
        self.frmTelefono = ko.observable();
        self.frmCorreoElectronico = ko.observable();
        self.frmDireccion = ko.observable();

/*
        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);
*/

        Menu();
        guardar = function () {
            //acá hay que validar todo!!
            if (validar(frmNombreInstitucion, $("#selectIdComuna").val(), frmCorreoElectronico, frmTelefono, frmDireccion)) {
                if (validarEmail(frmCorreoElectronico)) {

                    var idRegion = $("#selectIdRegion").val();
                    var idInstitucion = getParameterByName('id');
                    var idComuna = $("#selectIdComuna").val();

                    //ahora se podría guardar
                    var institucion = {
                        Id: idInstitucion,
                        Nombre: frmNombreInstitucion,
                        CorreoElectronico: frmCorreoElectronico,
                        Telefono: frmTelefono,
                        Direccion: frmDireccion,
                        IdRegion: idRegion,
                        IdComuna: idComuna
                    };
                    $.ajax({
                        url: ObtenerUrl('Institucion'),
                        type: "PUT",
                        data: ko.toJSON(institucion),
                        contentType: "application/json",
                        dataType: "json",
                        success: function (result) {
                            //TODO OK INFORMAR EL GUARDADO CORRECTO

                            swal({
                                title: "Guardado",
                                text: "El Registro ha sido guardado con éxito.",
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
                                    EnviarMensajeSignalR('Se ha creado/modificado una nueva institución.', "ListarInstitucion.html", "1", sessionStorage.getItem("RolId"), result);
                                    window.location.href = "ListarInstitucion.html";
                                } else {
                                    swal("Cancelled", "Your imaginary file is safe :)", "error");
                                }
                            });
                        },
                        error: function (error) {
                            if (error.status.toString() == "500") {
                                getNotify('error', 'Error', 'Error en el Servidor.');
                            }
                            else {
                                getNotify('error', 'Error', 'Error en el Servidor.');
                                //alert("fail");
                            }
                        }
                    });
                }

            }

        }
        cancelar = function () {
            window.location.href = "ListarInstitucion.html";

        }
    }
    var idInstitucionP = getParameterByName('id');
    if (idInstitucionP > 0) {
        $.ajax({
            url: ObtenerUrl('Institucion') + '?id=' + idInstitucionP,
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                // ok
                frmIdRegion = ko.observable(data.RegId);
                self.frmNombreInstitucion = data.Nombre;
                frmIdComuna = ko.observable(data.ComId);
                self.frmTelefono = data.Telefono;
                self.frmCorreoElectronico = data.CorreoElectronico;
                self.frmDireccion = data.Direccion;

                getNotify('success', 'Éxito', 'Recuperado con éxito!');

                $.ajax({
                    url: ObtenerUrl('ObtenerRegiones'),
                    type: "POST",
                    data: ko.toJSON({ InstId: 90 }),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (dataR) {
                        // ok
                        self.regiones = dataR;
                        selectedRegion = frmIdRegion;

                        $.ajax({
                            url: ObtenerUrl('ObtenerComunas'),
                            type: "POST",
                            data: ko.toJSON({ RegId: frmIdRegion }),
                            contentType: "application/json",
                            dataType: "json",
                            success: function (dataC) {
                                // ok
                                // ok
                                self.comunas = dataC;
                                selectedComuna = frmIdComuna;

                                $.ajax({
                                    url: ObtenerUrl('ObtenerRoles'),
                                    type: "POST",
                                    data: ko.toJSON({ InstId: 90 }),
                                    contentType: "application/json",
                                    dataType: "json",
                                    success: function (dataF) {
                                        //ok
                                        self.roles = dataF;
                                        selectedRol = self.frmIdRol;
                                        ko.applyBindings(new InstitucionViewModel(data, dataR, dataC, dataF), self.elem);
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
                                    //alert(frmIdRegion);
                                    $.ajax({
                                        url: ObtenerUrl('ObtenerComunas'),
                                        type: "POST",
                                        data: ko.toJSON({ RegId: self.frmIdRegion }),
                                        contentType: "application/json",
                                        dataType: "json",
                                        success: function (dataCC) {
                                            // ok
                                            //self.Reset();
                                            self.comunas = dataCC;
                                            selectedComuna = 0;
                                            //ko.applyBindings(new PersonViewModel(dataCC));
                                            elem = document.getElementById('principal');
                                            ko.cleanNode(elem);
                                            ko.applyBindings(new InstitucionViewModel(data, dataR, dataCC, self.roles), elem);

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

                                self.onChangeUsuario = function () {
                                    var nombreUsuario = $("#txtNombreUsuario").val();

                                    $.ajax({
                                        url: ObtenerUrl('Institucion'),
                                        type: "POST",
                                        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), BuscarId: nombreUsuario }),
                                        contentType: "application/json",
                                        dataType: "json",
                                        success: function (usuario) {
                                            //// ok
                                            if (usuario != undefined) {
                                                if (usuario.length == 1) {
                                                    swal({
                                                        title: "Existe",
                                                        text: "Este usuario ya existe intente con otro",
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
        var elimina = getParameterByName('ELIMINADO');
        if(elimina == 1)
        {
            //bloquear todos los controles y cambiar el nombre del botòn
            $("#txtNombreUsuario").attr('disabled', 'disabled');
            $("#txtTelefono").attr('disabled', 'disabled');
            $("#txtCorreo").attr('disabled', 'disabled');
            $("#txtDireccion").attr('disabled', 'disabled');
            $("#selectIdRegion").attr('disabled', 'disabled');
            $("#selectIdComuna").attr('disabled', 'disabled');

            swal({
                title: "Eliminar",
                text: "¿Está seguro de eliminar esta Institución?",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    
                    if (sessionStorage.getItem("NombreInstitucion") == $("#txtNombreUsuario").val()) {

                            setTimeout(function () {

                                swal({
                                    title: "Error",
                                    text: "No se puede eliminar LA INSTITUCIÓN del usuario logueado.",
                                    type: "error",
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
                                    window.location.href = "ListarInstitucion.html";
                                } else {
                                    swal("Cancelled", "Your imaginary file is safe :)", "error");
                                }
                            });

                            }, 2000);
                        }

                        else
                        {
                            setTimeout(function () {
                                $.ajax({
                                    url: ObtenerUrl('Institucion'),
                                    type: "DELETE",
                                    data: ko.toJSON({ Id: idInstitucionP }),
                                    contentType: "application/json",
                                    dataType: "json",
                                    success: function (dataF) {
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
                                                EnviarMensajeSignalR('Se ha eliminado una institución.', "ListarInstitucion.html", "2", sessionStorage.getItem("RolId"), dataF);
                                                window.location.href = "ListarInstitucion.html";
                                            } else {
                                                swal("Cancelled", "Your imaginary file is safe :)", "error");
                                            }
                                        });
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
                            }, 2000);
                        }
                  
                }
                else
                {
                    window.location.href = "ListarInstitucion.html";
                }
            });
        }

    }
    else {
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
                                    elem = document.getElementById('principal');
                                    ko.cleanNode(elem);
                                    ko.applyBindings(new InstitucionViewModel(data, dataR, dataCC, self.roles), elem);

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

                        self.onChangeInstitucion = function () {
                            var nombreUsuario = $("#txtNombreUsuario").val();

                            $.ajax({
                                url: ObtenerUrl('Institucion'),
                                type: "POST",
                                data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), BuscarId: nombreUsuario }),
                                contentType: "application/json",
                                dataType: "json",
                                success: function (usuario) {
                                    //// ok
                                    if (usuario != undefined) {
                                        if (usuario.length == 1) {
                                            swal({
                                                title: "Existe",
                                                text: "Esta Intitución ya existe intente con otra",
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
                    elem = document.getElementById('principal');
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

        self.onChangeUsuario = function () {
            var nombreUsuario = $("#txtNombreUsuario").val();

            $.ajax({
                url: ObtenerUrl('Institucion'),
                type: "POST",
                data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), BuscarId: nombreUsuario }),
                contentType: "application/json",
                dataType: "json",
                success: function (usuario) {
                    //// ok
                    if (usuario != undefined) {
                        if (usuario.length == 1) {
                            swal({
                                title: "Existe",
                                text: "Este usuario ya existe intente con otro",
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
    }

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
