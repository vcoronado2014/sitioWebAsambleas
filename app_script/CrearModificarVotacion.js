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
    function VotacionViewModel(data, dataR) {
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

        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);


        var items = [];

        var itemsProcesar = dataR;

        if (itemsProcesar != null && itemsProcesar.proposals.length > 0) {
            for (var i in itemsProcesar.proposals) {
                var s = {
                    NombreCompleto: itemsProcesar.proposals[i].NombreCompleto
                }
                items[i] = s;
            }
        }

        self.items = ko.observableArray(items);
        //self.items = ko.observableArray(ko.mapping.fromJS(items));


        /*
        if (dataR != null) {
            //self.items = ko.observableArray(dataR); // <-------
            self.items = ko.observableArray(ko.mapping.fromJS(dataR.proposals));
        } else {
            self.items = ko.observableArray();
        }
*/
        //ko.mapping.fromJS(items, {}, self);

        guardar = function () {
            if (validar($("#txtNombreUsuario").val(), $("#txtObjetivo").val(), $("#txtFechaInicio").val(), $("#txtFechaTermino").val()))
            {
                var nombre = $("#txtNombreUsuario").val();
                var objetivo = $("#txtObjetivo").val();
                var fechaInicio = $("#txtFechaInicio").val();
                var fechaTermino = $("#txtFechaTermino").val();
                var tricel = {
                    Nombre: nombre,
                    Objetivo: objetivo,
                    FechaInicio : fechaInicio,
                    FechaTermino: fechaTermino,
                    IdUsuario: sessionStorage.getItem("Id"),
                    InstId: sessionStorage.getItem("InstId"),
                    Id: getParameterByName('id')
                };

                $.ajax({
                    url: ObtenerUrl('Votacion'),
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
                                    window.location.href = "ListarVotacion.html";
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
            window.location.href = "ListarVotacion.html";

        }
    }

    var id = getParameterByName('id');
    var elimina = getParameterByName('ELIMINAR');
    if (id > 0) {


        $.ajax({
            url: ObtenerUrl('Votacion'),
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

                //ko.applyBindings(new VotacionViewModel(data), self.elem);

                var url = ObtenerUrl('ArchivoTricel') + "?TricelId=" + id;

                $.ajax({
                    url: url,
                    type: "GET",
                    success: function (dataR) {
                        // ok

                        elem = document.getElementById('principal');

                        //var element = $('#principal')[0];
                        //ko.cleanNode(element);

                        ko.applyBindings(new VotacionViewModel(data, dataR), elem);

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


            swal({
                title: "Eliminar",
                text: "¿Está seguro de eliminar a este Tricel?",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    

                        setTimeout(function () {

                            $.ajax({
                                url: ObtenerUrl('Votacion'),
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
                                            window.location.href = "ListarVotacion.html";
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
                    window.location.href = "ListarVotacion.html";
                }
            });

        }
    }
    else {
        $("#txtNombreUsuario").removeAttr('disabled');
        var data = [];

        ko.applyBindings(new VotacionViewModel(data), self.elem);


    }

    function validar(NombreUsuario, Objetivo, FechaInicio, FechaTermino) {
        var retorno = true;
        if (NombreUsuario === '' || NombreUsuario === null || NombreUsuario === undefined) {
            getNotify('error', 'Requerido', 'Nombre Requerido.');
            retorno = false;
        }
        if (Objetivo === '' || Objetivo === null) {
            getNotify('error', 'Requerido', 'Objetivo Requerido.');
            retorno = false;
        }
        if (FechaInicio === '' || FechaInicio === null) {
            getNotify('error', 'Requerido', 'Fecha Inicio Requerida.');
            retorno = false;
        }
        if (FechaTermino === '' || FechaTermino === null) {
            getNotify('error', 'Requerido', 'Fecha Término Requerida.');
            retorno = false;
        }
        //comparacion de fechas, basicamente la fecha de termino no puede ser menor
        //a la fecha de inicio
        //y la fecha de inicio y termino no pueden ser menor a la fecha actual
        /*
        var ahora = moment();
        var inicio = moment(FechaInicio);
        var termino = moment(FechaTermino);
        //primero la diferencia entre el inicio y el termino
        if (inicio.diff(termino) <= 0)
        {
            getNotify('error', 'Fechas', 'Fecha de término no puede ser mayor a la deinicio.');
            retorno = false;
        }
        if (ahora.diff(inicio) <= 0 && ahora.diff(termino) <=0)
        {
            getNotify('error', 'Fechas', 'Fecha de inicio y término no pueden ser menor a la actual.');
            retorno = false;
        }
        */
        return retorno;
    }




});
function Volver() {
    window.location.href = "inicio.html";
}
function buscar(regId) {
    alert(regId);
}
