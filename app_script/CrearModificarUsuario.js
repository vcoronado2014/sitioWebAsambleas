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

            if (sessionStorage.getItem("ES_CPAS_1") == "true")
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
            if (sessionStorage.getItem("ES_CPAS_1") == "true")
            {
                window.location.href = 'indexcpas.html';
            }
            else
            {
                window.location.href = 'index.html';
            }
        }


    });

    function PersonViewModel(data, dataR, dataC, dataF, dataI) {
        var self = this;
        //self.people = ko.observableArray([]);
        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        self.idUsuario = getParameterByName('idUsuario');
        self.comunas = ko.observableArray(dataC);
        self.regiones = ko.observableArray(dataR);
        self.roles = ko.observableArray(dataF);


        //agregadas las instituciones ***********************
        self.instituciones = ko.observableArray(dataI.proposals);
        //***************************************************
        self.elem = document.getElementById('principal');
        //self.nombreUsuario = ko.observable(sessionStorage.getItem("NombreUsuario"));

        //del formulario
        self.frmNombreUsuario = ko.observable("");
        self.frmNombres = ko.observable("");
        self.frmApellidoPaterno = ko.observable("");
        self.frmApellidoMaterno = ko.observable("");
        self.frmRut = ko.observable("");
        self.frmTelefono = ko.observable("");
        self.frmCorreoElectronico = ko.observable("");
        //self.frmIdRegion = ko.observable();
        //self.frmIdComuna = ko.observable();
        self.frmDireccion = ko.observable("");
        self.frmIdRol = ko.observable("");
        self.frmPassword = ko.observable("");
        self.frmNuevaPassword = ko.observable("");
        //self.frmNuevaPassword = self.frmPassword;

        /*
        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);
        */

        Menu();

        guardar = function () {
            //acá hay que validar todo!!
            if (validar($("#txtNombreUsuario").val(), $("#txtNombres").val(), $("#txtPrimerApellido").val(), $("#txtRut").val(), $("#txtCorreo").val(), $("#txtTelefono").val(), $("#selectIdComuna").val(), $("#txtPassword").val(), $("#txtNuevaPassword").val(), $("#selectInstitucion").val()))
            {
                if (Rut(frmRut) && validarEmail(frmCorreoElectronico))
                {
                    var idRegion = $("#selectIdRegion").val();
                    var idUsuario = getParameterByName('idUsuario');
                    var idComuna = $("#selectIdComuna").val();
                    var idRol = $("#selectIdRol").val();
                    //var instId = sessionStorage.getItem("InstId");
                    var instId = $("#selectInstitucion").val();
                    //**********************************************
                    var pass = $("#txtPassword").val();
                    var nuevaPass = $("#txtNuevaPassword").val()
                    if (pass != nuevaPass)
                    {
                        frmPassword = '';
                        frmNuevaPassword = '';
                    }
                    //ahora se podría guardar
                    var usuario = {
                        Id: idUsuario,
                        NombreUsuario: frmNombreUsuario,
                        Nombres: frmNombres,
                        PrimerApellido: frmApellidoPaterno,
                        SegundoApellido: $("#txtSegundoApellido").val(),
                        Rut: frmRut,
                        Correo: frmCorreoElectronico,
                        Telefono: frmTelefono,
                        IdRegion: idRegion,
                        IdComuna: idComuna,
                        Direccion: frmDireccion,
                        IdRol: idRol,
                        Password: pass,
                        InstId: instId,
                        NuevaPassword: nuevaPass
                    };
                    $.ajax({
                        url: ObtenerUrl('ObtenerUsuario'),
                        type: "PUT",
                        data: ko.toJSON(usuario),
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
                                    EnviarMensajeSignalR('Se ha creado/modificado un usuario.', "usuarios.html", "4", sessionStorage.getItem("RolId"), result);
                                    window.location.href = "usuarios.html";
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
        cancelar = function (){
            window.location.href = "usuarios.html";

        }
    }
    var idUsuario = getParameterByName('idUsuario');
    var elimina = getParameterByName('ELIMINADO');
    if (idUsuario > 0) {



        var obtenerUsuario = jQuery.ajax({
            url : ObtenerUrl('ObtenerUsuario'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: ko.toJSON({ IdUsuario: getParameterByName('idUsuario') })
        });


        var obtenerRegiones = jQuery.ajax({
            url : ObtenerUrl('ObtenerRegiones'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: ko.toJSON({ InstId: 90 })
        });


        var obtenerRoles = jQuery.ajax({
            url : ObtenerUrl('ObtenerRoles'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: ko.toJSON({ InstId: 90 })
        });

        var obtenerInstitucion = jQuery.ajax({
            url : ObtenerUrl('Institucion'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: ko.toJSON({ IdUsuario: 9 })
        });

        $.when(obtenerUsuario, obtenerRegiones, obtenerRoles, obtenerInstitucion).then(
            function(data, dataR, dataF, dataI){

                elem = document.getElementById('principal');

                frmIdRegion = ko.observable(data[0].Region.Id);

                self.frmNombreUsuario = data[0].AutentificacionUsuario.NombreUsuario;
                self.frmNombres = data[0].Persona.Nombres;
                self.frmApellidoPaterno = data[0].Persona.ApellidoPaterno;
                self.frmApellidoMaterno = data[0].Persona.ApellidoMaterno;
                self.frmRut = data[0].Persona.Rut;
                self.frmTelefono = data[0].Persona.Telefonos;
                self.frmCorreoElectronico = data[0].AutentificacionUsuario.CorreoElectronico;
                //self.frmIdRegion = data.Region.Id;
                frmIdComuna = ko.observable(data[0].Comuna.Id);
                self.frmDireccion = data[0].Persona.DireccionCompleta;
                self.frmIdRol = data[0].Rol.Id;
                //************* agregado para la institucion *******

                self.frmIdInstitucion = data[0].Institucion.Id;


                var obtenerComunas = jQuery.ajax({
                    url : ObtenerUrl('ObtenerComunas'),
                    type: 'POST',
                    dataType : "json",
                    contentType: "application/json",
                    data: ko.toJSON({ RegId: data[0].Region.Id })
                });

                $.when(obtenerComunas).then(function (dataC)
                    {
                        //regiones
                        if (dataR != null)
                        {
                            self.regiones = dataR[0];
                            selectedRegion = frmIdRegion;
                        }
                        if (dataC != null)
                        {
                            self.comunas = dataC;
                            selectedComuna = frmIdComuna;
                        }
                        if (dataF != null)
                        {
                            self.roles = dataF[0];
                            selectedRol = self.frmIdRol;
                        }
                        if (dataI != null)
                        {
                            self.instituciones = dataI[0].proposals;
                            selectedInstitucion = self.frmIdInstitucion;
                        }

                        ko.applyBindings(new PersonViewModel(data[0], dataR[0], dataC, dataF[0], dataI[0]), self.elem);

                    },
                    function (){
                        //alguna ha fallado
                        alert('error');
                    },
                    function(){
                        //acá podemos quitar el elemento cargando
                        alert('quitar cargando');
                    }


                );
                self.onChange = function () {
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

                            elem = document.getElementById('principal');
                            ko.cleanNode(elem);
                            ko.applyBindings(new PersonViewModel(data[0], dataR[0], dataCC, self.roles, dataI[0]), elem);

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
                        url: ObtenerUrl('ListarUsuarios'),
                        type: "POST",
                        data: ko.toJSON({ InstId: $("#selectInstitucion").val(), BuscarId: nombreUsuario }),
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
            function (){
                //alguna ha fallado
                alert('error');
            },
            function(){
                //acá podemos quitar el elemento cargando
                alert('quitar cargando');
            }
        );




        /******************

        $.ajax({
            url: ObtenerUrl('ObtenerUsuario'),
            type: "POST",
            data: ko.toJSON({ IdUsuario: getParameterByName('idUsuario') }),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                // ok

                
                frmIdRegion = ko.observable(data.Region.Id);
                

                self.frmNombreUsuario = data.AutentificacionUsuario.NombreUsuario;
                self.frmNombres = data.Persona.Nombres;
                self.frmApellidoPaterno = data.Persona.ApellidoPaterno;
                self.frmApellidoMaterno = data.Persona.ApellidoMaterno;
                self.frmRut = data.Persona.Rut;
                self.frmTelefono = data.Persona.Telefonos;
                self.frmCorreoElectronico = data.AutentificacionUsuario.CorreoElectronico;
                //self.frmIdRegion = data.Region.Id;
                frmIdComuna = ko.observable(data.Comuna.Id);
                self.frmDireccion = data.Persona.DireccionCompleta;
                self.frmIdRol = data.Rol.Id;
                //************* agregado para la institucion *******

                self.frmIdInstitucion = data.Institucion.Id;
                //************************************
                //self.frmPassword = data.AutentificacionUsuario.Password;
                //self.frmNuevaPassword = frmPassword;

                getNotify('success', 'Éxito', 'Recuperado con éxito!');
                //desactivamos el nombre usuario
                //  $("txtNombreUsuario").prop('disabled', true);

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
                                        //aca la ultima llamada para obtener las instituciones

                                        //ko.applyBindings(new PersonViewModel(data, dataR, dataC, dataF), self.elem);

                                        $.ajax({
                                            url: ObtenerUrl('Institucion'),
                                            type: "POST",
                                            data: ko.toJSON({ IdUsuario: 9 }),
                                            contentType: "application/json",
                                            dataType: "json",
                                            success: function (dataI) {
                                                //ok
                                                self.instituciones = dataI.proposals;
                                                selectedInstitucion = self.frmIdInstitucion;
                                                //aca la ultima llamada para obtener las instituciones

                                                ko.applyBindings(new PersonViewModel(data, dataR, dataC, dataF, dataI), self.elem);
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
                                            ko.applyBindings(new PersonViewModel(data, dataR, dataCC, self.roles), elem);

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
                                        url: ObtenerUrl('ListarUsuarios'),
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

    *******************/

        if (elimina == 1) {
            //determinar si es el mismo usuario a eliminar

                //bloquear todos los controles y cambiar el nombre del botòn
                $("#selectInstitucion").attr('disabled', 'disabled');
                $("#txtNombres").attr('disabled', 'disabled');
                $("#txtPrimerApellido").attr('disabled', 'disabled');
                $("#txtSegundoApellido").attr('disabled', 'disabled');
                $("#txtRut").attr('disabled', 'disabled');
                $("#txtPassword").attr('disabled', 'disabled');
                $("#txtNuevaPassword").attr('disabled', 'disabled');
                $("#txtNombreUsuario").attr('disabled', 'disabled');
                $("#txtTelefono").attr('disabled', 'disabled');
                $("#txtCorreo").attr('disabled', 'disabled');
                $("#txtDireccion").attr('disabled', 'disabled');
                $("#selectIdRegion").attr('disabled', 'disabled');
                $("#selectIdComuna").attr('disabled', 'disabled');
                $("#selectIdRol").attr('disabled', 'disabled');

                swal({
                    title: "Eliminar",
                    text: "¿Está seguro de eliminar a este Usuario?",
                    type: "info",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    customClass: 'sweetalert-xs',
                    showLoaderOnConfirm: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        if (sessionStorage.getItem("NombreUsuario") == $("#txtNombreUsuario").val()) {

                            setTimeout(function () {

                                swal({
                                    title: "Error",
                                    text: "No se puede eliminar el mismo usuario logueado.",
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
                                    //swal("Deleted!", "Your imaginary file has been deleted.", "success");
                                    window.location.href = "usuarios.html";
                                } else {
                                    swal("Cancelled", "Your imaginary file is safe :)", "error");
                                }
                            });

                            }, 2000);
                        }
                        else {
                            setTimeout(function () {

                                $.ajax({
                                    url: ObtenerUrl('ObtenerUsuario'),
                                    type: "DELETE",
                                    data: ko.toJSON({ IdUsuario: idUsuario }),
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
                                               EnviarMensajeSignalR('Se ha eliminado un usuario.', "usuarios.html", "4", sessionStorage.getItem("RolId"), dataF);
                                               window.location.href = "usuarios.html";
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
                    }
                    else {
                        window.location.href = "usuarios.html";
                    }
                });
            
        }
    }
    else{
        if (sessionStorage.getItem("RolId") == '1') {
            $("#selectInstitucion").removeAttr('disabled');
        }
        else
        {
            $("#selectInstitucion").val(sessionStorage.getItem("InstId"));
        }

        $("#txtNombreUsuario").removeAttr('disabled');
        var data = [];

        var obtenerRegiones = jQuery.ajax({
            url : ObtenerUrl('ObtenerRegiones'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: ko.toJSON({ InstId: 90 })
        });


        var obtenerRoles = jQuery.ajax({
            url : ObtenerUrl('ObtenerRoles'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: ko.toJSON({ InstId: 90 })
        });

        var obtenerInstitucion = jQuery.ajax({
            url : ObtenerUrl('Institucion'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: ko.toJSON({ IdUsuario: 9 })
        });

        $.when(obtenerRegiones, obtenerRoles, obtenerInstitucion).then(
            function(dataR, dataF, dataI){

                elem = document.getElementById('principal');

                var obtenerComunas = jQuery.ajax({
                    url : ObtenerUrl('ObtenerComunas'),
                    type: 'POST',
                    dataType : "json",
                    contentType: "application/json",
                    data: ko.toJSON({ RegId: 13 })
                });

                $.when(obtenerComunas).then(function (dataC)
                    {
                        //regiones
                        if (dataR != null)
                        {
                            self.regiones = dataR[0];
                            selectedRegion = 0;
                        }
                        if (dataC != null)
                        {
                            self.comunas = dataC;
                            selectedComuna = 0;
                        }
                        if (dataF != null)
                        {
                            self.roles = dataF[0];
                            selectedRol = 0;
                        }
                        if (dataI != null)
                        {
                            self.instituciones = dataI[0].proposals;
                            //seteamos la institucion
                            selectedInstitucion = sessionStorage.getItem("InstId");
                        }

                        ko.applyBindings(new PersonViewModel(data, dataR[0], dataC, dataF[0], dataI[0]), self.elem);

                    },
                    function (){
                        //alguna ha fallado
                        alert('error');
                    },
                    function(){
                        //acá podemos quitar el elemento cargando
                        alert('quitar cargando');
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

                            elem = document.getElementById('principal');
                            ko.cleanNode(elem);
                            ko.applyBindings(new PersonViewModel(data[0], dataR[0], dataCC, self.roles, dataI[0]), elem);

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
                        url: ObtenerUrl('ListarUsuarios'),
                        type: "POST",
                        data: ko.toJSON({ InstId: $("#selectInstitucion").val(), BuscarId: nombreUsuario }),
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
            function (){
                //alguna ha fallado
                alert('error');
            },
            function(){
                //acá podemos quitar el elemento cargando
                alert('quitar cargando');
            }
        );


        /*
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

                        $.ajax({
                            url: ObtenerUrl('ObtenerRoles'),
                            type: "POST",
                            data: ko.toJSON({ InstId: 90 }),
                            contentType: "application/json",
                            dataType: "json",
                            success: function (dataF) {
                                //ok
                                self.roles = dataF;
                                selectedRol = 0;
                                //comentado, se agrega nueva llamada

                                //ko.applyBindings(new PersonViewModel(data, dataR, dataC, dataF), self.elem);

                                $.ajax({
                                    url: ObtenerUrl('Institucion'),
                                    type: "POST",
                                    data: ko.toJSON({ IdUsuario: 9 }),
                                    contentType: "application/json",
                                    dataType: "json",
                                    success: function (dataI) {
                                        //ok
                                        self.instituciones = dataI.proposals;
                                        selectedInstitucion = 0;
                                        //comentado, se agrega nueva llamada

                                        ko.applyBindings(new PersonViewModel(data, dataR, dataC, dataF, dataI), self.elem);
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
                                    ko.applyBindings(new PersonViewModel(data, dataR, dataCC, self.roles), elem);

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
                                url: ObtenerUrl('ListarUsuarios'),
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

        */
    }

    function validar(NombreUsuario, Nombres, ApellidoPaterno, Rut, CorreoElectronico, Telefono, IdComuna, Password, NuevaPassword, InstId) {
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
            if (CorreoElectronico === '' || CorreoElectronico === null){
                getNotify('error', 'Requerido', 'Correo Electrónico Requerido.');
                retorno = false;
            }
            if (Telefono === '' || Telefono === null){
                getNotify('error', 'Requerido', 'Teléfono Requerido.');
                retorno = false;
            }
            if (IdComuna === '0' || IdComuna === null) {
                getNotify('error', 'Requerido', 'Comuna Requerida.');
                retorno = false;
            }
            if (InstId === '0' || InstId === null) {
                getNotify('error', 'Requerido', 'Institución Requerida.');
                retorno = false;
            }
            if (Password != '') {
                if (Password.length < 5){
                    getNotify('error', 'Password', 'La password debe contener mínimo 5 caracteres.');
                    retorno = false;
                }
                if (Password != NuevaPassword) {
                    getNotify('error', 'Password', 'Las contraseñas no coinciden.');
                    retorno = false;
                }

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
    function getNotify(type,title, message)
    {
        if (type == 'error')
        {
            new PNotify({
                title: title,
                text: message,
                type: 'error'
            });
        }
        if(type == 'success')
        {
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
