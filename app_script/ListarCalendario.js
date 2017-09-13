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

    $('[data-toggle="tooltip"]').tooltip()
    function ViewModel(data) {
        var self = this;
        nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        // knockout mapping JSON data to view model

        /*
        if (sessionStorage.getItem("RolId") != '9')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);
        */

        Menu();

        ko.mapping.fromJS(data, {}, self);

    }

    var obtenerCalendario = jQuery.ajax({
        url : ObtenerUrl('Calendario'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), Tipo:'0'  })
    });

    $.when(obtenerCalendario).then(
        function(data){
            $('#principal').hide();
            $('#loading').show();

            YUI({ filter: 'raw', lang: 'es' }).use("aui-scheduler", "io", "dump", "json-parse", "event-custom-base", "aui-button", function (Y) {
                var items = [];
                var itemsProcesar = data;

                if (itemsProcesar != null && itemsProcesar.length > 0)
                {
                    for(var i in itemsProcesar)
                    {

                        var rolId = sessionStorage.getItem("RolId");
                        var disabled = true;
                        //por mientras solo para el Administrador
                        if (rolId != 9)
                            disabled = false;


                        var s = {
                            content: itemsProcesar[i].content,
                            startDate: new Date(itemsProcesar[i].annoIni,itemsProcesar[i].mesIni, parseInt(itemsProcesar[i].diaIni),  itemsProcesar[i].horaIni, itemsProcesar[i].minutosIni,0, 0),
                            endDate: new Date(itemsProcesar[i].annoTer, itemsProcesar[i].mesTer, parseInt(itemsProcesar[i].diaTer), itemsProcesar[i].horaTer, itemsProcesar[i].minutosTer, 0, 0),
                            isNew: false,
                            id: itemsProcesar[i].id,
                            disabled: disabled,
                            clientId : itemsProcesar[i].id
                        }
                        items[i] = s;
                    }
                }

                /*
                var eventRecorder = new Y.SchedulerEventRecorder({
                    on: {
                        delete: function (event) {
                            var popup = Y.one("#bb")._node.childNodes[1];
                            var cantidadNodos = popup.childNodes[0].length;
                            var titulo;
                            var startDate;
                            var endDate;
                            var esNuevo = true;

                            if (cantidadNodos > 6) {
                                titulo = popup.childNodes[0][0];
                                startDate = popup.childNodes[0][1];
                                endDate = popup.childNodes[0][2];
                                esNuevo = false;
                            }
                            else {
                                titulo = popup.childNodes[0][0];
                                startDate = popup.childNodes[0][1];
                                endDate = popup.childNodes[0][2];
                            }


                            var fechaIni = moment(parseFloat(startDate.value));
                            var fechaTer = moment(parseFloat(endDate.value));
                            var idUsuario = sessionStorage.getItem("Id");
                            var instId = sessionStorage.getItem("InstId");

                            var annoInicio = fechaIni.get('year');
                            var mesInicio = fechaIni.get('month') + 1;
                            var diaInicio = fechaIni.get('date');
                            var horaInicio = fechaIni.get('hour');
                            var minutoInicio = fechaIni.get('minute');

                            if (diaInicio < 10)
                                diaInicio = "0" + diaInicio;

                            if (mesInicio < 10)
                                mesInicio = "0" + mesInicio;

                            if (horaInicio < 10)
                                horaInicio = "0" + horaInicio;

                            if (minutoInicio < 10)
                                minutoInicio = "0" + minutoInicio;

                            var inicioStr = diaInicio + '-' + mesInicio + '-' + annoInicio + ' ' + horaInicio + ':' + minutoInicio;


                            var annoTer = fechaTer.get('year');
                            var mesTer = fechaTer.get('month') + 1;
                            var diaTer = fechaTer.get('date');
                            var horaTer = fechaTer.get('hour');
                            var minutoTer = fechaTer.get('minute');

                            if (diaTer < 10)
                                diaTer = "0" + diaTer;

                            if (mesTer < 10)
                                mesTer = "0" + mesTer;

                            if (horaTer < 10)
                                horaTer = "0" + horaTer;

                            if (minutoTer < 10)
                                minutoTer = "0" + minutoTer;

                            var terminoStr = diaTer + '-' + mesTer + '-' + annoTer + ' ' + horaTer + ':' + minutoTer;



                            var eventoCal = {
                                InstId: instId,
                                IdUsuario: idUsuario,
                                Titulo: titulo.value,
                                FechaInicio: inicioStr,
                                FechaTermino: terminoStr,
                                EsNuevo: esNuevo}

                            var json = ko.toJSON(eventoCal);

                            Eliminar(json);

                            // Note: The cancel event seems to be buggy and occurs at the wrong times, so I commented it out.
                            //      },
                            //      cancel: function(event) {
                            //        alert('Cancel Event:' + this.isNew() + ' --- ' + this.getContentNode().val());
                        },
                        save: function (guardar) {
                            var popup = Y.one("#bb")._node.childNodes[1];
                            var titulo = popup.childNodes[0][0];
                        },
                        edit: function (otro) {
                            var popup = Y.one("#bb")._node.childNodes[1];
                            var titulo = popup.childNodes[0][0];
                        }
                    }
                });
                */

                var eventRecorder = new Y.SchedulerEventRecorder();

                Y.Do.after(function () {
                    var rolId = sessionStorage.getItem("RolId");
                    var instId = sessionStorage.getItem("InstId");
                    var usuId = sessionStorage.getItem("Id");
                    var popup = Y.one("#bb")._node.childNodes[1];
                    //veamos si podemos modificar esta vista
                    //principal

                    var cantidadNodos = popup.childNodes[0].length;
                    var esNuevo = false;

                    if (cantidadNodos <= 5)
                        esNuevo = true;

                    //obtenemos los valores que trae los elementos
                    var evento;
                    var fechaInicio= new Date(parseInt(popup.childNodes[0][1].defaultValue));
                    var fechaTermino = new Date(parseInt(popup.childNodes[0][2].defaultValue));

                    var fechaInicioStr = FechaString(fechaInicio);
                    var fechaTerminoStr = FechaString(fechaTermino);

                    var fechaInicioEntera = FechaEntera(fechaInicio);
                    var fechaTerminoEntera = FechaEntera(fechaTermino);


                    //antes de todo verificamos si el usuario puede o no modificar o crear
                    if (esNuevo == false) {
                        //recogemos algunos valores para verificar el usuario que realizó el evento
                        var nombre = popup.childNodes[0][0].value;

                        var validarCalendario = jQuery.ajax({
                            url: ObtenerUrl('Calendario') + '?instId=' + instId + '&usuIdCreador=' + usuId + '&fechaInicioEntera=' + fechaInicioEntera + '&fechaTerminoEntera=' + fechaTerminoEntera + '&nombre=' + nombre,
                            type: 'GET',
                            dataType: "json",
                            contentType: "application/json"
                        });

                        //si el retorno = 1 si puede modificar

                        $.when(validarCalendario).then(
                            function (data) {
                                if (data.Valor != null)
                                {
                                    //ahora solo se puede modificar o eliminar siempre y cuando el tipo sea 1
                                    if (data.Tipo != 1)
                                    {
                                        getNotify('error', 'Error', 'No puede modificar o eliminar este evento (Es un Proyecto o Tricel)');
                                        eventRecorder.hidePopover();
                                    }
                                }
                                else
                                {
                                    getNotify('error', 'Error', 'Este evento fue creado por otra persona, no lo puede modificar.');
                                    eventRecorder.hidePopover();
                                }

                            },
                            function (error) {
                                getNotify('error', 'Error', 'Hubo un error al validar, contacte al Administrador');
                                eventRecorder.hidePopover();
                            }
                        );
                    }



                    var otroPrincipal = Y.one("#bb .popover-title");
                    var content = Y.one("#bb .popover-content");

                    //del content hay que sacar el nodo[2]
                    content._node.childNodes[2].className = "hidden";

                    var newNodeInicio = Y.Node.create('<span class="col-xs-4" style="margin-top: 10px;">Inicio: </span><input type="text" style="margin-top: 10px;" value="' + fechaInicioStr + '" id="datetimepickerInicio" class="col-xs-8">');


                    var newNodeTermino = Y.Node.create('<span class="col-xs-4" style="margin-top: 10px;">Término: </span><input type="text" style="margin-top: 10px;" value="' + fechaTerminoStr + '" id="datetimepickerTermino" class="col-xs-8">');


                    if (esNuevo == false)
                    {
                        //desactivamos las fechas ya que para modificar no se puede.
                        newNodeInicio._node.childNodes[1].disabled = true;
                        newNodeTermino._node.childNodes[1].disabled = true;
                        newNodeInicio.setStyle('margin-top', '5px');
                        newNodeTermino.setStyle('margin-top', '5px');

                    }
                    else
                    {
                        newNodeInicio.setStyle('margin-top', '5px');
                        newNodeTermino.setStyle('margin-top', '5px');
                    }


                    otroPrincipal.appendChild(newNodeInicio);
                    otroPrincipal.appendChild(newNodeTermino);

                    $('#datetimepickerInicio').datetimepicker({
                        format: 'dd-mm-yyyy hh:ii'
                    });
                    $('#datetimepickerTermino').datetimepicker({
                        format: 'dd-mm-yyyy hh:ii'
                    });

                    //botonera
                    var toolbarBtnGroup = Y.one("#bb .btn-toolbar-content .btn-group");

                    //ahora debemos trabajar con los botones, dependiendo si es nuevo o no es la cantidad de botones que trae
                    //vamos a crear igual los tres y vemos cual o cual mostramos

                    var newNodeObjectCancelar = Y.Node.create('<button id="cancelar" type="button" class="btn btn-default" style="margin-top: 10px;">Cancelar</button>');
                    //evento Cancelar
                    newNodeObjectCancelar.on('click', function(event){
                        eventRecorder.hidePopover();
                    });


                    var newNodeObjectInsertar = Y.Node.create('<button id="insertar" type="button" class="btn btn-success" style="margin-top: 10px;">Guardar</button>');
                    //evento click
                    newNodeObjectInsertar.on('click', function(event){
                        var popupInsertar = Y.one("#bb")._node.childNodes[1];
                        var nombre = popupInsertar.childNodes[0][0].value;
                        var otroPrincipal = Y.one("#bb .popover-title");

                        //variables
                        var fechaHoraInicio = otroPrincipal._node.childNodes[2].value;
                        var fechaHoraTermino = otroPrincipal._node.childNodes[4].value;
                        var fechaEnteraInicio = FechaEnteraStr(fechaHoraInicio);
                        var fechaEnteraTermino = FechaEnteraStr(fechaHoraTermino);
                        var fechaEnteraHoy = FechaEntera(new Date());

                        var eventoCal = {
                            InstId : instId,
                            IdUsuario : usuId,
                            UsuIdCreador : usuId,
                            Titulo: nombre,
                            FechaInicio: fechaHoraInicio,
                            FechaTermino: fechaHoraTermino,
                            EsNuevo: esNuevo

                        }

                        if (nombre == 'Ingrese nuevo Evento' || nombre == '')
                        {
                            getNotify('error', 'Inválido', 'Nombre inválido, ingrese otro');
                            popup.childNodes[0][0].defaultValue = "";
                            return;
                        }
                        //primero que la fecha de inicio no sea mayor a la de termino
                        if (fechaEnteraInicio > fechaEnteraTermino)
                        {
                            getNotify('error', 'Fecha', 'La fecha de inicio no puede ser mayor a la de término.');
                            return;
                        }
                        //que ambas fechas no sean menores a la fecha actual
                        if (fechaEnteraInicio < fechaEnteraHoy && fechaEnteraTermino < fechaEnteraHoy)
                        {
                            getNotify('error', 'Fecha', 'No puede generar un evento con fechas pasadas.');
                            return;
                        }


                        var json = ko.toJSON(eventoCal);
                        //acá se debe validar que la fecha de inicio no sea menor a la fecha actual
                        Insertar(json, eventRecorder);


                    });

                    var newNodeObjectModificar = Y.Node.create('<button id="modificar" type="button" class="btn btn-success" style="margin-top: 10px;">Modificar</button>');
                    //evento click
                    newNodeObjectModificar.on('click', function(event){
                        //alert('modificar');
                        var popupInsertar = Y.one("#bb")._node.childNodes[1];
                        var nombre = popupInsertar.childNodes[0][0].value;
                        var otroPrincipal = Y.one("#bb .popover-title");

                        //variables
                        var fechaHoraInicio = otroPrincipal._node.childNodes[2].value;
                        var fechaHoraTermino = otroPrincipal._node.childNodes[4].value;

                        //deshabilitamos los controles
                        otroPrincipal._node.childNodes[2].disabled = true;

                        var fechaEnteraInicio = FechaEnteraStr(fechaHoraInicio);
                        var fechaEnteraTermino = FechaEnteraStr(fechaHoraTermino);
                        var fechaEnteraHoy = FechaEntera(new Date());

                        var eventoCal = {
                            InstId : instId,
                            IdUsuario : usuId,
                            UsuIdCreador : usuId,
                            Titulo: nombre,
                            FechaInicio: fechaHoraInicio,
                            FechaTermino: fechaHoraTermino,
                            EsNuevo: false

                        }

                        if (nombre == 'Ingrese nuevo Evento' || nombre == '')
                        {
                            getNotify('error', 'Inválido', 'Nombre inválido, ingrese otro');
                            popup.childNodes[0][0].defaultValue = "";
                            return;
                        }
                        //primero que la fecha de inicio no sea mayor a la de termino
                        if (fechaEnteraInicio > fechaEnteraTermino)
                        {
                            getNotify('error', 'Fecha', 'La fecha de inicio no puede ser mayor a la de término.');
                            return;
                        }
                        //que ambas fechas no sean menores a la fecha actual
                        if (fechaEnteraInicio < fechaEnteraHoy && fechaEnteraTermino < fechaEnteraHoy)
                        {
                            getNotify('error', 'Fecha', 'No puede modificar un evento con fechas pasadas.');
                            return;
                        }


                        var json = ko.toJSON(eventoCal);
                        //acá se debe validar que la fecha de inicio no sea menor a la fecha actual
                        Modificar(json);

                    });

                    var newNodeObjectEliminar = Y.Node.create('<button id="eliminar" type="button" class="btn btn-danger" style="margin-top: 10px;">Eliminar</button>');
                    //evento click
                    newNodeObjectEliminar.on('click', function(event){
                        var popupInsertar = Y.one("#bb")._node.childNodes[1];
                        var nombre = popupInsertar.childNodes[0][0].value;
                        var otroPrincipal = Y.one("#bb .popover-title");

                        //variables
                        var fechaHoraInicio = otroPrincipal._node.childNodes[2].value;
                        var fechaHoraTermino = otroPrincipal._node.childNodes[4].value;

                        //deshabilitamos los controles
                        otroPrincipal._node.childNodes[2].disabled = true;

                        var fechaEnteraInicio = FechaEnteraStr(fechaHoraInicio);
                        var fechaEnteraTermino = FechaEnteraStr(fechaHoraTermino);
                        var fechaEnteraHoy = FechaEntera(new Date());

                        var eventoCal = {
                            InstId : instId,
                            IdUsuario : usuId,
                            UsuIdCreador : usuId,
                            Titulo: nombre,
                            FechaInicio: fechaHoraInicio,
                            FechaTermino: fechaHoraTermino,
                            EsNuevo: false

                        }

                        var json = ko.toJSON(eventoCal);
                        //acá se debe validar que la fecha de inicio no sea menor a la fecha actual
                        Eliminar(json);

                    });
                    //para todos va el cancelar
                    toolbarBtnGroup.appendChild(newNodeObjectCancelar);

                    if (esNuevo) {
                        //trae solo dos botones
                        popup.childNodes[0][0].defaultValue = "Ingrese nuevo Evento";
                        toolbarBtnGroup._node.childNodes[0].className = "hidden";
                        toolbarBtnGroup._node.childNodes[1].className = "hidden";

                        toolbarBtnGroup.appendChild(newNodeObjectInsertar);

                    }
                    else
                    {
                        //trae 3 botones
                        toolbarBtnGroup._node.childNodes[0].className = "hidden";
                        toolbarBtnGroup._node.childNodes[1].className = "hidden";
                        toolbarBtnGroup._node.childNodes[2].className = "hidden";

                        toolbarBtnGroup.appendChild(newNodeObjectEliminar);
                        toolbarBtnGroup.appendChild(newNodeObjectModificar);
                    }




                    //toolbarBtnGroup.removeAll();
                    //toolbarBtnGroup.appendChild('<button id="guardar" type="button" class="btn btn-success">Guardar</button>');

                }, eventRecorder, 'showPopover');

                Y.Do.before(function () {
                    var rolId = sessionStorage.getItem("RolId");
                    if (rolId == 9)
                    {
                        getNotify('error', 'Permisos', 'No tiene acceso a modificar o crear eventos.');
                        eventRecorder.hidePopover();
                    }



                }, eventRecorder, 'showPopover');

                var schedulerViews = [
                    new Y.SchedulerWeekView(),
                    new Y.SchedulerDayView(),
                    new Y.SchedulerMonthView(),
                    new Y.SchedulerAgendaView()
                ];

                new Y.Scheduler({
                    strings: { agenda: 'Agenda', day: 'Dia', month: 'Mes', today: 'Hoy', week: 'Semana', year: 'Año', save: 'Guardar', delete: 'Eliminar' },
                    boundingBox: '#bb',
                    items: items,
                    views: schedulerViews,
                    activeView: schedulerViews[2],
                    eventRecorder: eventRecorder

                }).render();





            });

            $('#principal').show();
            $('#loading').hide();

            elem = document.getElementById('principal');

            ko.applyBindings(new ViewModel(data), elem);

        },
        function (){
            //alguna ha fallado
            alert('error');
            $('#principal').show();
            $('#loading').hide();
        },
        function(){
            //acá podemos quitar el elemento cargando
            alert('quitar cargando');
        }
    )

    //mover dentro de la llamada ajax
    $('#principal').show();
    $('#loading').hide();


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

    function Insertar(jsonEntidad, eventRecorder)
    {
        //solo puede crear si tiene rol
        if (CreaCalendario()) {
            $.ajax({
                url: ObtenerUrl('Calendario'),
                type: "PUT",
                data: jsonEntidad,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    //TODO OK INFORMAR EL GUARDADO CORRECTO

                    swal({
                            title: "Guardado",
                            text: "El Registro ha sido guardado con éxito.",
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
                                EnviarMensajeSignalR('Se ha creado un nuevo evento.', "ListarCalendario.html", "4", sessionStorage.getItem("RolId"), result);
                                window.location.href = "ListarCalendario.html";
                            } else {
                                swal("Cancelled", "Your imaginary file is safe :)", "error");
                            }
                        });
                },
                error: function (error) {
                    if (error.status.toString() == "500") {
                        getNotify('error', 'Error', 'Error en el Servidor.');
                    }
                    else {
                        getNotify('error', 'Error', 'Error en el Servidor.');
                        //alert("fail");
                    }
                }
            });
        }
        else
        {
            swal("Permiso", "No tiene permisos para crear evento.", "error");
        }
    }

    function Modificar(jsonEntidad) {
        if (ModificaCalendario()) {
            swal({
                title: "Modificar",
                text: "¿Está seguro de modificar este evento del Calendario?",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {


                    setTimeout(function () {

                        $.ajax({
                            url: ObtenerUrl('Calendario'),
                            type: "PUT",
                            data: jsonEntidad,
                            contentType: "application/json",
                            dataType: "json",
                            success: function (result) {
                                //TODO OK INFORMAR EL GUARDADO CORRECTO

                                swal({
                                        title: "Guardado",
                                        text: "El Registro ha sido guardado con éxito.",
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
                                            EnviarMensajeSignalR('Se ha modificado un evento.', "ListarCalendario.html", "4", sessionStorage.getItem("RolId"), result);
                                            window.location.href = "ListarCalendario.html";
                                        } else {
                                            swal("Cancelled", "Your imaginary file is safe :)", "error");
                                        }
                                    });
                            },
                            error: function (error) {
                                if (error.status.toString() == "500") {
                                    getNotify('error', 'Error', 'Error en el Servidor.');
                                }
                                else {
                                    getNotify('error', 'Error', 'Error en el Servidor.');
                                    //alert("fail");
                                }
                            }
                        });

                        //swal("Ajax request finished!");

                    }, 2000);

                }
                else {
                    window.location.href = "ListarCalendario.html";
                }
            });


        }
        else
        {
            swal("Permiso", "No tiene permisos para modificar evento.", "error");
        }

    }

    function Eliminar(jsonEntidad) {
        if (EliminaCalendario()) {
            swal({
                title: "Eliminar",
                text: "¿Está seguro de eliminar este evento del Calendario?",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {


                    setTimeout(function () {

                        $.ajax({
                            url: ObtenerUrl('Calendario'),
                            type: "DELETE",
                            data: jsonEntidad,
                            contentType: "application/json",
                            dataType: "json",
                            success: function (result) {
                                //TODO OK INFORMAR EL GUARDADO CORRECTO
                                if (result == null) {
                                    swal({
                                            title: "Eliminado",
                                            text: "El Registro NO se eliminó, no existe, revise si el nombre del evento fué cambiado.",
                                            type: "error",
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
                                                EnviarMensajeSignalR('Se ha eliminado un evento.', "ListarCalendario.html", "4", sessionStorage.getItem("RolId"), result);
                                                window.location.href = "ListarCalendario.html";
                                            } else {
                                                swal("Cancelled", "Your imaginary file is safe :)", "error");
                                            }
                                        });
                                }
                                else {
                                    swal({
                                            title: "Eliminado",
                                            text: "El Registro ha sido eliminado con éxito.",
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
                                                window.location.href = "ListarCalendario.html";
                                            } else {
                                                swal("Cancelled", "Your imaginary file is safe :)", "error");
                                            }
                                        });
                                }
                            },
                            error: function (error) {
                                if (error.status.toString() == "500") {
                                    getNotify('error', 'Error', 'Error en el Servidor.');
                                }
                                else {
                                    getNotify('error', 'Error', 'Error en el Servidor.');
                                    //alert("fail");
                                }
                            }
                        });

                        //swal("Ajax request finished!");

                    }, 2000);

                }
                else {
                    window.location.href = "ListarCalendario.html";
                }
            });

        }
        else
        {
            swal("Permiso", "No tiene permisos para eliminar evento.", "error");
        }


    }

});