/**
 * Created by VICTOR CORONADO on 18/03/2017.
 */
$(document).ready(function () {

    $('[data-toggle="tooltip"]').tooltip();
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

    $('[data-toggle="tooltip"]').tooltip();

    //$("#tablaArchivos").DataTable({});

    function VotacionViewModel(data, dataT, dataU, dataQ) {
        var self = this;
        //self.people = ko.observableArray([]);
        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        self.idUsuario = getParameterByName('idUsuario');
        self.frmUrlDocumento = ko.observable("");
        self.elem = document.getElementById('principal');

        //del formulario
        self.frmNombre = ko.observable("");
        self.frmObjetivo = ko.observable("");
        self.frmFechaInicio = ko.observable("");
        self.frmFechaTermino = ko.observable("");
        self.frmDescripcion = ko.observable("");
        self.frmBeneficios = ko.observable("");

        self.frmDetalleTricel = ko.observable("");
        self.usuarios  = ko.observableArray(dataU);



        self.details = ko.observable("Pinche aquí para abrir");

        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);


        guardar = function () {
            if (validar($("#txtNombreUsuario").val(), $("#txtObjetivo").val(), $("#txtDescripcion").val(), $("#txtBeneficios").val()))
            {
                var nombre = $("#txtNombreUsuario").val();
                var objetivo = $("#txtObjetivo").val();
                var fechaInicio = $("#txtFechaInicio").val();
                var fechaTermino = $("#txtFechaTermino").val();
                var descripcion = $("#txtDescripcion").val();
                var beneficios = $("#txtBeneficios").val();
                var triId = getParameterByName('triId');

                var usuIdPresidente = $("#selectIdUsuario").val();
                var usuIdVice = $("#selectIdVice").val();
                var usuIdSecretario = $("#selectIdSecretario").val();
                var usuIdTesorero = $("#selectIdTesorero").val();
                var usuIdOtroUno = $("#selectIdOtroUno").val();
                var usuIdOtroDos = $("#selectIdOtroDos").val();
                var usuIdOtroTres = $("#selectIdOtroTres").val();
                var usuIdOtroCuatro = $("#selectIdOtroCuatro").val();
                var usuIdOtroCinco = $("#selectIdOtroCinco").val();

                var tricel = {
                    Nombre: nombre,
                    Objetivo: objetivo,
                    FechaInicio : fechaInicio,
                    FechaTermino: fechaTermino,
                    IdUsuario: sessionStorage.getItem("Id"),
                    InstId: sessionStorage.getItem("InstId"),
                    Id: getParameterByName('id'),
                    Descripcion: descripcion,
                    TriId: triId,
                    RolId: sessionStorage.getItem("RolId"),
                    Beneficios: beneficios,
                    UsuIdPresidente: usuIdPresidente,
                    UsuIdVice: usuIdVice,
                    UsuIdSecretario: usuIdSecretario,
                    UsuIdTesorero: usuIdTesorero,
                    UsuIdOtroUno: usuIdOtroUno,
                    UsuIdOtroDos: usuIdOtroDos,
                    UsuIdOtroTres: usuIdOtroTres,
                    UsuIdOtroCuatro: usuIdOtroCuatro,
                    UsuIdOtroCinco: usuIdOtroCinco
                };

                $.ajax({
                    url: ObtenerUrl('ListaTricel'),
                    type: "PUT",
                    data: ko.toJSON(tricel),
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
                                    var id = getParameterByName('id');
                                    var triId = getParameterByName('triId');
                                    window.location.href = "CrearModificarVotacion.html?id=" + triId + "&ELIMINAR=0";

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


        cancelar = function () {
            //CrearModificarVotacion.html?id=2&ELIMINAR=0
            var id = getParameterByName('id');
            var triId = getParameterByName('triId');
            window.location.href = "CrearModificarVotacion.html?id=" + triId + "&ELIMINAR=0";

        }

    }

    var id = getParameterByName('id');
    var elimina = getParameterByName('ELIMINAR');
    var triId = getParameterByName('triId');

    if (id > 0) {


        $.ajax({
            url: ObtenerUrlDos('Votacion'),
            type: "POST",
            data: ko.toJSON({ BuscarId: triId, InstId: sessionStorage.getItem("InstId") }),
            contentType: "application/json",
            dataType: "json",
            success: function (dataT) {
                // ok
                var detalle = "Nombre del Tricel " + dataT.proposals[0].NombreUsuario + " --- Objetivo del Tricel: " + dataT.proposals[0].NombreCompleto;
                self.frmDetalleTricel = detalle;
                self.frmFechaInicio = dataT.proposals[0].OtroUno;
                self.frmFechaTermino = dataT.proposals[0].OtroDos;

                $.ajax({
                    url: ObtenerUrl('ListaTricel'),
                    type: "POST",
                    data: ko.toJSON({ BuscarId: id, TriId: 0 }),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {
                        // ok

                        self.frmNombre = data.proposals[0].NombreUsuario;
                        self.frmObjetivo = data.proposals[0].NombreCompleto;
                        self.frmDescripcion = data.proposals[0].OtroTres;
                        self.frmBeneficios = data.proposals[0].OtroCuatro;
                        self.frmDetalleTricel = data.proposals[0].OtroCinco;


                        self.details= "Pinche aqui para abrir";

                        $.ajax({
                            url: ObtenerUrlDos('ResponsableTricel'),
                            type: "POST",
                            data: ko.toJSON({InstId: sessionStorage.getItem("InstId")}),
                            contentType: "application/json",
                            dataType: "json",
                            success: function (dataU) {
                                // ok
                                self.usuarios = dataU;

                                $.ajax({
                                    url: ObtenerUrlDos('UsuarioLista'),
                                    type: "POST",
                                    data: ko.toJSON({LtrId: id}),
                                    contentType: "application/json",
                                    dataType: "json",
                                    success: function (dataQ) {
                                        // ok
                                        frmUsuarioPresidente = ko.observable(parseInt(dataQ.UsuIdPresidente));
                                        frmUsuarioSecretario = ko.observable(parseInt(dataQ.UsuIdSecretario));
                                        frmUsuarioVicePresidente = ko.observable(parseInt(dataQ.UsuIdVicepresidente));
                                        frmUsuarioTesorero = ko.observable(parseInt(dataQ.UsuIdTesorero));
                                        frmUsuarioOtroUno = ko.observable(parseInt(dataQ.UsuIdOtroUno));
                                        frmUsuarioOtroDos = ko.observable(parseInt(dataQ.UsuIdOtroDos));
                                        frmUsuarioOtroTres = ko.observable(parseInt(dataQ.UsuIdOtroTres));
                                        frmUsuarioOtroCuatro = ko.observable(parseInt(dataQ.UsuIdOtroCuatro));
                                        frmUsuarioOtroCinco = ko.observable(parseInt(dataQ.UsuIdOtroCinco));

                                        selectedUsuarioPresidente = frmUsuarioPresidente;
                                        selectedUsuarioVicePresidente = frmUsuarioVicePresidente;
                                        selectedUsuarioSecretario = frmUsuarioSecretario;
                                        selectedUsuarioTesorero = frmUsuarioTesorero;
                                        selectedUsuarioOtroUno = frmUsuarioOtroUno;
                                        selectedUsuarioOtroDos = frmUsuarioOtroDos;
                                        selectedUsuarioOtroTres = frmUsuarioOtroTres;
                                        selectedUsuarioOtroCuatro = frmUsuarioOtroCuatro;
                                        selectedUsuarioOtroCinco = frmUsuarioOtroCinco;

                                        elem = document.getElementById('principal');

                                        ko.cleanNode(elem);

                                        ko.applyBindings(new VotacionViewModel(data, dataT, dataU, dataQ), elem);

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


                        //ko.applyBindings(new VotacionViewModel(data, dataT), self.elem);



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



        if (elimina == 1) {
            //determinar si es el mismo usuario a eliminar

            //bloquear todos los controles y cambiar el nombre del botòn
            $("#txtFechaTermino").attr('disabled', 'disabled');
            $("#txtFechaInicio").attr('disabled', 'disabled');
            $("#txtObjetivo").attr('disabled', 'disabled');
            $("#txtNombreUsuario").attr('disabled', 'disabled');
            $("#txtDescripcion").attr('disabled', 'disabled');
            $("#txtBeneficios").attr('disabled', 'disabled');

            $("#selectIdUsuario").attr('disabled', 'disabled');
            $("#selectIdVice").attr('disabled', 'disabled');
            $("#selectIdSecretario").attr('disabled', 'disabled');
            $("#selectIdTesorero").attr('disabled', 'disabled');
            $("#selectIdOtroUno").attr('disabled', 'disabled');
            $("#selectIdOtroDos").attr('disabled', 'disabled');
            $("#selectIdOtroTres").attr('disabled', 'disabled');
            $("#selectIdOtroCuatro").attr('disabled', 'disabled');
            $("#selectIdOtroCinco").attr('disabled', 'disabled');

            swal({
                title: "Eliminar",
                text: "¿Está seguro de eliminar a esta Lista Tricel?.",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {


                    setTimeout(function () {

                        $.ajax({
                            url: ObtenerUrl('ListaTricel'),
                            type: "DELETE",
                            data: ko.toJSON({ Id: getParameterByName('id') }),
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
                                            var id = getParameterByName('id');
                                            var triId = getParameterByName('triId');
                                            window.location.href = "CrearModificarVotacion.html?id=" + triId + "&ELIMINAR=0";
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
                    var id = getParameterByName('id');
                    var triId = getParameterByName('triId');
                    window.location.href = "CrearModificarVotacion.html?id=" + triId + "&ELIMINAR=0";
                }
            });

        }
    }
    else {
        $("#txtNombreUsuario").removeAttr('disabled');
        var data = [];

        $.ajax({
            url: ObtenerUrlDos('Votacion'),
            type: "POST",
            data: ko.toJSON({ BuscarId: triId, InstId: sessionStorage.getItem("InstId") }),
            contentType: "application/json",
            dataType: "json",
            success: function (dataT) {
                // ok
                var detalle = "Nombre del Tricel " + dataT.proposals[0].NombreUsuario + " --- Objetivo del Tricel: " + dataT.proposals[0].NombreCompleto;
                self.frmDetalleTricel = detalle;
                self.frmFechaInicio = dataT.proposals[0].OtroUno;
                self.frmFechaTermino = dataT.proposals[0].OtroDos;
                self.details= "Pinche aqui para abrir";


                $.ajax({
                    url: ObtenerUrlDos('ResponsableTricel'),
                    type: "POST",
                    data: ko.toJSON({InstId: sessionStorage.getItem("InstId")}),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (dataU) {
                        // ok
                        self.usuarios = dataU;

                        $.ajax({
                            url: ObtenerUrlDos('UsuarioLista'),
                            type: "POST",
                            data: ko.toJSON({LtrId: 0}),
                            contentType: "application/json",
                            dataType: "json",
                            success: function (dataQ) {
                                // ok

                                selectedUsuarioPresidente = 0;
                                selectedUsuarioVicePresidente = 0;
                                selectedUsuarioSecretario = 0;
                                selectedUsuarioTesorero = 0;
                                selectedUsuarioOtroUno = 0;
                                selectedUsuarioOtroDos = 0;
                                selectedUsuarioOtroTres = 0;
                                selectedUsuarioOtroCuatro = 0;
                                selectedUsuarioOtroCinco = 0;

                                elem = document.getElementById('principal');

                                ko.cleanNode(elem);

                                ko.applyBindings(new VotacionViewModel(data, dataT, dataU, dataQ), elem);

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
                //ko.applyBindings(new VotacionViewModel(data, dataT), self.elem);

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


    function validar(NombreUsuario, Objetivo, Descripcion, Beneficios) {
        var retorno = true;
        if (NombreUsuario === '' || NombreUsuario === null || NombreUsuario === undefined) {
            getNotify('error', 'Requerido', 'Nombre Requerido.');
            retorno = false;
        }
        if (Objetivo === '' || Objetivo === null) {
            getNotify('error', 'Requerido', 'Objetivo Requerido.');
            retorno = false;
        }
        if (Descripcion === '' || Descripcion === null) {
            getNotify('error', 'Requerido', 'Descripción Requerido.');
            retorno = false;
        }
        if (Beneficios === '' || Beneficios === null) {
            getNotify('error', 'Requerido', 'Descripción Requerido.');
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
