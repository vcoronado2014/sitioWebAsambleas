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

    /*
        if (sessionStorage.getItem("RolId") != '9')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);
*/

        Menu();

        Mostrar = function (item) {
            var rulImagen = item.Url;
            var urlMostrar = item.OtroDos;
            var extension = item.OtroTres();

            if (extension == '.png' || extension == '.jpg' || extension == '.jpeg' || extension == '.gif') {
                $.magnificPopup.open({
                    items: {
                        src: item.Url()
                    },
                    type: 'image'
                });
            }
            else if (extension == '.pdf' || extension == '.doc' || extension == '.docx' || extension == '.xls' || extension == '.xlsx' || extension == '.ppt' || extension == '.pptx')
            {
                var URL = item.OtroDos();
                var win = window.open(URL, "_blank");

            }
            else
            {
                getNotify('warning', 'Formato', 'El formato del Archivo no se permite visualizar');
            }

        }

        ko.mapping.fromJS(data, {}, self);

    }


    $.ajax({
        url: ObtenerUrl('FileDocumento'),
        type: "POST",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), UsuId: sessionStorage.getItem("Id") }),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            // ok

            //getNotify('success', 'Éxito', 'Recuperado con éxito!');
            elem = document.getElementById('principal');
            ko.applyBindings(new DocumentoViewModel(data), elem);

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
        error: function (error) {
            if (error.status.toString() == "500") {
                getNotify('error', 'Error', 'Error de Servidor!');
            }
            else {
                getNotify('error', 'Error', 'Error de Servidor!');
            }
        }
    });

    $('#btnUploadFile').on('click', function () {

        var files = $("#txtArchivo").get(0).files;
        extensiones_permitidas = new Array(".gif", ".jpg", ".doc", ".pdf", ".xls", ".xlsx", ".docx", ".png");

        if (ValidaExtension(files[0], extensiones_permitidas) == true) {

            $('#principal').hide();
            $('#loading').show();

            var model = new FormData();
            model.append("UsuId", sessionStorage.getItem("Id"));
            model.append("InstId", sessionStorage.getItem("InstId"));
            model.append("UploadedImage", files[0]);

            var guardarArchivo = jQuery.ajax({
                url : ObtenerUrl('FileNuevo'),
                type: 'POST',
                dataType : "json",
                contentType: false,
                processData: false,
                data: model
            });

            $.when(guardarArchivo).then(
                function(data){

                    $('#principal').show();
                    $('#loading').hide();

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
                                window.location.href = "ListarDocumento.html";


                            } else {
                                swal("Cancelled", "Your imaginary file is safe :)", "error");
                            }
                        });

                },
                function (){
                    //alguna ha fallado
                    //alert('error');
                    getNotify('error', 'Archivo', 'Error al subir el archivo.');
                    $('#principal').show();
                    $('#loading').hide();
                },
                function(){
                    //acá podemos quitar el elemento cargando
                    alert('quitar cargando');
                }
            );

            /*
            $.ajax({
                url: ObtenerUrl('FileNuevo'),
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
                                window.location.href = "ListarDocumento.html";


                            } else {
                                swal("Cancelled", "Your imaginary file is safe :)", "error");
                            }
                        });

                }
            });
            */
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

});

//$(window).load(function () {
//    // Una vez se cargue al completo la página desaparecerá el div "cargando"
//    $('#principal').show();
//    $('#loading').hide();
//});