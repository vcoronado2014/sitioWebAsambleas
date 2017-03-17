/**
 * Created by VICTOR CORONADO on 16/03/2017.
 */
$(document).ready(function () {

    function ListaViewModel(dataR)
    {
        var self = this;

        ko.mapping.fromJS(dataR, {}, self);
    }

    var id = getParameterByName('id');
    if (id > 0) {
        var url = ObtenerUrl('ArchivoTricel') + "?TricelId=" + id;

        $.ajax({
            url: url,
            type: "GET",
            success: function (dataR) {
                // ok

                //elem = document.getElementById('principal');

                var element = $('#principal')[0];
                ko.cleanNode(element);

                ko.applyBindings(new ListaViewModel(dataR), element);

                if (dataR.proposals.length > 0)
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

});