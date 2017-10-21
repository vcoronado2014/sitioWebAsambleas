﻿$(document).ready(function () {

    $('[data-toggle="tooltip"]').tooltip();
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

    //manejo de las fechas
/*    $("#txtFechaInicio").datepicker({
        dateFormat: "dd-mm-yyyy",
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
        dateFormat: "dd-mm-yyyy",
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
    });*/

    $('[data-toggle="tooltip"]').tooltip();

    //$("#tablaArchivos").DataTable({});

    function VotacionViewModel(data, dataR, dataT, dataU) {
        var self = this;
        //self.people = ko.observableArray([]);
        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
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
        self.frmFechaCreacion = ko.observable("");

        self.usuarios  = ko.observableArray(dataU);


        self.details = ko.observable("Pinche aquí para abrir");
        self.frmIdQuorumMinimo = ko.observable("");
        /*
        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);
    */

        Menu();

        var items = [];

        var itemsProcesar = dataR;

        if (itemsProcesar != null) {
            if (itemsProcesar.proposals != null) {


                for (var i in itemsProcesar.proposals) {
                    var s = {
                        NombreCompleto: itemsProcesar.proposals[i].NombreCompleto,
                        Url: itemsProcesar.proposals[i].Url,
                        UrlEliminar: itemsProcesar.proposals[i].UrlEliminar
                    }
                    items[i] = s;
                }
            }
        }

        self.items = ko.observableArray(items);

        var itemsT = [];

        var itemsProcesarT = dataT;

        if (itemsProcesarT != null) {
            if (itemsProcesarT.proposals != null) {

                for (var i in itemsProcesarT.proposals) {
                    var s = {
                        NombreCompleto: itemsProcesarT.proposals[i].NombreUsuario,
                        Url: itemsProcesarT.proposals[i].Url,
                        UrlEliminar: itemsProcesarT.proposals[i].UrlEliminar,
                        Objetivo: itemsProcesarT.proposals[i].NombreCompleto
                    }
                    itemsT[i] = s;
                }
            }
        }

        self.itemsT = ko.observableArray(itemsT);



        guardar = function () {
            if (validar($("#txtNombreUsuario").val(), $("#txtObjetivo").val(), $("#txtFechaInicio").val(), $("#txtFechaTermino").val(), $("#selectIdUsuario").val()))
            {
                var nombre = $("#txtNombreUsuario").val();
                var objetivo = $("#txtObjetivo").val();
                var fechaInicio = $("#txtFechaInicio").val();
                var fechaTermino = $("#txtFechaTermino").val();
                var usuIdResponsable = $("#selectIdUsuario").val();
                var quorumMinimo = $("#selectIdQuorum").val();
                var tricel = {
                    Nombre: nombre,
                    Objetivo: objetivo,
                    FechaInicio : InvertirFechaStr(fechaInicio),
                    FechaTermino: InvertirFechaStr(fechaTermino),
                    IdUsuario: sessionStorage.getItem("Id"),
                    InstId: sessionStorage.getItem("InstId"),
                    UsuIdResponsable: usuIdResponsable,
                    QuorumMinimo: quorumMinimo,
                    Id: getParameterByName('id'),
                    EsCpas: sessionStorage.getItem("ES_CPAS")
                };

                $.ajax({
                    url: ObtenerUrlDos('Votacion'),
                    type: "PUT",
                    data: ko.toJSON(tricel),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (result) {
                        //TODO OK INFORMAR EL GUARDADO CORRECTO
                        var idRecuperado = 0;
                        var eliminado = getParameterByName('ELIMINAR');
                        if (result != null)
                            idRecuperado = result.Id;


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
                                    //CrearModificarVotacion.html?id=3&ELIMINAR=0
                                    EnviarMensajeSignalR('Se ha creado/modificado un Tricel.', "ListarVotacion.html", "4", sessionStorage.getItem("RolId"), result);
                                    window.location.href = "CrearModificarVotacion.html?id=" + idRecuperado + "&ELIMINAR=0";
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
        guardarArchivo = function () {
            var id = getParameterByName('id');
            var eliminado = getParameterByName('ELIMINAR');

            if (id != "0") {

                var files = $("#txtArchivo").get(0).files;

                extensiones_permitidas = new Array(".gif", ".jpg", ".doc", ".pdf", ".xls", ".xlsx", ".docx", ".png");

                if (ValidaExtension(files[0], extensiones_permitidas) == true) {


                    var model = new FormData();
                    model.append("TriId", id);
                    model.append("UploadedImage", files[0]);


                    swal({
                        title: "Subir",
                        text: "¿Está seguro de subir este archivo?",
                        type: "info",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        customClass: 'sweetalert-xs',
                        showLoaderOnConfirm: true
                    }, function (isConfirm) {
                        if (isConfirm) {


                            setTimeout(function () {

                                $.ajax({
                                    url: ObtenerUrl('ArchivoTricel'),
                                    type: 'POST',
                                    dataType: 'json',
                                    data: model,
                                    processData: false,
                                    contentType: false,// not json
                                    complete: function (data) {

                                        swal({
                                                title: "Guardado",
                                                text: "El Registro ha sido guardado con éxito.",
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
                                                    EnviarMensajeSignalR('Se ha subido un archivo a un Tricel.', "ListarVotacion.html", "4", sessionStorage.getItem("RolId"), data);
                                                    window.location.href = "CrearModificarVotacion.html?id=" + id + "&ELIMINAR=" + eliminado;


                                                } else {
                                                    swal("Cancelled", "Your imaginary file is safe :)", "error");
                                                }
                                            });

                                    }
                                });

                            }, 2000);

                        }
                        else {
                            window.location.href = "ListarVotacion.html";
                        }
                    });
                }
            }
            else
            {
                getNotify('error', 'Guardar', 'Debe Guardar antes de agregar un archivo.');
            }



        }

        crearLista = function(){
            var id = getParameterByName('id');
            if (id != "0") {
                window.location.href = "CrearModificarListaTricel.html?id=0&ELIMINAR=0&triId=" + id;
            }
            else
            {
                getNotify('error', 'Guardar', 'Debe Guardar antes de crear una Lista.');
            }
        }

    }

    var id = getParameterByName('id');
    var elimina = getParameterByName('ELIMINAR');
    if (id > 0) {


        $.ajax({
            url: ObtenerUrlDos('Votacion'),
            type: "POST",
            data: ko.toJSON({ BuscarId: id, InstId: sessionStorage.getItem("InstId") }),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                // ok
                var fIniMoment = moment(EntregaFechaDate(data.proposals[0].OtroUno));
                var fTerMoment = moment(EntregaFechaDate(data.proposals[0].OtroDos));
                self.frmNombre = data.proposals[0].NombreUsuario;
                self.frmObjetivo = data.proposals[0].NombreCompleto;
                //self.frmFechaInicio = moment(data.proposals[0].OtroUno).format("MM-DD-YYYY");
                //self.frmFechaInicio = data.proposals[0].OtroUno;
                self.frmFechaInicio = moment(fIniMoment, 'America/New_York').local().format('YYYY-MM-DD');
                //self.frmFechaTermino = data.proposals[0].OtroDos;
                self.frmFechaTermino = moment(fTerMoment, 'America/New_York').local().format('YYYY-MM-DD');
                self.frmFechaCreacion = data.proposals[0].OtroTres;

                frmIdResponsable = ko.observable(parseInt(data.proposals[0].OtroOcho));
                self.details= "Pinche aqui para abrir";
                self.frmIdQuorumMinimo = data.proposals[0].OtroDiez;


                //ko.applyBindings(new VotacionViewModel(data), self.elem);

               cargarGrilla(data);

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
            $("#selectIdUsuario").attr('disabled', 'disabled');
            $("#selectIdQuorum").attr('disabled', 'disabled');

            swal({
                title: "Eliminar",
                text: "¿Está seguro de eliminar a este Tricel?, se eliminarán las Listas y Archivos asociados.",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    

                        setTimeout(function () {

                            $.ajax({
                                url: ObtenerUrlDos('Votacion'),
                                type: "DELETE",
                                data: ko.toJSON({ Id: id, EsCpas: sessionStorage.getItem("ES_CPAS") }),
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
                                            EnviarMensajeSignalR('Se ha eliminado un Tricel.', "ListarVotacion.html", "4", sessionStorage.getItem("RolId"), dataF);
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
        var dataR = [];
        var dataT = [];

        $.ajax({
            url: ObtenerUrlDos('ResponsableTricel'),
            type: "POST",
            data: ko.toJSON({InstId: sessionStorage.getItem("InstId")}),
            contentType: "application/json",
            dataType: "json",
            success: function (dataU) {
                // ok
                self.usuarios = dataU;
                //selectedUsuario = frmIdResponsable;
                selectedUsuario = 0;

                elem = document.getElementById('principal');

                ko.cleanNode(elem);

                ko.applyBindings(new VotacionViewModel(data, dataR, dataT, dataU), elem);

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


    function cargarGrilla(data)
    {
        //items([]);

        var url = ObtenerUrl('ArchivoTricel') + "?TricelId=" + id;

        $.ajax({
            url: url,
            type: "GET",
            success: function (dataR) {
                // ok
                $.ajax({
                    url: ObtenerUrl('ListaTricel'),
                    type: "POST",
                    data: ko.toJSON({TriId: id}),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (dataT) {
                        // ok

                        $.ajax({
                            url: ObtenerUrlDos('ResponsableTricel'),
                            type: "POST",
                            data: ko.toJSON({InstId: sessionStorage.getItem("InstId")}),
                            contentType: "application/json",
                            dataType: "json",
                            success: function (dataU) {
                                // ok
                                self.usuarios = dataU;

                                frmIdResponsable = ko.observable(parseInt(data.proposals[0].OtroOcho));
                                selectedUsuario = parseInt(data.proposals[0].OtroOcho);

                                elem = document.getElementById('principal');

                                ko.cleanNode(elem);

                                ko.applyBindings(new VotacionViewModel(data, dataR, dataT), elem);

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
    }

    function validar(NombreUsuario, Objetivo, FechaInicio, FechaTermino, IdUsuarioResponsable) {
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
        if (IdUsuarioResponsable === '0' || IdUsuarioResponsable === null) {
            getNotify('error', 'Requerido', 'Usuario Responsable Requerido.');
            retorno = false;
        }
        //validamos fecha de inicio y termino
        var fechaIniMoment = moment(FechaInicio);
        var fechaTerMoment = moment(FechaTermino);
        var fechaAhoraMoment = moment(new Date());
        //fecha termino menor a la de inicio
        if (fechaTerMoment < fechaIniMoment){
            getNotify('error', 'Fechas', 'La fecha de término no puede ser menor a la de inicio.');
            retorno = false;
        }
        //fecha termino menor a la actual
        if (fechaTerMoment < fechaAhoraMoment){
            getNotify('error', 'Fechas', 'No se puede crear un tricel con fecha término anterior a la actual.');
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
function CerrarIniciar(){
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
}