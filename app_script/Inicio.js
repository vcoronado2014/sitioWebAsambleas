
$(document).ready(function () {

    $('[data-toggle="tooltip"]').tooltip();

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


    function PersonViewModel(data, dataP) {
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
            url: ObtenerUrl('ListarUsuarios'),
            type: "POST",
            data: ko.toJSON({ InstId: self.instId }),
            contentType: "application/json",
            dataType: "json",
            success: function (result) {
                // ok
                $('#infoUsuarios').text(result.length);

                $.ajax({
                    url: ObtenerUrl('Institucion'),
                    type: "POST",
                    data: ko.toJSON({ IdUsuario: sessionStorage.getItem("Id") }),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (result2) {
                        // ok
                        $('#infoInstituciones').text(result2.proposals.length);
                        
                        $.ajax({
                            url: ObtenerUrl('Rendicion'),
                            type: "POST",
                            data: ko.toJSON({ InstId: sessionStorage.getItem("InstId") }),
                            contentType: "application/json",
                            dataType: "json",
                            success: function (result2) {
                                // ok
                                $('#infoIngresos').text(result2.proposals.length);

                                $.ajax({
                                    url: ObtenerUrl('FileDocumento'),
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

        var items = [];
        var itemsProcesar = data;

        if (itemsProcesar != null && itemsProcesar.length > 0)
        {
            for(var i in itemsProcesar)
            {

                var rolId = sessionStorage.getItem("RolId");
                var disabled = true;
                //por mientras solo para el Administrador
                if (rolId == 1)
                    disabled = false;


                var s = {
                    content: itemsProcesar[i].content,
                    startDate: new Date(itemsProcesar[i].annoIni,itemsProcesar[i].mesIni, parseInt(itemsProcesar[i].diaIni),  itemsProcesar[i].horaIni, itemsProcesar[i].minutosIni,0, 0),
                    endDate: new Date(itemsProcesar[i].annoTer, itemsProcesar[i].mesTer, parseInt(itemsProcesar[i].diaTer), itemsProcesar[i].horaTer, itemsProcesar[i].minutosTer, 0, 0),
                    isNew: false,
                    id: itemsProcesar[i].id,
                    disabled: disabled,
                    clientId : itemsProcesar[i].id,
                    fechaInicio : moment(new Date(itemsProcesar[i].annoIni,itemsProcesar[i].mesIni, parseInt(itemsProcesar[i].diaIni),  itemsProcesar[i].horaIni, itemsProcesar[i].minutosIni,0, 0)).format("DD-MM-YYYY"),
                    fechaTermino : moment(new Date(itemsProcesar[i].annoTer, itemsProcesar[i].mesTer, parseInt(itemsProcesar[i].diaTer), itemsProcesar[i].horaTer, itemsProcesar[i].minutosTer, 0, 0)).format("DD-MM-YYYY"),
                    horaInicio: moment(new Date(itemsProcesar[i].annoIni,itemsProcesar[i].mesIni, parseInt(itemsProcesar[i].diaIni),  itemsProcesar[i].horaIni, itemsProcesar[i].minutosIni,0, 0)).format("HH:mm"),
                    horaTermino: moment(new Date(itemsProcesar[i].annoTer, itemsProcesar[i].mesTer, parseInt(itemsProcesar[i].diaTer), itemsProcesar[i].horaTer, itemsProcesar[i].minutosTer, 0, 0)).format("HH:mm")
                }
                items[i] = s;
            }
        }

        self.items = ko.observableArray(items);

        var itemsP = [];
        var itemsProcesarP = dataP.proposals;

        if (itemsProcesarP != null && itemsProcesarP.length > 0)
        {
            for(var i in itemsProcesarP)
            {
                var puedeVotar = itemsProcesarP[i].OtroSiete;
                var disabled = true;
                //por mientras solo para el Administrador
                if (puedeVotar == "1")
                    disabled = false;


                var s = {
                    nombre: itemsProcesarP[i].NombreUsuario,
                    objetivo: itemsProcesarP[i].NombreCompleto,
                    beneficios: itemsProcesarP[i].Rol,
                    fechaInicio : itemsProcesarP[i].OtroUno,
                    fechaTermino : itemsProcesarP[i].OtroDos,
                    fechaCreacion: itemsProcesarP[i].OtroTres,
                    monto: '$ ' + itemsProcesarP[i].OtroCuatro,
                    descripcion: itemsProcesarP[i].OtroSeis,
                    urlVotar: 'VotarProyecto.html?id=' + itemsProcesarP[i].Id + '&puedeVotar=' + itemsProcesarP[i].OtroSiete,
                    puedeVotar: disabled,
                    content: 'Nombre: ' + itemsProcesarP[i].NombreUsuario + ', Objetivo: ' + itemsProcesarP[i].NombreCompleto + ', Descripción: ' + itemsProcesarP[i].OtroSeis
                }
                itemsP[i] = s;
            }
        }

        self.itemsP = ko.observableArray(itemsP);

    }
    /*
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
        url: ObtenerUrl('Grafico'),
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
    */
    var dataCalendario = [];
    var dataProyecto =  [];

    $.ajax({
        url: ObtenerUrl('Calendario'),
        type: "POST",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), Tipo:'1' }),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            // ok
            dataCalendario = data;
            //ko.applyBindings(new PersonViewModel(dataCalendario));


            $.ajax({
                url: ObtenerUrlDos('Proyecto'),
                type: "POST",
                data: ko.toJSON({ InstId: sessionStorage.getItem("InstId") }),
                contentType: "application/json",
                dataType: "json",
                success: function (dataP) {
                    // ok
                    dataProyecto = dataP;
                    elem = document.getElementById('principal');

                    ko.applyBindings(new PersonViewModel(dataCalendario, dataProyecto));

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


    //ko.applyBindings(new PersonViewModel(dataCalendario));

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
function AbrirCalendario() {
    window.location.href = "ListarCalendario.html";
}