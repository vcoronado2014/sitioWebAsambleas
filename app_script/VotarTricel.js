/**
 * Created by vcoronado on 04-04-2017.
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


    function PersonViewModel(dataP, dataL) {
        var self = this;
        //self.people = ko.observableArray([]);
        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        self.textoVoto = ko.observable("");
        visibleBoton = ko.observable(false);

    /*
        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);
            */

        Menu();

        var itemsP = [];
        var itemsProcesarP = dataP.proposals;

        var puedeVotar = "0";
        var disabled = true;

        if (itemsProcesarP != null && itemsProcesarP.length > 0)
        {
            for(var i in itemsProcesarP)
            {
                puedeVotar = itemsProcesarP[i].OtroSiete;
                disabled = true;
                visibleBoton = false;
                //por mientras solo para el Administrador
                if (puedeVotar == "1") {
                    disabled = false;
                    visibleBoton = true;
                }
                self.textoVoto = itemsProcesarP[i].OtroNueve;

                var s = {
                    nombre: itemsProcesarP[i].NombreUsuario,
                    objetivo: itemsProcesarP[i].NombreCompleto,

                    fechaInicio : itemsProcesarP[i].OtroUno,
                    fechaTermino : itemsProcesarP[i].OtroDos,
                    fechaCreacion: itemsProcesarP[i].OtroTres,


                    urlVotar: 'VotarTricel.html?id=' + itemsProcesarP[i].Id + '&puedeVotar=' + itemsProcesarP[i].OtroSiete,
                    puedeVotarT: disabled,
                    fechas: itemsProcesarP[i].OtroCinco,
                    textoVoto: itemsProcesarP[i].OtroNueve,
                    content: 'Nombre: ' + itemsProcesarP[i].NombreUsuario + ', Objetivo: ' + itemsProcesarP[i].NombreCompleto
                }
                itemsP[i] = s;
            }
        }

        self.itemsP = ko.observableArray(itemsP);


        var itemsL = [];
        var itemsProcesarL = dataL.proposals;

        if (itemsProcesarL != null && itemsProcesarL.length > 0)
        {
            for(var i in itemsProcesarL)
            {

                var s = {
                    nombre: itemsProcesarL[i].NombreUsuario,
                    objetivo: itemsProcesarL[i].NombreCompleto,
                    descripcion : itemsProcesarL[i].OtroTres,
                    fechaInicio : itemsProcesarL[i].OtroUno,
                    fechaTermino : itemsProcesarL[i].OtroDos,
                    //urlVotar: 'VotarTricel.html?id=' + itemsProcesarL[i].Id + '&puedeVotar=' + itemsProcesarL[i].OtroSiete,
                    puedeVotarT: disabled,
                    id: itemsProcesarL[i].Id
                }
                itemsL[i] = s;
            }
        }

        self.itemsL = ko.observableArray(itemsL);


        volver = function (){
            window.location.href = "inicio.html";
        }
        votar = function(item){
            var ltrId = item.id;
            var nombre = item.nombre;
            var id = getParameterByName('id');
            var instId = sessionStorage.getItem("InstId");
            var usuId = sessionStorage.getItem("Id");

            var voto = {
                InstId: instId,
                LtrId: ltrId,
                UsuId: usuId,
                TriId: id
            }


            swal({
                title: "Votar",
                text: "¿Está seguro de votar la lista" + nombre,
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {


                    setTimeout(function () {

                        $.ajax({
                            url: ObtenerUrlDos('VotarTricel'),
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
                                            window.location.href = "VotarTricel.html?id=" + id + '&puedeVotar=0';
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


                    }, 2000);

                }
                else {
                    window.location.href ="VotarTricel.html?id=" + id + '&puedeVotar=1';
                }
            });

            /*
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


                    }, 2000);

                }
                else {
                    window.location.href ="VotarProyecto.html?id=" + id + '&puedeVotar=1';
                }
            });
            */
        }

    }

    var dataProyecto =  [];

    var dataGraficoArr = [{"value":"","label":""}];

    var obtenerVotaciones= jQuery.ajax({
        url : ObtenerUrlDos('Votacion'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), UsuId: sessionStorage.getItem("Id") })
    });

    var obtenerGrafico= jQuery.ajax({
        url :  ObtenerUrl('Grafico'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: getParameterByName('id'), NombreGrafico: "TRICEL" })
    });

    var obtenerListaTricel= jQuery.ajax({
        url :  ObtenerUrl('ListaTricel'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ TriId: getParameterByName('id') })
    });

    $.when(obtenerVotaciones, obtenerGrafico, obtenerListaTricel).then(
        function(dataP, dataGrafico, dataListaTricel){
            //aca contenido de la operacion
            dataProyecto = dataP[0];
            dataGraficoArr = dataGrafico[0];

            //verificamos si se muestra o no
            var suma = 0;
            for(var i in dataGraficoArr)
            {
                suma = suma + parseInt(dataGraficoArr[i].value);
            }

            if (suma > 0) {
                var chart = Morris.Donut({
                    element: 'graph',
                    data: dataGraficoArr,

                    backgroundColor: '#ccc',
                    labelColor: '#060',
                    colors: [
                        'rgb(11, 98, 164)',
                        'rgb(160, 0, 0)'
                    ],

                    formatter: function (x) {
                        return x
                    }
                });
                //chart.setData(ko.toJSON(dataGraficoArr));
            }

            //ahora seteamos los elementos de la lista


            ko.applyBindings(new PersonViewModel(dataProyecto, dataListaTricel[0]));

        },
        function (){
            //alguna ha fallado
            swal("Error de Servidor");
        },
        function(){
            //acá podemos quitar el elemento cargando
            //alert('quitar cargando');
        }
    )


/*
    $.ajax({
        url: ObtenerUrlDos('Votacion'),
        type: "POST",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), UsuId: sessionStorage.getItem("Id") }),
        contentType: "application/json",
        dataType: "json",
        success: function (dataP) {
            // ok
            dataProyecto = dataP;
            elem = document.getElementById('principal');

            $.ajax({
                url: ObtenerUrl('Grafico'),
                type: "POST",
                data: ko.toJSON({ InstId: getParameterByName('id'), NombreGrafico: "TRICEL" }),
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

*/

    $('#principal').show();
    $('#loading').hide();
});