﻿
/**
 * Created by vcoronado on 31-03-2017.
 */
$(document).ready(function () {

    document.querySelector("html").classList.add('js');



    var fileInputUno = document.querySelector(".input-file-uno"),
        button = document.querySelector(".input-file-trigger"),
        the_return = document.querySelector(".file-return");

        var fileInputDos = document.querySelector(".input-file-dos"),
        button = document.querySelector(".input-file-trigger"),
        the_return = document.querySelector(".file-return");

        var fileInputTres = document.querySelector(".input-file-tres"),
        button = document.querySelector(".input-file-trigger"),
        the_return = document.querySelector(".file-return");

        var fileInputCuatro = document.querySelector(".input-file-cuatro"),
        button = document.querySelector(".input-file-trigger"),
        the_return = document.querySelector(".file-return");




    $('[data-toggle="tooltip"]').tooltip();

    $('#principal').hide();
    $('#loading').show();
    exp: var fileUnoG = new Object();
    exp: var fileDosG = new Object();
    exp: var fileTresG = new Object();
    exp: var fileCuatroG = new Object();

    //PRUEBAS DE ARCHIVOS MULTIPLES
    exp: var listaArchivos = [];



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


    function PersonViewModel(data, dataP, dataT, dataU, dataI, dataR, dataD, dataMuro) {
        var self = this;

        var dataMuroRecortada = dataMuro.splice(0,CantidadComentarios());
        muro = ko.observableArray(dataMuroRecortada);
        //self.people = ko.observableArray([]);
        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        //items
        self.MuestraListaEventos = ko.observable(false);
        self.MuestraListaProyectos = ko.observable(false);
        self.MuestraListaTriceles = ko.observable(false);

        var cuadroInstitucion = $('#cuadroInstitucion');

        //self.totalInstituciones = ko.observable();
        if (sessionStorage.getItem("RolId") != 1) {
            cuadroInstitucion.addClass('hidden');
        }
        else
        {
            cuadroInstitucion.removeClass('hidden');
        }

        //aplicar Menu
        Menu();

        claseGeneral = ko.observable("col-xs-12 col-lg-3 col-md-3");

        var totalMostrar = 0;

        if (VerDocumento())
        {
            totalMostrar++;

        }
        if (VerInstitucion())
        {
            totalMostrar++;

        }
        if (VerRendicion())
        {
            totalMostrar++;

        }
        if (VerUsuario())
        {
            totalMostrar++;

        }
        if (totalMostrar == 4){
            claseGeneral = ko.observable("col-xs-12 col-lg-3 col-md-6");
        }
        if (totalMostrar == 3){
            claseGeneral = ko.observable("col-xs-12 col-lg-4 col-md-4");
        }
        if (totalMostrar == 2){
            claseGeneral = ko.observable("col-xs-12 col-lg-6 col-md-6");
        }
        if (totalMostrar == 1){
            claseGeneral = ko.observable("col-xs-12");
        }

/*
        var rolEvaluar = sessionStorage.getItem("RolId");
        claseMostrarIngresos = ko.observable("col-lg-3 col-md-4");
        claseMostrarDocumentos = ko.observable("col-lg-3 col-md-4");
        if (rolEvaluar == '9')
        {
            claseMostrarIngresos = ko.observable("col-xs-12 col-md-6");
            claseMostrarDocumentos = ko.observable("col-xs-12 col-md-6");
        }
        else if (rolEvaluar == '1')
        {
            claseMostrarIngresos = ko.observable("col-lg-3 col-md-4");
            claseMostrarDocumentos = ko.observable("col-lg-3 col-md-4");
        }
        else
        {
            //solo puede ver dos elementos
            claseMostrarIngresos = ko.observable("col-xs-12 col-md-4");
            claseMostrarDocumentos = ko.observable("col-xs-12 col-md-4");
            //claseMostrarInstituciones = ko.observable("col-xs-12 col-md-4");
        }
  */
        if (dataU)
            $('#infoUsuariosN').text(dataU.length);
        else
            $('#infoUsuariosN').text('0');
        if (dataI && dataI.proposals)
            $('#infoInstituciones').text(dataI.proposals.length);
        else
            $('#infoInstituciones').text('0');
        if (dataR && dataR.proposals)
            $('#infoIngresos').text(dataR.proposals.length);
        else
            $('#infoIngresos').text('0');
        if (dataD && dataD.proposals)
            $('#infoDocumentos').text(dataD.proposals.length);
        else
            $('#infoDocumentos').text('0');

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
                //aca debemos procesar los resultados del quorum
                //antes de empezar si el porcentaje exigido es 0 el quorum es del 100%
                var porcentajeExigido = parseInt(itemsProcesarP[i].OtroDoce);
                var valorBarra = 100;
                var cantidadVotos = parseInt(itemsProcesarP[i].OtroOnce);
                var totalUsuarios = parseInt(itemsProcesarP[i].TotalUsuarios);
                if (porcentajeExigido > 0 && totalUsuarios > 0){
                    //aca procesamos nuevamente el valor de la barra
                    var usuariosQueDebenVotar = (totalUsuarios * porcentajeExigido) / 100;
                    //de la cantidad de usuarios que deben votar se compara con los votos emitidos
                    //cantidadVotos / totalUsuarios * 100
                    var votados = parseInt((cantidadVotos / usuariosQueDebenVotar) * 100);
                    if (votados > 100){
                        valorBarra = 100;
                    }
                    else {
                        valorBarra = votados;
                    }


                }


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
                    valorBarra: valorBarra,
                    content: 'Nombre: ' + itemsProcesarP[i].NombreUsuario + ', Objetivo: ' + itemsProcesarP[i].NombreCompleto + ', Descripción: ' + itemsProcesarP[i].OtroSeis
                }
                itemsP[i] = s;
            }
        }

        self.itemsP = ko.observableArray(itemsP);

        var itemsT = [];
        var itemsProcesarT = dataT.proposals;

        if (itemsProcesarT != null && itemsProcesarT.length > 0)
        {
            for(var i in itemsProcesarT)
            {
                var puedeVotar = itemsProcesarT[i].OtroSiete;
                var disabled = true;
                //por mientras solo para el Administrador
                if (puedeVotar == "1")
                    disabled = false;
                //aca debemos procesar los resultados del quorum
                //antes de empezar si el porcentaje exigido es 0 el quorum es del 100%
                var porcentajeExigido = parseInt(itemsProcesarT[i].OtroDoce);
                var valorBarra = 100;
                var cantidadVotos = parseInt(itemsProcesarT[i].OtroOnce);
                var totalUsuarios = parseInt(itemsProcesarT[i].TotalUsuarios);
                if (porcentajeExigido > 0 && totalUsuarios > 0){
                    //aca procesamos nuevamente el valor de la barra
                    var usuariosQueDebenVotar = (totalUsuarios * porcentajeExigido) / 100;
                    //de la cantidad de usuarios que deben votar se compara con los votos emitidos
                    //cantidadVotos / totalUsuarios * 100
                    var votados = parseInt((cantidadVotos / usuariosQueDebenVotar) * 100);
                    if (votados > 100){
                        valorBarra = 100;
                    }
                    else {
                        valorBarra = votados;
                    }


                }

                var s = {
                    nombre: itemsProcesarT[i].NombreUsuario,
                    objetivo: itemsProcesarT[i].NombreCompleto,
                    fechaInicio : itemsProcesarT[i].OtroUno,
                    fechaTermino : itemsProcesarT[i].OtroDos,
                    fechaCreacion: itemsProcesarT[i].OtroTres,
                    urlVotar: 'VotarTricel.html?id=' + itemsProcesarT[i].Id + '&puedeVotar=' + itemsProcesarT[i].OtroSiete,
                    puedeVotar: disabled,
                    valorBarra: valorBarra,
                    content: 'Nombre: ' + itemsProcesarT[i].NombreUsuario + ', Objetivo: ' + itemsProcesarT[i].NombreCompleto
                }
                itemsT[i] = s;
            }
        }

        self.itemsT = ko.observableArray(itemsT);

        //ahora vemos si mostramos o no los items
        //items son los eventos
        if (items != null && items.length > 0)
            self.MuestraListaEventos = ko.observable(true);
        //itmesd proyectos
        if (itemsP != null && itemsP.length > 0)
            self.MuestraListaProyectos = ko.observable(true);
        //itmes triceles
        if (itemsT != null && itemsT.length > 0)
            self.MuestraListaTriceles = ko.observable(true);

        ko.mapping.fromJS(dataMuro, {}, self);


        $('#principal').show();
        $('#loading').hide();

    }


    var dataCalendario = [];
    var dataProyecto =  [];
    var dataTricel =  [];
    var dataUsuarios = [];
    var dataInstituciones = [];
    var dataRendiciones = [];
    var dataDocumentos = [];

    /*
    var obtenerCalendario = jQuery.ajax({
        url : ObtenerUrl('Calendario'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), Tipo:'1' })
    });

    var obtenerProyecto = jQuery.ajax({
        url : ObtenerUrlDos('Proyecto'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), Tipo:'1' })
    });

    var obtenerTricel = jQuery.ajax({
        url : ObtenerUrlDos('Votacion'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), UsuId: sessionStorage.getItem("Id")})
    });

    var obtenerUsuarios = jQuery.ajax({
        url : ObtenerUrl('ListarUsuarios'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId") })
    });

    var obtenerInstituciones =  jQuery.ajax({
        url : ObtenerUrl('Institucion'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ IdUsuario: sessionStorage.getItem("Id") })
    });

    var obtenerRendiciones =  jQuery.ajax({
        url : ObtenerUrl('Rendicion'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId") })
    });

    var obtenerDocumentos =  jQuery.ajax({
        url : ObtenerUrl('FileDocumento'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId") })
    });

    $.when(obtenerCalendario, obtenerProyecto, obtenerTricel, obtenerUsuarios, obtenerInstituciones, obtenerRendiciones, obtenerDocumentos).then(
        function(data, dataP, dataT, dataU, dataI, dataR, dataD){
            dataCalendario = data[0];
            dataProyecto = dataP[0];
            dataTricel = dataT[0];
            dataUsuarios = dataU[0];
            dataInstituciones = dataI[0];
            dataRendiciones = dataR[0];
            dataDocumentos = dataD[0];


            elem = document.getElementById('principal');

            ko.applyBindings(new PersonViewModel(dataCalendario, dataProyecto, dataTricel, dataUsuarios, dataInstituciones, dataRendiciones, dataDocumentos));

        },
        function (){
            //alguna ha fallado
            //alert('error');
            $('#principal').show();
            $('#loading').hide();
        },
        function(){
            //acá podemos quitar el elemento cargando
            alert('quitar cargando');
        }
    );

    */

    var obtenerInicio = jQuery.ajax({
        url : ObtenerUrlDos('Inicio'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), RolId: sessionStorage.getItem("RolId"), UsuId: 0, Tipo: '1' })
    });

    $.when(obtenerInicio).then(
        function(data){
            if (data.Eventos != null)
                dataCalendario = data.Eventos;
            if (data.Proyectos != null)
                dataProyecto = data.Proyectos;
            if (data.Votaciones != null)
                dataTricel = data.Votaciones;
            if (data.Usuarios != null)
                dataUsuarios = data.Usuarios;
            if (data.Establecimientos != null)
                dataInstituciones = data.Establecimientos;
            if (data.Rendiciones != null)
                dataRendiciones = data.Rendiciones;
            if (data.Documentos != null)
                dataDocumentos = data.Documentos;

            //muro
            var obtenerMuro = jQuery.ajax({
                url : ObtenerUrl('Muro'),
                type: 'POST',
                dataType : "json",
                contentType: "application/json",
                data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), UsuId: sessionStorage.getItem("Id") })
            });

            $.when(obtenerMuro).then(
                function(dataM){
                    //implementacion v2.8 agregar imagenes
                    var itemsProcesar = dataM;
                    if (itemsProcesar && itemsProcesar.length > 0) {
                        for (var i in itemsProcesar) {
                            if (itemsProcesar[i].Perfil.Id > 0){
                                itemsProcesar[i].Perfil.Url = ObtenerUrlRaizNovedades() + '/' +  itemsProcesar[i].Perfil.Foto;
                            }
                            itemsProcesar[i].CantidadArchivos = itemsProcesar[i].ArchivosAdjuntos.length;
                            if (itemsProcesar[i].ArchivosAdjuntos && itemsProcesar[i].ArchivosAdjuntos.length > 0) {
                                for (var s in itemsProcesar[i].ArchivosAdjuntos) {
                                    //aca procesamos los archivos
                                    var arc = itemsProcesar[i].ArchivosAdjuntos[s].NombreArchivo.split('.');
                                    if (arc.length == 2) {
                                        itemsProcesar[i].ArchivosAdjuntos[s].Extension = arc[1];
                                        itemsProcesar[i].ArchivosAdjuntos[s].Src = ObtenerUrlRaiz() + itemsProcesar[i].ArchivosAdjuntos[s].NombreCarpeta + '/' + itemsProcesar[i].ArchivosAdjuntos[s].NombreArchivo;
                                    }
                                    if (itemsProcesar[i].CantidadArchivos == 1) {
                                        itemsProcesar[i].ArchivosAdjuntos[s].Width = "75%";
                                    }
                                    if (itemsProcesar[i].CantidadArchivos == 2) {
                                        itemsProcesar[i].ArchivosAdjuntos[s].Width = "48%";
                                    }
                                    if (itemsProcesar[i].CantidadArchivos == 3) {
                                        itemsProcesar[i].ArchivosAdjuntos[s].Width = "32%";
                                    }
                                    if (itemsProcesar[i].CantidadArchivos == 4) {
                                        itemsProcesar[i].ArchivosAdjuntos[s].Width = "24%";
                                    }


                                }
                            }
                            if (itemsProcesar[i].RespuestaMuro && itemsProcesar[i].RespuestaMuro.length > 0){
                                for (var t in itemsProcesar[i].RespuestaMuro){
                                    if (itemsProcesar[i].RespuestaMuro[t].Perfil.Id > 0){
                                        itemsProcesar[i].RespuestaMuro[t].Perfil.Url = ObtenerUrlRaizNovedades() + '/' +  itemsProcesar[i].RespuestaMuro[t].Perfil.Foto;
                                    }
                                }
                            }
                        }

                    }
                    dataM = itemsProcesar;
                    console.log(dataM);
                    //********************************** */
                    elem = document.getElementById('principal');

                    ko.applyBindings(new PersonViewModel(dataCalendario, dataProyecto, dataTricel, dataUsuarios, dataInstituciones, dataRendiciones, dataDocumentos, dataM));

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

        /*
            elem = document.getElementById('principal');

            ko.applyBindings(new PersonViewModel(dataCalendario, dataProyecto, dataTricel, dataUsuarios, dataInstituciones, dataRendiciones, dataDocumentos));

        */

        },
        function (){
            //alguna ha fallado
            //alert('error');
            $('#principal').show();
            $('#loading').hide();
        },
        function(){
            //acá podemos quitar el elemento cargando
            alert('quitar cargando');
        }
    );

    modificarMensaje = function (item) {

        if (ModificaMuro()) {
            var textoOriginal = '<div class="col-xs-12">' + 'original: ' + item.Texto + "</div>";
            var prioridadId = item.PrioridadId;
            var mroId = item.MroId;
            var id = item.Id;
            swal({
                title: 'Responder',
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Enviar",
                cancelButtonText: "Cancelar",
                customClass: 'sweetalert-xs',
                width: '500px',
                html: textoOriginal +
                '<div class="col-xs-12><div class="input-group"  style="width: 100%;">' +
                /* '<input id="swal-input1" class="swal2-input" style="width: 100%;" value="' + item.Texto + '"/>' + */
                '<textarea id="swal-input1" class="swal2-input"  style="width: 100%; height:150px; margin-bottom: 0;" maxlength="250">' + item.Texto + '</textarea>' + 
                '</div></div>',
                onBeforeOpen: () => {
                    $('#swal-input1').emoji({ place: 'after', rowSize: 15 });
                },
                preConfirm: function () {

                    return new Promise(function (resolve, reject) {
                        var texto = $('#swal-input1').val();
                        var instId = sessionStorage.getItem("InstId");
                        var usuId = sessionStorage.getItem("Id");
                        var rolId = sessionStorage.getItem("RolId");


                        if (texto === false) return false;
                        if (texto === "") {
                            reject("Debe ingresar comentario.");
                            return false
                        }
                        //aca todo bien
                        var entidad = {
                            InstId: instId,
                            UsuId: usuId,
                            PrioridadId: prioridadId,
                            MroId: mroId,
                            RolId: rolId,
                            Texto: texto,
                            Id: id
                        };

                        setTimeout(function () {

                            $.ajax({
                                url: ObtenerUrl('RespuestaMuro'),
                                type: 'PUT',
                                data: ko.toJSON(entidad),
                                contentType: "application/json",
                                dataType: "json",
                                complete: function (data) {
                                    swal({
                                        title: 'Guardado',
                                        text: "Registro guardado con éxito.",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonClass: "btn-success",
                                        customClass: 'sweetalert-xs',
                                        confirmButtonText: "Aceptar"
                                    }).then(function () {
                                        EnviarMensajeSignalR('Se ha modificado una Respuesta al muro.', "ListarMuro.html", "4", sessionStorage.getItem("RolId"), data);
                                        window.location.href = "ListarMuro.html";
                                    });


                                }
                            });

                        }, 2000);
                        /*
                         resolve([
                         $('#swal-input1').val(),
                         $('#swal-input2').val()
                         ])
                         */

                    })

                },
                onOpen: function () {
                    $('#swal-input1').focus()
                }
            }).then(function (result) {
                //swal(JSON.stringify(result))
            }).catch(swal.noop)
        }
        else {
            getNotify('error', 'Permisos', 'No tiene permisos para modificar, contacte al administrador');
        }
    }

    EnviarMensaje = function (item) {
        if (CreaMuro()) {
            var textoOriginal = '<div class="col-xs-12">' + item.Texto + "</div>";
            var prioridadId = item.PrioridadId;
            var mroId = item.Id;
            swal({
                title: 'Responder',
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Enviar",
                cancelButtonText: "Cancelar",
                customClass: 'sweetalert-xs',
                width: '500px',
                html: textoOriginal +
                '<div class="col-xs-12><div class="input-group"  style="width: 100%;">' +
                /* '<input id="swal-input1" class="swal2-input" style="width: 100%;" />' + */
                '<textarea id="swal-input1" class="swal2-input"  style="width: 100%; height:150px; margin-bottom: 0;" maxlength="250"></textarea>' + 
                '</div></div>',
                onBeforeOpen: () => {
                    $('#swal-input1').emoji({ place: 'after', rowSize: 15 });
                },
                preConfirm: function () {

                    return new Promise(function (resolve, reject) {
                        var texto = $('#swal-input1').val();
                        var instId = sessionStorage.getItem("InstId");
                        var usuId = sessionStorage.getItem("Id");
                        var rolId = sessionStorage.getItem("RolId");


                        if (texto === false) return false;
                        if (texto === "") {
                            reject("Debe ingresar comentario.");
                            return false
                        }
                        //aca todo bien
                        var entidad = {
                            InstId: instId,
                            UsuId: usuId,
                            PrioridadId: prioridadId,
                            MroId: mroId,
                            RolId: rolId,
                            Texto: texto
                        };

                        setTimeout(function () {

                            $.ajax({
                                url: ObtenerUrl('RespuestaMuro'),
                                type: 'PUT',
                                data: ko.toJSON(entidad),
                                contentType: "application/json",
                                dataType: "json",
                                complete: function (data) {
                                    swal({
                                        title: 'Guardado',
                                        text: "Registro guardado con éxito.",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonClass: "btn-success",
                                        customClass: 'sweetalert-xs',
                                        confirmButtonText: "Aceptar"
                                    }).then(function () {
                                        EnviarMensajeSignalR('Se ha agregado una Respuesta al muro.', "ListarMuro.html", "4", sessionStorage.getItem("RolId"), data);
                                        window.location.href = "ListarMuro.html";
                                    });


                                }
                            });

                        }, 2000);
                        /*
                         resolve([
                         $('#swal-input1').val(),
                         $('#swal-input2').val()
                         ])
                         */

                    })

                },
                onOpen: function () {
                    $('#swal-input1').focus()
                }
            }).then(function (result) {
                //swal(JSON.stringify(result))
            }).catch(swal.noop)
        }
        else {
            getNotify('error', 'Permisos', 'No tiene permisos para crear, contacte al administrador');
        }
    }

    guardarMuro = function(){
        if (CreaMuro()) {
            swal({
                title: 'Nueva Novedad',
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Enviar",
                cancelButtonText: "Cancelar",
                customClass: 'sweetalert-xs',
                width: '500px',
                html: 
                /* '<h5>Agregue Archivos si lo desea (puedes agregar hasta 4)</h5>' + */
                '<div class="row">' +

                '<div class="col-xs-12 input-file-container" style="margin: 0; padding: 1px;">'+
                '<input class="input-file" type="file" accept="image/*" onchange="agregarArchivo()"  #fileInput id="my-file-uno">' +
                '<label tabindex="0" for="my-file-uno" class="input-file-trigger">Agregar Archivos</label>' +
                '<p class="file-return" id="file-return-uno"></p>' +
                '</div>' +
                
                '<div class="col-xs-12" id="listadoArchivosAdjuntos">'+
                '</div>' +

/*                 '<div class="col-xs-6 input-file-container" style="margin: 0; padding: 1px;">'+
                '<input class="input-file" type="file" accept="image/*" onchange="changeDos()"  #fileInput2 id="my-file-dos">' +
                '<label tabindex="0" for="my-file-dos" class="input-file-trigger">Archivo 2...</label>' +
                '<p class="file-return" id="file-return-dos"></p>' +
                '</div>' +

                '<div class="col-xs-6 input-file-container" style="margin: 0; padding: 1px;">'+
                '<input class="input-file" type="file" accept="image/*" onchange="changeTres()"  #fileInput3 id="my-file-tres">' +
                '<label tabindex="0" for="my-file-tres" class="input-file-trigger">Archivo 3...</label>' +
                '<p class="file-return" id="file-return-tres"></p>' +
                '</div>' +

                '<div class="col-xs-6 input-file-container" style="margin: 0; padding: 1px;">'+
                '<input class="input-file" type="file" accept="image/*" onchange="changeCuatro()"  #fileInput4 id="my-file-cuatro">' +
                '<label tabindex="0" for="my-file-cuatro" class="input-file-trigger">Archivo 4...</label>' +
                '<p class="file-return" id="file-return-cuatro"></p>' +
                '</div>' + */

                '</div>' +
                '<div class="col-xs-12"><label for="basic-url">Ingrese Comentario</label><div class="input-group"  style="width: 100%;">' +
                /*'<input id="swal-input1" class="swal2-input" style="width: 100%;" />' +*/
                '<textarea id="swal-input1" class="swal2-input"  style="width: 100%; height:150px; margin-bottom: 0;" maxlength="250"></textarea>' + 
                '</div></div><div class="col-xs-12><label for="basic-url">Prioridad</label><div class="input-group"  style="width: 100%;">' +
                '<select id = "swal-input2" style="width: 100%;"><option value = "0">Baja</option><option value = "1">Media</option><option value = "2">Alta</option></select></div></div>',
                onBeforeOpen: () => {
                    $('#swal-input1').emoji({ place: 'after', rowSize: 15 });
                },
                preConfirm: function () {

                    return new Promise(function (resolve, reject) {
                        var contadorArchivosGeneral = 0;
                        var texto = $('#swal-input1').val();
                        var prioridadId = $('#swal-input2').val();
                        var instId = sessionStorage.getItem("InstId");
                        var usuId = sessionStorage.getItem("Id");
                        var rolId = sessionStorage.getItem("RolId");
                        //manejo de archivos para comparar
                        //esto lo comentamos por nueva implementacion

/*                         if (fileUnoG && fileUnoG.size > 0){
                            contadorArchivosGeneral++;
                        }
                        if (fileDosG && fileDosG.size > 0){
                            contadorArchivosGeneral++;
                        }
                        if (fileTresG && fileTresG.size > 0){
                            contadorArchivosGeneral++;
                        }
                        if (fileCuatroG && fileCuatroG.size > 0){
                            contadorArchivosGeneral++;
                        } */
                        if (listaArchivos && listaArchivos.length > 0){
                            if (listaArchivos.length == 1){
                                fileUnoG = listaArchivos[0];
                            }
                            if (listaArchivos.length == 2){
                                fileUnoG = listaArchivos[0];
                                fileDosG = listaArchivos[1];
                            }
                            if (listaArchivos.length == 3){
                                fileUnoG = listaArchivos[0];
                                fileDosG = listaArchivos[1];
                                fileTresG = listaArchivos[2];
                            }
                            if (listaArchivos.length == 4){
                                fileUnoG = listaArchivos[0];
                                fileDosG = listaArchivos[1];
                                fileTresG = listaArchivos[2];
                                fileCuatroG = listaArchivos[3];
                            }
                        }



                        if (texto === false) return false;
                        if (texto === "") {
                            reject("Debe ingresar comentario.");
                            return false
                        }
                        //aca todo bien
                        var entidad = {
                            InstId: instId,
                            UsuId: usuId,
                            PrioridadId: prioridadId,
                            RolId: rolId,
                            Texto: texto
                        };

                        setTimeout(function () {

                            $.ajax({
                                url: ObtenerUrl('Muro'),
                                type: 'PUT',
                                data: ko.toJSON(entidad),
                                contentType: "application/json",
                                dataType: "json",
                                complete: function (data) {

                                    var contadorArchivos = 0;

                                    var resultado = JSON.parse(ko.toJSON(data)).responseJSON;
                                    if (fileUnoG && fileUnoG.size > 0) {
                                        contadorArchivos++;
                                        var modelUno = new FormData();
                                        modelUno.append("UploadedImage", fileUnoG);
                                        modelUno.append("idElemento", resultado.Id);
                                        modelUno.append("instId", instId);
                                        modelUno.append("tipoPadre", '1');
                                        modelUno.append("nombreCarpeta", 'Novedades');
                                        //elemento nuevo
                                        modelUno.append("id", '0');
                                        $.ajax({
                                            url: ObtenerUrl('ArchivoAdjunto'),
                                            type: 'POST',
                                            dataType: 'json',
                                            data: modelUno,
                                            processData: false,
                                            contentType: false,// not json
                                            complete: function (data) {
                                                //completado
                                            }

                                        });
                                    }

                                    if (fileDosG && fileDosG.size > 0) {
                                        contadorArchivos++;
                                        var modelDos = new FormData();
                                        modelDos.append("UploadedImage", fileDosG);
                                        modelDos.append("idElemento", resultado.Id);
                                        modelDos.append("instId", instId);
                                        modelDos.append("tipoPadre", '1');
                                        modelDos.append("nombreCarpeta", 'Novedades');
                                        //elemento nuevo
                                        modelDos.append("id", '0');
                                        $.ajax({
                                            url: ObtenerUrl('ArchivoAdjunto'),
                                            type: 'POST',
                                            dataType: 'json',
                                            data: modelDos,
                                            processData: false,
                                            contentType: false,// not json
                                            complete: function (data) {
                                                //completado
                                            }

                                        });
                                    }

                                    if (fileTresG && fileTresG.size > 0) {
                                        contadorArchivos++;
                                        var modelTres = new FormData();
                                        modelTres.append("UploadedImage", fileTresG);
                                        modelTres.append("idElemento", resultado.Id);
                                        modelTres.append("instId", instId);
                                        modelTres.append("tipoPadre", '1');
                                        modelTres.append("nombreCarpeta", 'Novedades');
                                        //elemento nuevo
                                        modelTres.append("id", '0');
                                        $.ajax({
                                            url: ObtenerUrl('ArchivoAdjunto'),
                                            type: 'POST',
                                            dataType: 'json',
                                            data: modelTres,
                                            processData: false,
                                            contentType: false,// not json
                                            complete: function (data) {
                                                //completado
                                            }

                                        });
                                    }
                                    if (fileCuatroG && fileCuatroG.size > 0) {
                                        contadorArchivos++;
                                        var modelCuatro = new FormData();
                                        modelCuatro.append("UploadedImage", fileCuatroG);
                                        modelCuatro.append("idElemento", resultado.Id);
                                        modelCuatro.append("instId", instId);
                                        modelCuatro.append("tipoPadre", '1');
                                        modelCuatro.append("nombreCarpeta", 'Novedades');
                                        //elemento nuevo
                                        modelCuatro.append("id", '0');
                                        $.ajax({
                                            url: ObtenerUrl('ArchivoAdjunto'),
                                            type: 'POST',
                                            dataType: 'json',
                                            data: modelCuatro,
                                            processData: false,
                                            contentType: false,// not json
                                            complete: function (data) {
                                                //completado
                                            }

                                        });
                                    }
                                    //ahora comparamos
                                    //cambiamos esto tambien por el 
                                    if (listaArchivos.length == contadorArchivos){
                                        swal({
                                            title: 'Guardado',
                                            text: "Registro guardado con éxito.",
                                            type: 'success',
                                            showCancelButton: false,
                                            confirmButtonClass: "btn-success",
                                            customClass: 'sweetalert-xs',
                                            confirmButtonText: "Aceptar"
                                        }).then(function () {
                                            console.log(ko.observable(data));
                                            //ahora deberiamos guardar los archivos
                                            if (fileUnoG && fileUnoG.size > 0){
    
                                            }
                                            
    
                                            EnviarMensajeSignalR('Se ha agregado una Novedad al Muro.', "ListarMuro.html", "4", sessionStorage.getItem("RolId"), data);
                                            window.location.href = "ListarMuro.html";
                                        });
                                    }

/*                                     swal({
                                        title: 'Guardado',
                                        text: "Registro guardado con éxito.",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonClass: "btn-success",
                                        customClass: 'sweetalert-xs',
                                        confirmButtonText: "Aceptar"
                                    }).then(function () {
                                        EnviarMensajeSignalR('Se ha agregado una Novedad al Muro.', "ListarMuro.html", "4", sessionStorage.getItem("RolId"), data);
                                        window.location.href = "ListarMuro.html";
                                    }); */


                                }
                            });

                        }, 2000);
                    })

                },
                onOpen: function () {
                    $('#swal-input1').focus()
                }
            }).then(function (result) {
                //swal(JSON.stringify(result))
            }).catch(swal.noop)
        }
        else {
            getNotify('error', 'Permisos', 'No tiene permisos para crear, contacte al administrador');
        }
    }
    change = function (){
        //console.log(this);
        fileUnoG = this.event.target.files[0];
        $('#file-return-uno')[0].innerHTML = fileUnoG.name;
        if ($('#file-return-dos')[0] && $('#file-return-dos')[0].innerHTML == ''){
            $('#file-return-dos')[0].innerHTML = 'No hay archivo';
        }
        console.log(fileUnoG);

    } 
    changeDos = function (){
        //console.log(this);
        fileDosG = this.event.target.files[0];
        $('#file-return-dos')[0].innerHTML = fileDosG.name;
        if ($('#file-return-uno')[0] && $('#file-return-uno')[0].innerHTML == ''){
            $('#file-return-uno')[0].innerHTML = 'No hay archivo';
        }
        console.log(fileDosG);

    } 
    changeTres = function (){
        //console.log(this);
        fileTresG = this.event.target.files[0];
        $('#file-return-tres')[0].innerHTML = fileTresG.name;
        if ($('#file-return-cuatro')[0] && $('#file-return-cuatro')[0].innerHTML == ''){
            $('#file-return-cuatro')[0].innerHTML = 'No hay archivo';
        }
        console.log(fileTresG);

    }   
    changeCuatro = function (){
        //console.log(this);
        fileCuatroG = this.event.target.files[0];
        $('#file-return-cuatro')[0].innerHTML = fileCuatroG.name;
        if ($('#file-return-tres')[0] && $('#file-return-tres')[0].innerHTML == ''){
            $('#file-return-tres')[0].innerHTML = 'No hay archivo';
        }
        console.log(fileCuatroG);

    } 

    modificarMuro = function(item){

        //validamos permiso
        if (ModificaMuro()) {

            var optionBaja = '<option value = "0">Baja</option>';
            var optionMedia = '<option value = "1">Media</option>';
            var optionAlta = '<option value = "2">Alta</option>';

            if (item.PrioridadId == 0)
                optionBaja = '<option value = "0" selected="selected">Baja</option>';
            if (item.PrioridadId == 1)
                optionMedia = '<option value = "1" selected="selected">Media</option>';
            if (item.PrioridadId == 2)
                optionAlta = '<option value = "2" selected="selected">Alta</option>';
            swal({
                title: 'Modificar Comentario',
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Enviar",
                cancelButtonText: "Cancelar",
                customClass: 'sweetalert-xs',
                width: '500px',
                html: '<div class="col-xs-12><label for="basic-url">Comentario</label><div class="input-group"  style="width: 100%;">' +
                '<textarea id="swal-input1" class="swal2-input"  style="width: 100%; height:150px; margin-bottom: 0;" maxlength="250">' + item.Texto + '</textarea>' + 
                /* '<input id="swal-input1" class="swal2-input" style="width: 100%;" value="' + item.Texto + '" />' + */
                '</div></div><div class="col-xs-12><label for="basic-url">Prioridad</label><div class="input-group"  style="width: 100%;">' +
                '<select id = "swal-input2" style="width: 100%;">' +
                optionBaja +
                optionMedia +
                optionAlta +
                '</select></div></div>',
                onBeforeOpen: () => {
                    $('#swal-input1').emoji({ place: 'after', rowSize: 15 });
                },
                preConfirm: function () {
                    // item.PrioridadId
                    //$('#swal-input2').val(item.PrioridadId);
                    return new Promise(function (resolve, reject) {
                        var texto = $('#swal-input1').val();
                        var prioridadId = $('#swal-input2').val();
                        var instId = sessionStorage.getItem("InstId");
                        var usuId = sessionStorage.getItem("Id");
                        var rolId = sessionStorage.getItem("RolId");
                        var mroId = item.Id;

                        if (texto === false) return false;
                        if (texto === "") {
                            reject("Debe ingresar comentario.");
                            return false
                        }
                        //aca todo bien
                        var entidad = {
                            InstId: instId,
                            UsuId: usuId,
                            PrioridadId: prioridadId,
                            RolId: rolId,
                            Texto: texto,
                            Id: mroId
                        };

                        setTimeout(function () {

                            $.ajax({
                                url: ObtenerUrl('Muro'),
                                type: 'PUT',
                                data: ko.toJSON(entidad),
                                contentType: "application/json",
                                dataType: "json",
                                complete: function (data) {
                                    swal({
                                        title: 'Guardado',
                                        text: "Registro guardado con éxito.",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonClass: "btn-success",
                                        customClass: 'sweetalert-xs',
                                        confirmButtonText: "Aceptar"
                                    }).then(function () {
                                        EnviarMensajeSignalR('Se ha modificado una Novedad al Muro.', "ListarMuro.html", "4", sessionStorage.getItem("RolId"), data);
                                        window.location.href = "ListarMuro.html";
                                    });


                                }
                            });

                        }, 2000);
                    })

                },
                onOpen: function () {
                    $('#swal-input1').focus()
                }
            }).then(function (result) {
                //swal(JSON.stringify(result))
            }).catch(swal.noop)
        }
        else{
            getNotify('error', 'Permisos', 'No tiene permisos para modificar, contacte al administrador');
        }


    }

    eliminarMuro = function (item) {
        if (EliminaMuro()) {
            var texto = "Está seguro de eliminar el comentario: " + item.Texto;
            var id = item.Id;

            swal({
                title: 'Eliminar',
                text: texto,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                showLoaderOnConfirm: true,
                preConfirm: function () {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {

                            $.ajax({
                                url: ObtenerUrl('Muro'),
                                type: "DELETE",
                                data: ko.toJSON({Id: id}),
                                contentType: "application/json",
                                dataType: "json",
                                success: function (dataF) {
                                    //swal("¡Eliminado!", "Registro Eliminado con éxito.", "success");
                                    swal({
                                        title: 'Eliminado',
                                        text: "Registro eliminado con éxito",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Aceptar'
                                    }).then(function () {
                                        EnviarMensajeSignalR('Se ha eliminado un mensaje del muro.', "ListarMuro.html", "2", sessionStorage.getItem("RolId"), dataF);
                                        window.location.href = "ListarMuro.html";
                                    })

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
                        }, 2000)
                    })
                },
                allowOutsideClick: false
            }).then(function () {
                swal({
                    type: 'success',
                    title: 'Ajax request finished!',
                    html: 'Registro Eliminado con éxito.'
                })
            })
        }
        else {
            getNotify('error', 'Permisos', 'No tiene permisos para eliminar, contacte al administrador');
        }

    }

    eliminarRespuestaMuro = function (item) {
        if (EliminaMuro()) {
            var texto = "Está seguro de eliminar el comentario: " + item.Texto;
            var id = item.Id;

            swal({
                title: 'Eliminar',
                text: texto,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                showLoaderOnConfirm: true,
                preConfirm: function () {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {

                            $.ajax({
                                url: ObtenerUrl('RespuestaMuro'),
                                type: "DELETE",
                                data: ko.toJSON({Id: id}),
                                contentType: "application/json",
                                dataType: "json",
                                success: function (dataF) {
                                    //swal("¡Eliminado!", "Registro Eliminado con éxito.", "success");
                                    swal({
                                        title: 'Eliminado',
                                        text: "Registro eliminado con éxito",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Aceptar'
                                    }).then(function () {
                                        EnviarMensajeSignalR('Se ha eliminado un mensaje del muro.', "ListarMuro.html", "2", sessionStorage.getItem("RolId"), dataF);
                                        window.location.href = "ListarMuro.html";
                                    })

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
                        }, 2000)
                    })
                },
                allowOutsideClick: false
            }).then(function () {
                swal({
                    type: 'success',
                    title: 'Ajax request finished!',
                    html: 'Registro Eliminado con éxito.'
                })
            })
        }
        else {
            getNotify('error', 'Permisos', 'No tiene permisos para eliminar, contacte al administrador');
        }

    }

    //tratamiento de archivos
    agregarArchivo = function(){
        if (listaArchivos){
            if (listaArchivos.length >= 4){
                //aviso de archivos excede cantidad
                let sms = getNotify('error', 'Archivos', 'Se permiten máximo 4 archivos en las novedades.');
                return;
            }
            else {
                var archivoAgregar = this.event.target.files[0];
                //verificar si ese elemento ya se encuentra o no en la lista
                if (verificaExisteArchivo(archivoAgregar) == false){
                    listaArchivos.push(archivoAgregar);
                    insertarElemento();
                }
                else {
                    let sms = getNotify('error', 'Archivos', 'Este archivo ya se encuentra agregado, intenete con otro.');
                    return;
                }
            }
        }
    }
    function insertarElemento(archivo){

        /*
                <h2>Listado de Archivos</h2>
        <ul class="list-group">
            <li class="list-group-item">
                <strong>Nombre Archivo </strong>
                <small class="pull-right cursorPointer" style="color: orangered;">
                    <i class="fa fa-trash-o fa-fw fa-2x"></i>
                </small>
                <span class="badge">54 Kb</span>
            </li>
        </ul>
        */
        var elem1 = document.getElementById('listadoArchivosAdjuntos')
        //borramos todos los elementos
        elem1.innerHTML = '';
        if (listaArchivos && listaArchivos.length > 0){
            var title = document.createElement('h5');
            elem1.appendChild(title);
            title.innerHTML += 'Mis Archivos Adjuntos';
            var ul = document.createElement('ul');
            ul.className = "list-group";
            elem1.appendChild(ul);
            listaArchivos.forEach(elemento => {
                var li = document.createElement('li');
                li.className = "list-group-item";
                li.style = "text-align:left;";
                ul.appendChild(li);
                var strong = document.createElement('strong');
                li.appendChild(strong);
                strong.innerHTML += elemento.name;
                var small = document.createElement('small');
                small.className = "pull-right cursorPointer";
                small.style = "color: orangered;"
                small.onclick = function (){
                    //console.log('on click' + elemento.name);
                    if (listaArchivos && listaArchivos.length >= 0){
                        var nueva = [];
                        listaArchivos.forEach(archivo => {
                            if (archivo.name != elemento.name){
                                nueva.push(archivo);
                            }
                        });
                        if (nueva.length >= 0){
                            listaArchivos = [];
                            listaArchivos = nueva;
                            //ahora recorremos la lista y volvemos a generar los elementos
                            if (listaArchivos.length > 0){
                                listaArchivos.forEach(ele => {
                                    insertarElemento(ele);
                                });
                            }
                            else {
                                //borrar todo
                                var elem1 = document.getElementById('listadoArchivosAdjuntos')
                                //borramos todos los elementos
                                elem1.innerHTML = '';
                            }
            
                        }
                
                    }
                };
                var icono = document.createElement('i');
                icono.className ="fa fa-trash-o fa-fw fa-2x";
                small.appendChild(icono);
                li.appendChild(small);
                var span = document.createElement('span');
                span.className = "badge";
                li.appendChild(span);
                span.innerHTML += parseInt(elemento.size / 1024) + ' Kb';
            });
        }

    }

    function verificaExisteArchivo(archivo){
        var existe = false;
        if (listaArchivos && listaArchivos.length > 0){
            listaArchivos.forEach(elemento => {
                if (archivo.name === elemento.name){
                    existe = true;
                }
            });
    
        }
        return existe;
    }

/*    EnviarMensaje = function (item) {
        /!*
         var mensaje = '';
         var MroId = item.MroId;
         var instId = sessionStorage.getItem("InstId");
         var usuId = sessionStorage.getItem("Id");
         var rolId = sessionStorage.getItem("RolId");
         *!/
        var textoOriginal = '<div class="col-xs-12">' +  item.Texto + "</div>";
        var prioridadId = item.PrioridadId;
        var mroId = item.Id;
        swal({
            title: 'Responder',
            showCancelButton: true,
            confirmButtonClass: "btn-success",
            confirmButtonText: "Enviar",
            cancelButtonText: "Cancelar",
            customClass: 'sweetalert-xs',
            html:
            textoOriginal +
            '<div class="col-xs-12><div class="input-group"  style="width: 100%;">' +
            '<input id="swal-input1" class="swal2-input" style="width: 100%;" />' +
            '</div></div>',
            preConfirm: function () {

                return new Promise(function (resolve, reject) {
                    var texto = $('#swal-input1').val();
                    var instId = sessionStorage.getItem("InstId");
                    var usuId = sessionStorage.getItem("Id");
                    var rolId = sessionStorage.getItem("RolId");



                    if (texto === false) return false;
                    if (texto === ""){
                        reject("Debe ingresar comentario.");
                        return false
                    }
                    //aca todo bien
                    var entidad = {
                        InstId: instId,
                        UsuId: usuId,
                        PrioridadId: prioridadId,
                        MroId: mroId,
                        RolId: rolId,
                        Texto: texto
                    };

                    setTimeout(function () {

                        $.ajax({
                            url: ObtenerUrl('RespuestaMuro'),
                            type: 'PUT',
                            data: ko.toJSON(entidad),
                            contentType: "application/json",
                            dataType: "json",
                            complete: function (data) {
                                swal({
                                    title: 'Guardado',
                                    text: "Registro guardado con éxito.",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonClass: "btn-success",
                                    customClass: 'sweetalert-xs',
                                    confirmButtonText: "Aceptar"
                                }).then(function () {
                                    EnviarMensajeSignalR('Se ha agregado una Respuesta al muro.', "ListarMuro.html", "4", sessionStorage.getItem("RolId"), data);
                                    window.location.href = "inicio.html";
                                });


                            }
                        });

                    }, 2000);
                    /!*
                     resolve([
                     $('#swal-input1').val(),
                     $('#swal-input2').val()
                     ])
                     *!/

                })

            },
            onOpen: function () {
                $('#swal-input1').focus()
            }
        }).then(function (result) {
            swal(JSON.stringify(result))
        }).catch(swal.noop)

    }

    guardarMuro = function(){


        /!*
         <select id = "swal-input2"><option value = "0">Baja</option><option value = "1">Media</option><option value = "2">Alta</option></select>
         '<label>Ingrese Comentario</label><input id="swal-input1" class="swal2-input">' +
         '<label>Prioridad</label><select id = "swal-input2"><option value = "0">Baja</option><option value = "1">Media</option><option value = "2">Alta</option></select>',



         '<div class="col-xs-12><label for="basic-url">Comentario</label><div class="input-group"><span class="input-group-addon" id="basic-addon6">' +
         '<i class="fa fa-comment"></i></span><input id="swal-input1" class="swal2-input" aria-describedby="basic-addon6" />' +
         '</div></div><div class="col-xs-12><label for="basic-url">Prioridad</label><div class="input-group"><span class="input-group-addon" id="basic-addon7">' +
         '<select id = "swal-input2" aria-describedby="basic-addon7"><option value = "0">Baja</option><option value = "1">Media</option><option value = "2">Alta</option></select></div></div>',
         *!/
        swal({
            title: 'Agregar Comentario',
            showCancelButton: true,
            confirmButtonClass: "btn-success",
            confirmButtonText: "Enviar",
            cancelButtonText: "Cancelar",
            customClass: 'sweetalert-xs',
            html:
            '<div class="col-xs-12><label for="basic-url">Comentario</label><div class="input-group"  style="width: 100%;">' +
            '<input id="swal-input1" class="swal2-input" style="width: 100%;" />' +
            '</div></div><div class="col-xs-12><label for="basic-url">Prioridad</label><div class="input-group"  style="width: 100%;">' +
            '<select id = "swal-input2" style="width: 100%;"><option value = "0">Baja</option><option value = "1">Media</option><option value = "2">Alta</option></select></div></div>',
            preConfirm: function () {

                return new Promise(function (resolve, reject) {
                    var texto = $('#swal-input1').val();
                    var prioridadId = $('#swal-input2').val();
                    var instId = sessionStorage.getItem("InstId");
                    var usuId = sessionStorage.getItem("Id");
                    var rolId = sessionStorage.getItem("RolId");

                    if (texto === false) return false;
                    if (texto === ""){
                        reject("Debe ingresar comentario.");
                        return false
                    }
                    //aca todo bien
                    var entidad = {
                        InstId: instId,
                        UsuId: usuId,
                        PrioridadId: prioridadId,
                        RolId: rolId,
                        Texto: texto
                    };

                    setTimeout(function () {

                        $.ajax({
                            url: ObtenerUrl('Muro'),
                            type: 'PUT',
                            data: ko.toJSON(entidad),
                            contentType: "application/json",
                            dataType: "json",
                            complete: function (data) {
                                swal({
                                    title: 'Guardado',
                                    text: "Registro guardado con éxito.",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonClass: "btn-success",
                                    customClass: 'sweetalert-xs',
                                    confirmButtonText: "Aceptar"
                                }).then(function () {
                                    EnviarMensajeSignalR('Se ha agregado una Novedad al Muro.', "ListarMuro.html", "4", sessionStorage.getItem("RolId"), data);
                                    window.location.href = "inicio.html";
                                });


                            }
                        });

                    }, 2000);
                })

            },
            onOpen: function () {
                $('#swal-input1').focus()
            }
        }).then(function (result) {
            swal(JSON.stringify(result))
        }).catch(swal.noop)

    }

    eliminarMuro = function (item) {
        var texto = "Está seguro de eliminar el comentario: " + item.Texto;
        var id = item.Id;

        swal({
            title: 'Eliminar',
            text: texto,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            preConfirm: function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(function() {

                        $.ajax({
                            url: ObtenerUrl('Muro'),
                            type: "DELETE",
                            data: ko.toJSON({ Id: id }),
                            contentType: "application/json",
                            dataType: "json",
                            success: function (dataF) {
                                //swal("¡Eliminado!", "Registro Eliminado con éxito.", "success");
                                swal({
                                    title: 'Eliminado',
                                    text: "Registro eliminado con éxito",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Aceptar'
                                }).then(function () {
                                    EnviarMensajeSignalR('Se ha eliminado un mensaje del muro.', "ListarMuro.html", "2", sessionStorage.getItem("RolId"), dataF);
                                    window.location.href = "inicio.html";
                                })

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
                    }, 2000)
                })
            },
            allowOutsideClick: false
        }).then(function () {
            swal({
                type: 'success',
                title: 'Ajax request finished!',
                html: 'Registro Eliminado con éxito.'
            })
        })


    }

    eliminarRespuestaMuro = function (item) {
        var texto = "Está seguro de eliminar el comentario: " + item.Texto;
        var id = item.Id;

        swal({
            title: 'Eliminar',
            text: texto,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            preConfirm: function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(function() {

                        $.ajax({
                            url: ObtenerUrl('RespuestaMuro'),
                            type: "DELETE",
                            data: ko.toJSON({ Id: id }),
                            contentType: "application/json",
                            dataType: "json",
                            success: function (dataF) {
                                //swal("¡Eliminado!", "Registro Eliminado con éxito.", "success");
                                swal({
                                    title: 'Eliminado',
                                    text: "Registro eliminado con éxito",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Aceptar'
                                }).then(function () {
                                    EnviarMensajeSignalR('Se ha eliminado un mensaje del muro.', "ListarMuro.html", "2", sessionStorage.getItem("RolId"), dataF);
                                    window.location.href = "inicio.html";
                                })

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
                    }, 2000)
                })
            },
            allowOutsideClick: false
        }).then(function () {
            swal({
                type: 'success',
                title: 'Ajax request finished!',
                html: 'Registro Eliminado con éxito.'
            })
        })


    }*/

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