$(function () {

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
        if ($('#ancoreSesion').html() == '<i class="fa fa-close"></i> Cerrar Sesión') {
            //acá debe direccionarlo directamente al login y vaciar la variable de session
            sessionStorage.clear();
            window.location.href = "index.html";
            return;
        }
        else {
            //directo al login
            window.location.href = "index.html";
        }


    });

    $('[data-toggle="tooltip"]').tooltip()
    function ViewModel(data) {
        var self = this;
        nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YY"));
        self.frmUrlDocumento = ko.observable("");

        /*
        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);
        */

        Menu();

        // knockout mapping JSON data to view model
        ko.mapping.fromJS(data, {}, self);



    }

    var obtenerRendiciones = jQuery.ajax({
        url : ObtenerUrl('Rendicion'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId") })
    });

   $.when(obtenerRendiciones).then(
        function(data){
            elem = document.getElementById('principal');

            if (data.proposals != null && data.proposals.length > 0) {
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
            }
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

    //var chart = Morris.Donut({
    //    element: 'graph',
    //    data: [
    //      { value: 0, label: 'Ingresos' },
    //      { value: 0, label: 'Egresos' }
    //    ],
    //    backgroundColor: '#ccc',
    //    labelColor: '#060',
    //    colors: [
    //      'rgb(11, 98, 164)',
    //      'rgb(160, 0, 0)'
    //    ],
    //    formatter: function (x) { return "$" +  x}
    //});

    //chart.setData([
    //      { value: 0, label: 'Ingresos' },
    //      { value: 0, label: 'Egresos' }
    //]);


    $.ajax({
        url: ObtenerUrl('Grafico'),
        type: "POST",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), NombreGrafico: "INGRESOS_EGRESOS" }),
        contentType: "application/json",
        dataType: "json",
        success: function (dataGrafico) {
            // ok

            //getNotify('success', 'Éxito', 'Recuperado con éxito!');
            elem = document.getElementById('principal');
            if (dataGrafico != null && dataGrafico.length > 0) {

                //ko.applyBindings(new ViewModel(data), elem);
                var chart = Morris.Donut({
                    element: 'graph',
                    data: dataGrafico,
                    backgroundColor: '#ccc',
                    labelColor: '#060',
                    colors: [
                        'rgb(11, 98, 164)',
                        'rgb(160, 0, 0)'
                    ],
                    formatter: function (x) {
                        return "$" + x
                    }
                });
                //chart.setData(dataGrafico);
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



});
