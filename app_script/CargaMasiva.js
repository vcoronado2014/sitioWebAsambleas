/**
 * Created by vcoronado on 11-05-2017.
 */
$(document).ready(function () {


    $('#principal').hide();
    $('#loading').show();

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

    $('[data-toggle="tooltip"]').tooltip()

    function DocumentoViewModel(data) {
        var self = this;
        //self.people = ko.observableArray([]);
        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        self.idUsuario = getParameterByName('idUsuario');

        self.elem = document.getElementById('principal');

        if (data != null && data.proposals.length > 0){
            for(var i in data.proposals){
                data.proposals[i].OtroSeis = 'detallecarga.html?FECHA_SUBIDA=' + data.proposals[i].NombreUsuario +
                    '&NOMBRE_ARCHIVO=' + data.proposals[i].NombreCompleto + '&TOTAL_FILAS=' + data.proposals[i].OtroCuatro +
                    '&FILAS_ERROR=' + data.proposals[i].OtroDos + '&FILAS_CORRECTAS='+ data.proposals[i].OtroUno +
                    '&ID=' + data.proposals[i].Id;
                data.proposals[i].OtroOcho = ObtenerUrlDescargaExcel(data.proposals[i].NombreCompleto);
            }
        }

        //solo los super Administradores
        if (sessionStorage.getItem("RolId") == '1') {
            $("#selectInstitucion").removeAttr('disabled');
        }


        Menu();
        mostrarResumen = function (fechaSubida, nombreArchivo, totalFilas, filasError, filasCorrectas, id) {
            window.location.href = 'detallecarga.html?FECHA_SUBIDA=' + fechaSubida() + '&NOMBRE_ARCHIVO=' + nombreArchivo() + '&TOTAL_FILAS=' + totalFilas() + '&FILAS_ERROR=' + filasError() + '&FILAS_CORRECTAS='+ filasCorrectas() + '&ID=' + id();
        }



        ko.mapping.fromJS(data, {}, self);

    }


    var obtenerInstitucion = jQuery.ajax({
        url : ObtenerUrl('Institucion'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ IdUsuario: 9 })
    });

    $.when(obtenerInstitucion).then(
        function(dataI){

            elem = document.getElementById('principal');

            var obtenerCargaMasiva = jQuery.ajax({
                url : ObtenerUrl('EncabezadoCarga'),
                type: 'POST',
                dataType : "json",
                contentType: "application/json",
                data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), UsuId: sessionStorage.getItem("Id") })
            });

            $.when(obtenerCargaMasiva).then(function (data)
                {
                    if (dataI != null)
                    {
                        self.instituciones = dataI.proposals;
                        selectedInstitucion = sessionStorage.getItem("InstId");
                    }

                    ko.applyBindings(new DocumentoViewModel(data), self.elem);

                    if (data.proposals.length > 0)
                    {
                        $("#proposals").DataTable({
                            responsive: true,
                            language: {
                                "sProcessing": "Procesando...",
                                "sLengthMenu": "Mostrar _MENU_ registros",
                                "sZeroRecords": "No se encontraron resultados",
                                "sEmptyTable": "Ningún dato disponible en esta tabla",
                                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                                "sInfoPostFix": "",
                                "sSearch": "Buscar:",
                                "sUrl": "",
                                "bDestroy": true,
                                "sInfoThousands": ",",
                                "sLoadingRecords": "Cargando...",
                                "oPaginate": {
                                    "sFirst": "Primero",
                                    "sLast": "Último",
                                    "sNext": "Siguiente",
                                    "sPrevious": "Anterior"
                                },
                                "oAria": {
                                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                                }
                            }
                        });
                    }
                    $('#principal').show();
                    $('#loading').hide();

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
    $.when(obtenerInstitucion).then(
        function(dataI){

            elem = document.getElementById('principal');

            var obtenerCargaMasiva = jQuery.ajax({
                url : ObtenerUrlDos('CargaMasiva'),
                type: 'POST',
                dataType : "json",
                contentType: "application/json",
                data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), UsuId: sessionStorage.getItem("Id") })
            });

            $.when(obtenerCargaMasiva).then(function (data)
                {
                    if (dataI != null)
                    {
                        self.instituciones = dataI.proposals;
                        selectedInstitucion = sessionStorage.getItem("InstId");
                    }

                    ko.applyBindings(new DocumentoViewModel(data), self.elem);

                    if (data.proposals.length > 0)
                    {
                        $("#proposals").DataTable({
                            responsive: true,
                            language: {
                                "sProcessing": "Procesando...",
                                "sLengthMenu": "Mostrar _MENU_ registros",
                                "sZeroRecords": "No se encontraron resultados",
                                "sEmptyTable": "Ningún dato disponible en esta tabla",
                                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                                "sInfoPostFix": "",
                                "sSearch": "Buscar:",
                                "sUrl": "",
                                "bDestroy": true,
                                "sInfoThousands": ",",
                                "sLoadingRecords": "Cargando...",
                                "oPaginate": {
                                    "sFirst": "Primero",
                                    "sLast": "Último",
                                    "sNext": "Siguiente",
                                    "sPrevious": "Anterior"
                                },
                                "oAria": {
                                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                                }
                            }
                        });
                    }
                    $('#principal').show();
                    $('#loading').hide();

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
*/

    $('#btnUploadFile').on('click', function () {

        var files = $("#txtArchivo").get(0).files;
        var instIdFrm = $("#selectInstitucion").val();

        extensiones_permitidas = new Array(".xlsx", ".xls");

        if (ValidaExtension(files[0], extensiones_permitidas) == true) {

            var model = new FormData();
            model.append("UsuId", sessionStorage.getItem("Id"));
            model.append("InstId", instIdFrm);
            model.append("EsCpas", sessionStorage.getItem("ES_CPAS"));
            model.append("UploadedExcel", files[0]);

            $.ajax({
                url: ObtenerUrlDos('FileExcel'),
                type: 'POST',
                dataType: 'json',
                data: model,
                processData: false,
                contentType: false,// not json
                complete: function (data) {
                    var inicio = "<div class='col-xs-12' style='height: 80px;overflow-y: scroll; font-size: x-small;'>";
                    var termino = "</div>";
                    var contenido = inicio + data.responseJSON.Mensaje + termino;

                    swal({
                        title: "Guardado",
                        //text: "El Registro ha sido guardado con éxito.",
                        html: contenido,
                        type: "success",
                        showCancelButton: false,
                        confirmButtonClass: "btn-success",
                        confirmButtonText: "Ok",
                        cancelButtonText: "No, cancel plx!",
                        //closeOnConfirm: true,
                        customClass: 'sweetalert-xs'
                        //closeOnCancel: false
                    }).then(function (text) {
                        if (text) {
                            //swal(text)
                            window.location.href = "cargamasiva.html";
                        }
                    });

                    /*
                    swal({
                            title: "Guardado",
                            //text: "El Registro ha sido guardado con éxito.",
                            html: contenido,
                            type: "success",
                            showCancelButton: false,
                            confirmButtonClass: "btn-success",
                            confirmButtonText: "Ok",
                            cancelButtonText: "No, cancel plx!",
                            //closeOnConfirm: true,
                            customClass: 'sweetalert-xs'
                            //closeOnCancel: false
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                window.location.href = "cargamasiva.html";


                            } else {
                                swal("Cancelled", "Your imaginary file is safe :)", "error");
                            }
                        });
                    */

                }
            });

        }

    });

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

    function MostrarDetalles(detalle){
        swal(
            'Detalle',
            detalle,
            'info'
        )
    }

});

