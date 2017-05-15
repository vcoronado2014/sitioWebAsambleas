/**
 * Created by VICTOR CORONADO on 25/03/2017.
 */
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
            window.location.href = "index.html";
            return;
        }
    }
    else
    {
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


    function PersonViewModel(dataP) {
        var self = this;
        //self.people = ko.observableArray([]);
        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        self.textoVoto = ko.observable("");
        self.visibleBoton = ko.observable(false);

    /*
        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);
*/

        Menu();
        var itemsP = [];
        var itemsProcesarP = dataP.proposals;

        if (itemsProcesarP != null && itemsProcesarP.length > 0)
        {
            for(var i in itemsProcesarP)
            {
                var puedeVotar = itemsProcesarP[i].OtroSiete;
                var disabled = true;
                self.visibleBoton = false;
                //por mientras solo para el Administrador
                if (puedeVotar == "1") {
                    disabled = false;
                    self.visibleBoton = true;
                }
                self.textoVoto = itemsProcesarP[i].OtroNueve;

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
                    fechas: itemsProcesarP[i].OtroOcho,
                    textoVoto: itemsProcesarP[i].OtroNueve,
                    content: 'Nombre: ' + itemsProcesarP[i].NombreUsuario + ', Objetivo: ' + itemsProcesarP[i].NombreCompleto + ', Descripción: ' + itemsProcesarP[i].OtroSeis
                }
                itemsP[i] = s;
            }
        }

        self.itemsP = ko.observableArray(itemsP);

        volver = function (){
            window.location.href = "inicio.html";
        }
        votarPositivo = function(){
            var id = getParameterByName('id');
            var instId = sessionStorage.getItem("InstId");
            var usuId = sessionStorage.getItem("Id");
            var valor = "1";
            var puedeVotar = "0";

            var voto = {
                InstId: instId,
                ProId: id,
                Valor: valor,
                UsuId: usuId
            }

            swal({
                title: "Votar",
                text: "¿Está seguro de votar SI a este Proyecto?.",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {


                    setTimeout(function () {

                        $.ajax({
                            url: ObtenerUrlDos('VotarProyecto'),
                            type: "POST",
                            data: ko.toJSON(voto),
                            contentType: "application/json",
                            dataType: "json",
                            success: function (dataF) {
                                //ok
                                swal({
                                        title: "Éxito",
                                        text: "Su voto se ha registrado con éxito.",
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
                                            window.location.href = "VotarProyecto.html?id=" + id + '&puedeVotar=' + puedeVotar;
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
                    window.location.href ="VotarProyecto.html?id=" + id + '&puedeVotar=1';
                }
            });

        }

        votarNegativo = function(){
            var id = getParameterByName('id');
            var instId = sessionStorage.getItem("InstId");
            var usuId = sessionStorage.getItem("Id");
            var valor = "0";
            var puedeVotar = "0";

            var voto = {
                InstId: instId,
                ProId: id,
                Valor: valor,
                UsuId: usuId
            }

            swal({
                title: "Votar",
                text: "¿Está seguro de votar NO a este Proyecto?.",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {


                    setTimeout(function () {

                        $.ajax({
                            url: ObtenerUrlDos('VotarProyecto'),
                            type: "POST",
                            data: ko.toJSON(voto),
                            contentType: "application/json",
                            dataType: "json",
                            success: function (dataF) {
                                //ok
                                swal({
                                        title: "Éxito",
                                        text: "Su voto se ha registrado con éxito.",
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
                                            window.location.href = "VotarProyecto.html?id=" + id + '&puedeVotar=' + puedeVotar;
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
                    window.location.href ="VotarProyecto.html?id=" + id + '&puedeVotar=1';
                }
            });

        }
    }

    var dataProyecto =  [];
    $.ajax({
        url: ObtenerUrlDos('Proyecto'),
        type: "POST",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), BuscarId: getParameterByName('id'), UsuId: sessionStorage.getItem("Id") }),
        contentType: "application/json",
        dataType: "json",
        success: function (dataP) {
            // ok
            dataProyecto = dataP;
            elem = document.getElementById('principal');

            $.ajax({
                url: ObtenerUrl('Grafico'),
                type: "POST",
                data: ko.toJSON({ InstId: getParameterByName('id'), NombreGrafico: "PROYECTOS" }),
                contentType: "application/json",
                dataType: "json",
                success: function (dataGrafico) {
                    // ok
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
                        formatter: function (x) { return x }
                    });
                    //chart.setData(dataGrafico);


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


            ko.applyBindings(new PersonViewModel(dataProyecto));

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

    $('#principal').show();
    $('#loading').hide();
});