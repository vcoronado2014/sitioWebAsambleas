
/**
 * Created by vcoronado on 31-03-2017.
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


                var s = {
                    nombre: itemsProcesarT[i].NombreUsuario,
                    objetivo: itemsProcesarT[i].NombreCompleto,
                    fechaInicio : itemsProcesarT[i].OtroUno,
                    fechaTermino : itemsProcesarT[i].OtroDos,
                    fechaCreacion: itemsProcesarT[i].OtroTres,
                    urlVotar: 'VotarTricel.html?id=' + itemsProcesarT[i].Id + '&puedeVotar=' + itemsProcesarT[i].OtroSiete,
                    puedeVotar: disabled,
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

    EnviarMensaje = function (item) {
        /*
         var mensaje = '';
         var MroId = item.MroId;
         var instId = sessionStorage.getItem("InstId");
         var usuId = sessionStorage.getItem("Id");
         var rolId = sessionStorage.getItem("RolId");
         */
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
            swal(JSON.stringify(result))
        }).catch(swal.noop)

    }

    guardarMuro = function(){


        /*
         <select id = "swal-input2"><option value = "0">Baja</option><option value = "1">Media</option><option value = "2">Alta</option></select>
         '<label>Ingrese Comentario</label><input id="swal-input1" class="swal2-input">' +
         '<label>Prioridad</label><select id = "swal-input2"><option value = "0">Baja</option><option value = "1">Media</option><option value = "2">Alta</option></select>',



         '<div class="col-xs-12><label for="basic-url">Comentario</label><div class="input-group"><span class="input-group-addon" id="basic-addon6">' +
         '<i class="fa fa-comment"></i></span><input id="swal-input1" class="swal2-input" aria-describedby="basic-addon6" />' +
         '</div></div><div class="col-xs-12><label for="basic-url">Prioridad</label><div class="input-group"><span class="input-group-addon" id="basic-addon7">' +
         '<select id = "swal-input2" aria-describedby="basic-addon7"><option value = "0">Baja</option><option value = "1">Media</option><option value = "2">Alta</option></select></div></div>',
         */
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