
$(document).ready(function () {
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
    else
    {
        window.location.href = "login.html";
    }

    $('#ancoreSesion').on('click', function () {
        if ($('#ancoreSesion').html() == '<i class="fa fa-close"></i> Cerrar Sesión')
        {
            //acá debe direccionarlo directamente al login y vaciar la variable de session
            sessionStorage.clear();
            window.location.href = "login.html";
            return;
        }
        else
        {
            //directo al login
            window.location.href = "login.html";
        }


    });


    function PersonViewModel() {
        var self = this;
        //self.people = ko.observableArray([]);
        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        var cuadroInstitucion = $('#cuadroInstitucion');
        
        //self.totalInstituciones = ko.observable();
        if (sessionStorage.getItem("RolId") != 1) {
            cuadroInstitucion.addClass('hidden');
        }
        else
        {
            cuadroInstitucion.removeClass('hidden');
        }
        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);


        $.ajax({
            url: "http://localhost:48909/api/ListarUsuarios",
            type: "POST",
            data: ko.toJSON({ InstId: self.instId }),
            contentType: "application/json",
            dataType: "json",
            success: function (result) {
                // ok
                $('#infoUsuarios').text(result.length);

                $.ajax({
                    url: "http://localhost:48909/api/Institucion",
                    type: "POST",
                    data: ko.toJSON({ IdUsuario: sessionStorage.getItem("Id") }),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (result2) {
                        // ok
                        $('#infoInstituciones').text(result2.proposals.length);
                        
                        $.ajax({
                            url: "http://localhost:48909/api/Rendicion",
                            type: "POST",
                            data: ko.toJSON({ InstId: sessionStorage.getItem("InstId") }),
                            contentType: "application/json",
                            dataType: "json",
                            success: function (result2) {
                                // ok
                                $('#infoIngresos').text(result2.proposals.length);

                                $.ajax({
                                    url: "http://localhost:48909/api/FileDocumento",
                                    type: "POST",
                                    data: ko.toJSON({ InstId: sessionStorage.getItem("InstId") }),
                                    contentType: "application/json",
                                    dataType: "json",
                                    success: function (result2) {
                                        // ok
                                        $('#infoDocumentos').text(result2.proposals.length);
                                        //$('#principal').show();
                                        //$('#loading').hide();
                                    },
                                    error: function (error) {
                                        if (error.status.toString() == "500") {
                                            $('#mensaje').text("Error al Obtener Instituciones!");
                                        }
                                        else {
                                            $('#mensaje').text(error.statusText);
                                            alert("fail");
                                        }
                                    }
                                });
                            },
                            error: function (error) {
                                if (error.status.toString() == "500") {
                                    $('#mensaje').text("Error al Obtener Instituciones!");
                                }
                                else {
                                    $('#mensaje').text(error.statusText);
                                    alert("fail");
                                }
                            }
                        });
                    },
                    error: function (error) {
                        if (error.status.toString() == "500") {
                            $('#mensaje').text("Error al Obtener Instituciones!");
                        }
                        else {
                            $('#mensaje').text(error.statusText);
                            alert("fail");
                        }
                    }
                });


            },
            error: function (error) {
                if (error.status.toString() == "500") {
                    $('#mensaje').text("Nombre de usuario o contraseña inválida!");
                }
                else {
                    $('#mensaje').text(error.statusText);
                    alert("fail");
                }
            }
        });


    }

    var chart = Morris.Donut({
        element: 'graph',
        data: [
          { value: 0, label: 'Ingresos' },
          { value: 0, label: 'Egresos' }
        ],
        backgroundColor: '#ccc',
        labelColor: '#060',
        colors: [
          'rgb(11, 98, 164)',
          'rgb(160, 0, 0)'
        ],
        formatter: function (x) { return "$" + x }
    });

    $.ajax({
        url: "http://localhost:48909/api/Grafico",
        type: "POST",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), NombreGrafico: "INGRESOS_EGRESOS" }),
        contentType: "application/json",
        dataType: "json",
        success: function (dataGrafico) {
            // ok

            //getNotify('success', 'Éxito', 'Recuperado con éxito!');
            elem = document.getElementById('principal');

            //ko.applyBindings(new ViewModel(data), elem);
            chart.setData(dataGrafico);

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
    ko.applyBindings(new PersonViewModel);

    $('#principal').show();
    $('#loading').hide();

});
$(window).load(function () {
    // Una vez se cargue al completo la página desaparecerá el div "cargando"
    //$('#principal').hide();
});
function AbrirUsuarios() {
    window.location.href = "usuarios.html";
}
function AbrirInstituciones() {
    window.location.href = "ListarInstitucion.html";
}
function AbrirRendiciones() {
    window.location.href = "ListarRendicion.html";
}
function AbrirDocumentos() {
    window.location.href = "ListarDocumento.html";
}