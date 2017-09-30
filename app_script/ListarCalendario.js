/**
 * Created by VICTOR CORONADO on 29/09/2017.
 */
$(document).ready(function() {
    var datepicker = $.fn.datepicker.noConflict();
    $.fn.bootstrapDP = datepicker;
    $("#datetimepicker13").bootstrapDP();
    // $('#datetimepicker1').datetimepicker();

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
/*    $('#principal').hide();
    $('#loading').show();*/

    $('#loading').hide();

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


    $('#external-events div.external-event').each(function() {

        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
            title: $.trim($(this).text()) // use the element's text as the event title
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
        });

    });
    //$('#calendar').fullCalendar('render');
    //$('#calendar').fullCalendar('refresh');

    function ViewModel(data) {
         var self = this;
         dataCalendar = ko.observableArray(data);
         nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
         self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
         nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
         self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));

         Menu();
         /*var calendar =  $('#calendar').fullCalendar({
            header: {
                left: 'title',
                center: 'agendaDay,agendaWeek,month',
                right: 'prev,next today'
            },
            editable: true,
            firstDay: 1, //  1(Monday) this can be changed to 0(Sunday) for the USA system
            selectable: true,
            defaultView: 'month',
            axisFormat: 'h:mm',
            columnFormat: {
                month: 'ddd',    // Mon
                week: 'ddd d', // Mon 7
                day: 'dddd M/d',  // Monday 9/7
                agendaDay: 'dddd d'
            },
            titleFormat: {
                month: 'MMMM yyyy', // September 2009
                week: "MMMM yyyy", // September 2009
                day: 'MMMM yyyy'                  // Tuesday, Sep 8, 2009
            },
            allDaySlot: false,
            selectHelper: true,
            select: function(start, end, allDay) {

                //construìmos la vista para guardar
                var hiddenLabel = '<input type="hidden" id="swal-input-hidden" value="0">';
                var labelTitulo = '<label for="basic-url" class="text-right">Titulo</label>';
                var inputGroupTitulo = '<div class="input-group"><span class="input-group-addon" id="sizing-addon1"><span class="glyphicon glyphicon-exclamation-sign"></span></span>';
                var inputTitulo = '<input type="text" class="form-control" placeholder="Titulo" aria-describedby="sizing-addon1" id="swal-input1"></div>';
                var labelFechas = '<label for="basic-url" class="text-right">Inicio y fin</label>';
                var inputGroupFechas = '<div class="input-group"><span class="input-group-addon" id="sizing-addon2"><span class="glyphicon glyphicon-calendar"></span></span>';
                var inputFechaInicio = '<input type="datetime-local" class="form-control" placeholder="hora" aria-describedby="sizing-addon2" id="swal-input2">';
                var spanGroup = '<span class="input-group-addon" id="sizing-addon3"><span class="glyphicon glyphicon-calendar"></span></span>';
                var inputFechaTermino = '<input type="datetime-local" class="form-control" placeholder="hora" aria-describedby="sizing-addon2" id="swal-input3"></div>';
                var inputGroupCheck = '<div class="input-group"><div class="checkbox"><label>';
                var inputCheck = '<input type="checkbox" id="swal-input4">Todo el día</label></div></div>';

                var labelEtiqueta = '<label for="basic-url">Etiqueta</label><div class="input-group" style="padding-bottom: 30px;"><span class="input-group-addon" id="basic-addon8"><i class="fa fa-globe"></i></span>';
                var selectEiqueta = '<select id="selectIdEtiqueta" class="form-control">';
                var optionNinguna = '<option value="0">Ninguna</option>';
                var optionInfo = '<option value="1">Información</option>';
                var optionImportante = '<option value="2">Importante</option>';
                var optionMuyImportante = '<option value="3">Muy importante</option>';
                var cierreOption = '</select></div>';

                var htmlFinal =hiddenLabel + labelTitulo + inputGroupTitulo + inputTitulo + labelFechas + inputGroupFechas + inputFechaInicio + spanGroup + inputFechaTermino + inputGroupCheck + inputCheck;
                htmlFinal = htmlFinal + labelEtiqueta + selectEiqueta + optionNinguna + optionInfo + optionImportante + optionMuyImportante + cierreOption;


                swal({
                    title: 'Nuevo Evento',
                    html: htmlFinal,
                    width: '90%',
                    showCancelButton: true,
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar',
                    showLoaderOnConfirm: true,
                    preConfirm: function (email) {
                        return new Promise(function (resolve, reject) {
                            setTimeout(function() {
                                //aca resolver
                                resolve([
                                    $('#swal-input1').val(),
                                    $('#swal-input2').val()
                                ])
                            }, 2000)
                        })
                    },
                    allowOutsideClick: false
                }).then(function (email) {
                    swal({
                        type: 'success',
                        title: 'Ajax request finished!',
                        html: 'Submitted email: ' + email
                    })
                })

            },
            droppable: false, // this allows things to be dropped onto the calendar !!!
            drop: function(date, allDay) { // this function is called when something is dropped

                // retrieve the dropped element's stored Event Object
                var originalEventObject = $(this).data('eventObject');

                // we need to copy it, so that multiple events don't have a reference to the same object
                var copiedEventObject = $.extend({}, originalEventObject);

                // assign it the date that was reported
                copiedEventObject.start = date;
                copiedEventObject.allDay = allDay;

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                // is the "remove after drop" checkbox checked?
                if ($('#drop-remove').is(':checked')) {
                    // if so, remove the element from the "Draggable Events" list
                    $(this).remove();
                }

            },
            eventClick:  function(event, jsEvent, view) {
                var evento = event;
                var eventId = event._id;
                var fechaInicio = moment(event.start, 'America/New_York').local().format('YYYY-MM-DDThh:mm');
                var fechaTermino;
                if (event.end){
                    fechaTermino = moment(event.end, 'America/New_York').local().format('YYYY-MM-DDThh:mm');
                }
                else{

                }
                //"yyyy-MM-ddThh:mm"
                var titulo = event.title;
                var todoElDia = event.allDay;
                //construccion dinámica del html
                var hiddenLabel = '<input type="hidden" id="swal-input-hidden" value="' + eventId + '">';
                var labelTitulo = '<label for="basic-url" class="text-right">Titulo</label>';
                var inputGroupTitulo = '<div class="input-group"><span class="input-group-addon" id="sizing-addon1"><span class="glyphicon glyphicon-exclamation-sign"></span></span>';
                var inputTitulo = '<input type="text" class="form-control" placeholder="Titulo" aria-describedby="sizing-addon1" id="swal-input1" value="' + titulo + '"></div>';
                var labelFechas = '<label for="basic-url" class="text-right">Inicio y fin</label>';
                var inputGroupFechas = '<div class="input-group"><span class="input-group-addon" id="sizing-addon2"><span class="glyphicon glyphicon-calendar"></span></span>';
                var inputFechaInicio = '<input type="datetime-local" class="form-control" placeholder="hora" aria-describedby="sizing-addon2" id="swal-input2" value="' + fechaInicio + '">';
                var spanGroup = '<span class="input-group-addon" id="sizing-addon3"><span class="glyphicon glyphicon-calendar"></span></span>';
                var inputFechaTermino = '<input type="datetime-local" class="form-control" placeholder="hora" aria-describedby="sizing-addon2" id="swal-input3" value="' + fechaTermino + '"></div>';
                var inputGroupCheck = '<div class="input-group"><div class="checkbox"><label>';
                var inputCheck = '';
                if (todoElDia)
                    inputCheck = '<input type="checkbox" checked="checked" id="swal-input4">Todo el día</label></div></div>';
                else
                    inputCheck = '<input type="checkbox" id="swal-input4">Todo el día</label></div></div>';

                var labelEtiqueta = '<label for="basic-url">Etiqueta</label><div class="input-group"><span class="input-group-addon" id="basic-addon8"><i class="fa fa-globe"></i></span>';
                var selectEiqueta = '<select id="selectIdEtiqueta" class="form-control">';
                var optionNinguna = '<option value="0">Ninguna</option>';
                if (event.className == '')
                    optionNinguna = '<option value="0" selected>Ninguna</option>';
                var optionInfo = '<option value="1">Información</option>';
                if (event.className == 'info')
                    optionInfo = '<option value="1" selected>Información</option>';
                var optionImportante = '<option value="2">Importante</option>';
                if (event.className == 'success')
                    optionImportante = '<option value="2" selected>Importante</option>';
                var optionMuyImportante = '<option value="3">Muy importante</option>';
                if (event.className == 'important')
                    optionMuyImportante = '<option value="3" selected>Muy importante</option>';
                var cierreOption = '</select></div>';


                var htmlFinal =hiddenLabel + labelTitulo + inputGroupTitulo + inputTitulo + labelFechas + inputGroupFechas + inputFechaInicio + spanGroup + inputFechaTermino + inputGroupCheck + inputCheck;
                htmlFinal = htmlFinal + labelEtiqueta + selectEiqueta + optionNinguna + optionInfo + optionImportante + optionMuyImportante + cierreOption;


                $.sweetModal({
                    title: 'Titulo',
                    content: htmlFinal,

                    buttons: {
                        someOtherAction: {
                            label: 'Eliminar',
                            classes: 'redB bordered flat',
                            action: function() {
                                var idEliminar = $('#swal-input-hidden').val();
                                var titulo = $('#swal-input1').val();
                                var fecha1 = moment($('#swal-input2').val());
                                var fecha2 = moment($('#swal-input3').val());
                                var etiqueta = $('#selectIdEtiqueta').val();
                                eliminarEvento(titulo, fecha1, fecha2, idEliminar, etiqueta);
                                //return $.sweetModal('You clicked Action 2!');
                            }
                        },

                        someAction: {
                            label: 'Guardar',
                            classes: 'secondaryB bordered flat',
                            action: function() {
                                return $.sweetModal('You clicked Action 1!');
                            }
                        }
                    }
                });
            },

            events: dataCalendar[0]

        });*/

        // $('#principal').show();
        // $('#loading').hide();
         //ko.mapping.fromJS(data, {}, self);

    }

    function eliminarEvento(titulo, fechaInicio, fechaTermino, eventId, etiqueta){

        if (EliminaCalendario()) {

            swal({
                title: 'Está seguro de eliminar',
                showCancelButton: true,
                confirmButtonText: 'Si!',
                cancelButtonText: 'No!',
                showLoaderOnConfirm: true,
                preConfirm: function () {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            var instId = sessionStorage.getItem("InstId");
                            var usuId = sessionStorage.getItem("Id");

                            var eventoCal = {
                                Id: eventId,
                                InstId : instId,
                                IdUsuario : usuId,
                                UsuIdCreador : usuId,
                                Titulo: titulo,
                                FechaInicio: fechaInicio,
                                FechaTermino: fechaTermino,
                                EsNuevo: false

                            };

                            var json = ko.toJSON(eventoCal);

                            $.ajax({
                                url: ObtenerUrl('Calendario'),
                                type: "DELETE",
                                data: json,
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
                                                customClass: 'sweetalert-xs'

                                            },
                                            function (isConfirm) {
                                                if (isConfirm) {
                                                    //swal("Deleted!", "Your imaginary file has been deleted.", "success");
                                                    $('#calendar').fullCalendar('removeEvents',eventId);
                                                    EnviarMensajeSignalR('Se ha eliminado un evento.', "ListarCalendario.html", "4", sessionStorage.getItem("RolId"), result);
                                                    window.location.href = "ListarCalendario.html";
                                                } else {
                                                    swal("Cancelled", "Your imaginary file is safe :)", "error");
                                                }
                                            });
                                    }
                                    else {
                                        EnviarMensajeSignalR('Se ha eliminado un evento.', "ListarCalendario.html", "4", sessionStorage.getItem("RolId"), result);
                                        $('#calendar').fullCalendar('removeEvents',eventId);

                                        swal({
                                            title: 'Eliminado con éxito',
                                            type: 'success',
                                            html: '<p>El registro fué eliminado con éxito</p>',
                                            showCancelButton: false,
                                            confirmButtonColor: '#3085d6',
                                            confirmButtonText: 'Cerrar',
                                            allowOutsideClick: false
                                        }).then(function (result) {
                                            //window.location = 'ListarCalendario.html';
                                        })

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

                        }, 2000)
                    })
                },
                allowOutsideClick: false
            }).then(function () {
                $('#calendar').fullCalendar('removeEvents', eventId);
                swal({
                    type: 'success',
                    title: 'Evento eliminado!',
                    html: 'Titulo: ' + titulo + etiqueta
                })
            })
        }
        else {
            getNotify('error', 'Error', 'No tiene permisos para eliminar eventos.');
        }

    }

    /*function crearEvento(titulo, fechaInicio, fechaTermino, etiqueta){


        //variables
        var instId = sessionStorage.getItem("InstId");
        var usuId = sessionStorage.getItem("Id");
        var fechaHoraInicio = fechaInicio;
        var fechaHoraTermino = fechaTermino;
        var fechaEnteraInicio = FechaEnteraStrT(fechaHoraInicio);
        var fechaEnteraTermino = FechaEnteraStrT(fechaHoraTermino);
        var fechaEnteraHoy = FechaEntera(new Date());

        if (titulo == '')
        {
            getNotify('error', 'Inválido', 'Nombre inválido, ingrese otro');
            reject();
            return;
        }
        //primero que la fecha de inicio no sea mayor a la de termino
        if (fechaEnteraInicio > fechaEnteraTermino)
        {
            getNotify('error', 'Fecha', 'La fecha de inicio no puede ser mayor a la de término.');
            reject();
            return;
        }
        //que ambas fechas no sean menores a la fecha actual
        if (fechaEnteraInicio < fechaEnteraHoy && fechaEnteraTermino < fechaEnteraHoy)
        {
            getNotify('error', 'Fecha', 'No puede generar un evento con fechas pasadas.');
            reject();
            return;
        }

        var eventoCal = {
            InstId : instId,
            IdUsuario : usuId,
            UsuIdCreador : usuId,
            Titulo: titulo,
            FechaInicio: fechaHoraInicio.replace('T', ' '),
            FechaTermino: fechaHoraTermino.replace('T', ' '),
            EsNuevo: true,
            Etiqueta: etiqueta

        };

        var json = ko.toJSON(eventoCal);

        if (CreaCalendario()) {
            swal({
                title: 'Está seguro de crear',
                showCancelButton: true,
                confirmButtonText: 'Si!',
                cancelButtonText: 'No!',
                showLoaderOnConfirm: true,
                preConfirm: function () {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {


                            $.ajax({
                                url: ObtenerUrl('Calendario'),
                                type: "PUT",
                                data: json,
                                contentType: "application/json",
                                dataType: "json",
                                success: function (result) {
                                    //TODO OK INFORMAR EL GUARDADO CORRECTO
                                    resolve(result);

                                },
                                error: function (error) {
                                    if (error.status.toString() == "500") {
                                        getNotify('error', 'Error', 'Error en el Servidor.');
                                    }
                                    else {
                                        getNotify('error', 'Error', 'Error en el Servidor.');
                                        //alert("fail");
                                    }
                                    reject();
                                }
                            });

                        }, 2000)
                    })
                },
                allowOutsideClick: false
            }).then(function (result) {
                var nombreClase ='';
                if (result.Etiqueta == 0)
                    nombreClase = '';
                if (result.Etiqueta == 1)
                    nombreClase = 'info';
                if (result.Etiqueta == 2)
                    nombreClase = 'success';
                if (result.Etiqueta == 3)
                    nombreClase = 'important';
                evento = {
                    id: result.Id,
                    start: moment(result.FechaInicio),
                    end: moment(result.FechaTermino),
                    className: nombreClase,
                    title: result.Descripcion
                };
                $('#calendar').fullCalendar('addEvent',evento);
                EnviarMensajeSignalR('Se ha eliminado un evento.', "ListarCalendario.html", "4", sessionStorage.getItem("RolId"), result);

                swal({
                    type: 'success',
                    title: 'Evento creado!',
                    html: 'Titulo: ' + titulo + etiqueta
                })
            })
        }
        else {
            swal("Permiso", "No tiene permisos para crear evento.", "error");
        }
    }*/

    items = [];

    var obtenerCalendario = jQuery.ajax({
        url : ObtenerUrl('Calendario'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), Tipo:'1'  })
    });

    $.when(obtenerCalendario).then(
        function(data){

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
                    //colores: important, success, info

                    var s = {
                        title: itemsProcesar[i].content,
                        start: new Date(itemsProcesar[i].annoIni,itemsProcesar[i].mesIni, parseInt(itemsProcesar[i].diaIni),  parseInt(itemsProcesar[i].horaIni), itemsProcesar[i].minutosIni,0, 0),
                        end: new Date(itemsProcesar[i].annoTer, itemsProcesar[i].mesTer, parseInt(itemsProcesar[i].diaTer), parseInt(itemsProcesar[i].horaTer), itemsProcesar[i].minutosTer, 0, 0),
                        allDay: false,
                        id: itemsProcesar[i].clientId,
                        className: itemsProcesar[i].className
                    }
                    items[i] = s;
                }
            }

            var calendar =  $('#calendar').fullCalendar({
                header: {
                    left: 'title',
                    center: 'agendaDay,agendaWeek,month',
                    right: 'prev,next today'
                },
                eventDurationEditable: false,
                editable: true,
                firstDay: 1, //  1(Monday) this can be changed to 0(Sunday) for the USA system
                selectable: true,
                defaultView: 'month',
                axisFormat: 'HH:mm',
                columnFormat: {
                    month: 'ddd',    // Mon
                    week: 'ddd d', // Mon 7
                    day: 'dddd M/d',  // Monday 9/7
                    agendaDay: 'dddd d'
                },
                titleFormat: {
                    month: 'MMMM yyyy', // September 2009
                    week: "MMMM yyyy", // September 2009
                    day: 'MMMM yyyy'                  // Tuesday, Sep 8, 2009
                },
                allDaySlot: false,
                selectHelper: true,
                select: function(start, end, allDay) {
                    if (CreaCalendario()) {
                        var fechaInicioControl = moment(start, 'America/New_York').local().format('YYYY-MM-DDTHH:mm');
                        var fechaTerminoControl = moment(moment(fechaInicioControl).add(1, 'h'), 'America/New_York').local().format('YYYY-MM-DDTHH:mm');

                        //construìmos la vista para guardar
                        var hiddenLabel = '<input type="hidden" id="swal-input-hidden" value="0">';
                        var labelTitulo = '<label for="basic-url" class="text-right">Titulo</label>';
                        var inputGroupTitulo = '<div class="input-group"><span class="input-group-addon" id="sizing-addon1"><span class="glyphicon glyphicon-exclamation-sign"></span></span>';
                        var inputTitulo = '<input type="text" class="form-control" placeholder="Titulo" aria-describedby="sizing-addon1" id="swal-input1"></div>';
                        var labelFechaInicio = '<label for="basic-url" class="text-right">Inicio</label>';
                        var inputGroupFechas = '<div class="input-group"><span class="input-group-addon" id="sizing-addon2"><span class="glyphicon glyphicon-calendar"></span></span>';
                        var inputFechaInicio = '<input type="datetime-local" class="form-control" placeholder="hora" aria-describedby="sizing-addon2" id="swal-input2"  value="' + fechaInicioControl + '"></div>';
                        var labelFechaTermino = '<label for="basic-url" class="text-right">Término</label>';
                        var spanGroup = '<div class="input-group"><span class="input-group-addon" id="sizing-addon3"><span class="glyphicon glyphicon-calendar"></span></span>';
                        var inputFechaTermino = '<input type="datetime-local" class="form-control" placeholder="hora" aria-describedby="sizing-addon2" id="swal-input3" value="' + fechaTerminoControl + '"></div>';

                        var labelEtiqueta = '<label for="basic-url">Etiqueta</label><div class="input-group" style="padding-bottom: 30px;"><span class="input-group-addon" id="basic-addon8"><i class="fa fa-globe"></i></span>';
                        var selectEiqueta = '<select id="selectIdEtiqueta" class="form-control">';
                        var optionNinguna = '<option value="0">Ninguna</option>';
                        var optionInfo = '<option value="1">Información</option>';
                        var optionImportante = '<option value="2">Importante</option>';
                        var optionMuyImportante = '<option value="3">Muy importante</option>';
                        var cierreOption = '</select></div>';

                        var htmlFinal = hiddenLabel + labelTitulo + inputGroupTitulo + inputTitulo + labelFechaInicio + inputGroupFechas + inputFechaInicio + labelFechaTermino + spanGroup + inputFechaTermino;
                        htmlFinal = htmlFinal + labelEtiqueta + selectEiqueta + optionNinguna + optionInfo + optionImportante + optionMuyImportante + cierreOption;
                        swal({
                            title: 'Crear Evento',
                            html: htmlFinal,
                            showCancelButton: true,
                            confirmButtonText: 'Aceptar',
                            cancelButtonText: 'Cancelar',
                            showLoaderOnConfirm: true,
                            preConfirm: function () {
                                return new Promise(function (resolve, reject) {

                                    var idEliminar = $('#swal-input-hidden').val();
                                    var titulo = $('#swal-input1').val();
                                    var fecha1 = $('#swal-input2').val();
                                    var fecha2 = $('#swal-input3').val();
                                    var etiqueta = $('#selectIdEtiqueta').val();

                                    var instId = sessionStorage.getItem("InstId");
                                    var usuId = sessionStorage.getItem("Id");
                                    var fechaHoraInicio = fecha1;
                                    var fechaHoraTermino = fecha2;
                                    var fechaEnteraInicio = FechaEnteraStrT(fechaHoraInicio);
                                    var fechaEnteraTermino = FechaEnteraStrT(fechaHoraTermino);
                                    var fechaEnteraHoy = FechaEntera(new Date());
                                    var fechaInicioLimite = moment().add(-1, 'day');
                                    var fechaInicioMoment = moment(fechaHoraInicio);
                                    var fechaTerminoMoment = moment(fechaHoraTermino);
                                    esValido = true;
                                    //validaciones
                                    //titulo no vacio
                                    if (titulo === ''){
                                        esValido = false;
                                        reject('El Título del evento no puede estar vacío!');
                                    }
                                    //fecha inicio menor a la fecha inicio limite
                                    if (fechaInicioMoment < fechaInicioLimite){
                                        esValido = false;
                                        reject('No puede crear un evento con una fecha de inicio anterior a la de hoy!');
                                    }
                                    //fecha inicio menor a la fecha de termino
                                    if (fechaTerminoMoment < fechaInicioMoment){
                                        esValido = false;
                                        reject('La fecha de término no puede ser menor a la de inioio!');
                                    }


                                    var eventoCal = {
                                        InstId: instId,
                                        IdUsuario: usuId,
                                        UsuIdCreador: usuId,
                                        Titulo: titulo,
                                        FechaInicio: fechaHoraInicio.replace('T', ' '),
                                        FechaTermino: fechaHoraTermino.replace('T', ' '),
                                        EsNuevo: true,
                                        Etiqueta: etiqueta

                                    };

                                    var json = ko.toJSON(eventoCal);
                                    if (esValido) {
                                        $.ajax({
                                            url: ObtenerUrl('Calendario'),
                                            type: "PUT",
                                            data: json,
                                            contentType: "application/json",
                                            dataType: "json",
                                            success: function (result) {
                                                //TODO OK INFORMAR EL GUARDADO CORRECTO
                                                resolve(result);

                                            },
                                            error: function (error) {
                                                if (error.status.toString() == "500") {
                                                    getNotify('error', 'Error', 'Error en el Servidor.');
                                                }
                                                else {
                                                    getNotify('error', 'Error', 'Error en el Servidor.');
                                                    //alert("fail");
                                                }
                                                reject(error);
                                            }
                                        });
                                    }
                                })
                            },
                            allowOutsideClick: false
                        }).then(function (result) {
                            var fechaInicioMoment = moment(result.FechaInicio);
                            var fechaInicioGuardar = new Date(fechaInicioMoment.get('year'), fechaInicioMoment.get('month') + 1, fechaInicioMoment.get('date'), fechaInicioMoment.get('hour'), fechaInicioMoment.get('minute'), 0, 0);
                            var fechaTerminoMoment = moment(result.FechaTermino);
                            var fechaTerminoGuardar = new Date(fechaTerminoMoment.get('year'), fechaTerminoMoment.get('month') + 1, fechaTerminoMoment.get('date'), fechaTerminoMoment.get('hour'), fechaTerminoMoment.get('minute'), 0, 0);

                            var nombreClase = '';
                            if (result.Etiqueta == 0)
                                nombreClase = '';
                            if (result.Etiqueta == 1)
                                nombreClase = 'info';
                            if (result.Etiqueta == 2)
                                nombreClase = 'success';
                            if (result.Etiqueta == 3)
                                nombreClase = 'important';
                            evento = {
                                id: result.Id,
                                start: fechaInicioGuardar,
                                end: fechaTerminoGuardar,
                                className: nombreClase,
                                title: result.Descripcion,
                                allDay: false
                            };
                            /* nada de esto funcionò
                             $('#calendar').fullCalendar('addEvent',evento);
                             $('#calendar').fullCalendar('renderEvent', evento, true);
                             $('#calendar').fullCalendar('renderEvent', evento);
                             */
                            EnviarMensajeSignalR('Se ha creado un evento.', "ListarCalendario.html", "4", sessionStorage.getItem("RolId"), result);
                            swal({
                                title: 'Guardado con éxito',
                                type: 'success',
                                html: '<p>El registro fué guardado con éxito</p>',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Cerrar',
                                allowOutsideClick: false
                            }).then(function (result) {
                                window.location = 'ListarCalendario.html';
                            })

                        })
                    }
                    else {
                        getNotify('error', 'Permisos', 'No tiene permisos para crear eventos.');
                    }

                },

                droppable: false, // this allows things to be dropped onto the calendar !!!
/*                drop: function(date, allDay) { // this function is called when something is dropped

                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');

                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    copiedEventObject.allDay = allDay;

                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                    // is the "remove after drop" checkbox checked?
                    if ($('#drop-remove').is(':checked')) {
                        // if so, remove the element from the "Draggable Events" list
                        $(this).remove();
                    }

                },*/
                eventClick:  function(event, jsEvent, view) {
                    var evento = event;
                    var eventId = event._id;
                    var fechaInicio = moment(event.start, 'America/New_York').local().format('YYYY-MM-DDTHH:mm');
                    var fechaTermino;
                    if (event.end){
                        fechaTermino = moment(event.end, 'America/New_York').local().format('YYYY-MM-DDTHH:mm');
                    }
                    else{

                    }
                    //"yyyy-MM-ddThh:mm"
                    var titulo = event.title;
                    var todoElDia = event.allDay;
                    //construccion dinámica del html
                    var hiddenLabel = '<input type="hidden" id="swal-input-hidden" value="' + eventId + '">';
                    var labelTitulo = '<label for="basic-url" class="text-right">Titulo</label>';
                    var inputGroupTitulo = '<div class="input-group"><span class="input-group-addon" id="sizing-addon1"><span class="glyphicon glyphicon-exclamation-sign"></span></span>';
                    var inputTitulo = '<input type="text" class="form-control" placeholder="Titulo" aria-describedby="sizing-addon1" id="swal-input1" value="' + titulo + '"></div>';
                    var labelFechaInicio = '<label for="basic-url" class="text-right">Inicio y fin</label>';
                    var inputGroupFechas = '<div class="input-group"><span class="input-group-addon" id="sizing-addon2"><span class="glyphicon glyphicon-calendar"></span></span>';
                    var inputFechaInicio = '<input type="datetime-local" class="form-control" placeholder="hora" aria-describedby="sizing-addon2" id="swal-input2" value="' + fechaInicio + '"></div>';
                    var labelFechaTermino = '<label for="basic-url" class="text-right">Término</label>';
                    var spanGroup = '<div class="input-group"><span class="input-group-addon" id="sizing-addon3"><span class="glyphicon glyphicon-calendar"></span></span>';
                    var inputFechaTermino = '<input type="datetime-local" class="form-control" placeholder="hora" aria-describedby="sizing-addon2" id="swal-input3" value="' + fechaTermino + '"></div>';

                    var labelEtiqueta = '<label for="basic-url">Etiqueta</label><div class="input-group"><span class="input-group-addon" id="basic-addon8"><i class="fa fa-globe"></i></span>';
                    var selectEiqueta = '<select id="selectIdEtiqueta" class="form-control">';
                    var optionNinguna = '<option value="0">Ninguna</option>';
                    if (event.className == '')
                        optionNinguna = '<option value="0" selected>Ninguna</option>';
                    var optionInfo = '<option value="1">Información</option>';
                    if (event.className == 'info')
                        optionInfo = '<option value="1" selected>Información</option>';
                    var optionImportante = '<option value="2">Importante</option>';
                    if (event.className == 'success')
                        optionImportante = '<option value="2" selected>Importante</option>';
                    var optionMuyImportante = '<option value="3">Muy importante</option>';
                    if (event.className == 'important')
                        optionMuyImportante = '<option value="3" selected>Muy importante</option>';
                    var cierreOption = '</select></div>';


                    var htmlFinal =hiddenLabel + labelTitulo + inputGroupTitulo + inputTitulo + labelFechaInicio + inputGroupFechas + inputFechaInicio + labelFechaTermino + spanGroup + inputFechaTermino;
                    htmlFinal = htmlFinal + labelEtiqueta + selectEiqueta + optionNinguna + optionInfo + optionImportante + optionMuyImportante + cierreOption;


                    $.sweetModal({
                        title: 'Titulo',
                        content: htmlFinal,

                        buttons: {

                            someOtherAction: {
                                label: 'Eliminar',
                                classes: 'redB bordered flat',
                                action: function() {
                                    var idEliminar = $('#swal-input-hidden').val();
                                    var titulo = $('#swal-input1').val();
                                    var fecha1 = moment($('#swal-input2').val());
                                    var fecha2 = moment($('#swal-input3').val());
                                    var etiqueta = $('#selectIdEtiqueta').val();
                                    eliminarEvento(titulo, fecha1, fecha2, idEliminar, etiqueta);
                                    //return $.sweetModal('You clicked Action 2!');
                                }
                            },

                            someAction: {
                                label: 'Guardar',
                                classes: 'secondaryB bordered flat',
                                action: function() {
                                    var idGuardar = $('#swal-input-hidden').val();
                                    var titulo = $('#swal-input1').val();
                                    var fecha1 = $('#swal-input2').val();
                                    var fecha2 = $('#swal-input3').val();
                                    var etiqueta = $('#selectIdEtiqueta').val();

                                    var instId = sessionStorage.getItem("InstId");
                                    var usuId = sessionStorage.getItem("Id");
                                    var fechaHoraInicio = fecha1;
                                    var fechaHoraTermino = fecha2;
                                    var fechaEnteraInicio = FechaEnteraStrT(fechaHoraInicio);
                                    var fechaEnteraTermino = FechaEnteraStrT(fechaHoraTermino);
                                    var fechaEnteraHoy = FechaEntera(new Date());
                                    var fechaInicioLimite = moment().add(-1, 'day');
                                    var fechaInicioMoment = moment(fechaHoraInicio);
                                    var fechaTerminoMoment = moment(fechaHoraTermino);
                                    esValido = true;
                                    //validaciones
                                    //titulo no vacio
                                    if (titulo === ''){
                                        esValido = false;
                                        reject('El Título del evento no puede estar vacío!');
                                    }

                                    //fecha inicio menor a la fecha de termino
                                    if (fechaTerminoMoment < fechaInicioMoment){
                                        esValido = false;
                                        reject('La fecha de término no puede ser menor a la de inioio!');
                                    }


                                    var eventoCal = {
                                        Id: idGuardar,
                                        InstId: instId,
                                        IdUsuario: usuId,
                                        UsuIdCreador: usuId,
                                        Titulo: titulo,
                                        FechaInicio: fechaHoraInicio.replace('T', ' '),
                                        FechaTermino: fechaHoraTermino.replace('T', ' '),
                                        EsNuevo: false,
                                        Etiqueta: etiqueta

                                    };

                                    var json = ko.toJSON(eventoCal);

                                    if (ModificaCalendario()){
                                        swal({
                                            title: 'Está seguro de Modificar',
                                            showCancelButton: true,
                                            confirmButtonText: 'Si!',
                                            cancelButtonText: 'No!',
                                            showLoaderOnConfirm: true,
                                            preConfirm: function () {
                                                return new Promise(function (resolve, reject) {


                                                    if (esValido) {
                                                        $.ajax({
                                                            url: ObtenerUrl('Calendario'),
                                                            type: "PUT",
                                                            data: json,
                                                            contentType: "application/json",
                                                            dataType: "json",
                                                            success: function (result) {
                                                                //TODO OK INFORMAR EL GUARDADO CORRECTO
                                                                resolve(result);

                                                            },
                                                            error: function (error) {
                                                                if (error.status.toString() == "500") {
                                                                    getNotify('error', 'Error', 'Error en el Servidor.');
                                                                }
                                                                else {
                                                                    getNotify('error', 'Error', 'Error en el Servidor.');
                                                                    //alert("fail");
                                                                }
                                                                reject(error);
                                                            }
                                                        });
                                                    }
                                                })
                                            },
                                            allowOutsideClick: false
                                        }).then(function (result) {
                                            var fechaInicioMoment = moment(result.FechaInicio);
                                            var fechaInicioGuardar = new Date(fechaInicioMoment.get('year'), fechaInicioMoment.get('month') + 1, fechaInicioMoment.get('date'), fechaInicioMoment.get('hour'), fechaInicioMoment.get('minute'), 0, 0);
                                            var fechaTerminoMoment = moment(result.FechaTermino);
                                            var fechaTerminoGuardar = new Date(fechaTerminoMoment.get('year'), fechaTerminoMoment.get('month') + 1, fechaTerminoMoment.get('date'), fechaTerminoMoment.get('hour'), fechaTerminoMoment.get('minute'), 0, 0);

                                            var nombreClase = '';
                                            if (result.Etiqueta == 0)
                                                nombreClase = '';
                                            if (result.Etiqueta == 1)
                                                nombreClase = 'info';
                                            if (result.Etiqueta == 2)
                                                nombreClase = 'success';
                                            if (result.Etiqueta == 3)
                                                nombreClase = 'important';
                                            evento = {
                                                id: result.Id,
                                                start: fechaInicioGuardar,
                                                end: fechaTerminoGuardar,
                                                className: nombreClase,
                                                title: result.Descripcion,
                                                allDay: false
                                            };

                                            EnviarMensajeSignalR('Se ha modificado un evento.', "ListarCalendario.html", "4", sessionStorage.getItem("RolId"), result);
                                            swal({
                                                title: 'Guardado con éxito',
                                                type: 'success',
                                                html: '<p>El registro fué modificado con éxito</p>',
                                                showCancelButton: false,
                                                confirmButtonColor: '#3085d6',
                                                confirmButtonText: 'Cerrar',
                                                allowOutsideClick: false
                                            }).then(function (result) {
                                                window.location = 'ListarCalendario.html';
                                            })

                                        })
                                    }
                                    else{
                                        getNotify('error', 'Modificar', 'No tiene permisos para mosificar los elementos del calendario.');
                                    }


                                    //return $.sweetModal('You clicked Action 1!');
                                }
                            }
                        }
                    });
                },

                events: items

            });

/*            $('#principal').show();
            $('#loading').hide();*/

            //elem = document.getElementById('principal');

            ko.applyBindings(new ViewModel(items), null);

        },
        function (){
            //alguna ha fallado
            alert('error');
        },
        function(){
            //acá podemos quitar el elemento cargando
            alert('quitar cargando');
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

});