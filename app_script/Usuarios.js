$(function () {

    $('#principal').hide();
    $('#loading').show();


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

    $('[data-toggle="tooltip"]').tooltip()
    // knockout view model
    function ViewModel(data) {
        var self = this;
        nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        // knockout mapping JSON data to view model

        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);


        ko.mapping.fromJS(data, {}, self);
        eliminar = function (data, event) {
            var target = event.target || event.srcElement;

            if (target.nodeType == 3) // defeat Safari bug
                target = target.parentNode;

            var idEliminar = data.Id;

            swal({
                title: "Eliminar",
                text: "¿Está seguro de eliminar a este usuario?",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                showLoaderOnConfirm: true
            }, function () {
                setTimeout(function () {


                    $.ajax({
                        url: ObtenerUrl('ObtenerUsuario'),
                        type: "DELETE",
                        data: ko.toJSON({ IdUsuario: idEliminar }),
                        contentType: "application/json",
                        dataType: "json",
                        success: function (dataF) {
                            //ok
                            var self = this;

                            swal("Eliminado con éxito!");

                            window.location.href = "usuarios.html";

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
            });
        }
    }
    // get data - sample data from Donors Choose API
    $.getJSON(ObtenerUrl('ListarUsuarios') + '?instId=' + sessionStorage.getItem("InstId"), function (data) {
        // bind the data
        elem = document.getElementById('principal');
        //ko.cleanNode(elem);
        //ko.applyBindings(new PersonViewModel(data, dataR, dataCC, self.roles), elem);
        ko.applyBindings(new ViewModel(data), elem);
        // apply DataTables magic
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
        $('#principal').show();
        $('#loading').hide();
    });

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