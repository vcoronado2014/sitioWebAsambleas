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

        var obtenerArchivos = $.getJSON(ObtenerUrl('ArchivoTricel') + "?TricelId=" + id);

        $.when(obtenerArchivos).then(
            function(data){
                elem = document.getElementById('principal');

                ko.applyBindings(new ViewModel(data), elem);
                // apply DataTables magic
                $("#proposals").DataTable({
                    responsive: true,
                    language: {
                        "sProcessing": "Procesando...",
                        "sLengthMenu": "Mostrar _MENU_ registros",
                        "sZeroRecords": "No se encontraron resultados",
                        "sEmptyTable": "Ningún dato disponible en esta tabla",
                        "sInfo": "del _START_ al _END_  de _TOTAL_ registros",
                        "sInfoEmpty": "del 0 al 0 de 0 registros",
                        "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                        "sInfoPostFix": "",
                        "sSearch": "Buscar:",
                        "sUrl": "",
                        "bDestroy": true,
                        "sInfoThousands": ",",
                        "sLoadingRecords": "Cargando...",
                        "oPaginate": {
                            "sFirst": "<<",
                            "sLast": ">>",
                            "sNext": ">",
                            "sPrevious": "<"
                        },
                        "oAria": {
                            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                        }
                    }
                });
                $('#principal').show();
                $('#loading').hide();

            },
            function (){
                //alguna ha fallado
                swal("Error de Servidor");
                $('#principal').show();
                $('#loading').hide();
            },
            function(){
                //acá podemos quitar el elemento cargando
                //alert('quitar cargando');
            }
        )

    }

});