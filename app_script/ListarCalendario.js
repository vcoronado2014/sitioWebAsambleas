$(function () {

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
    else {
        window.location.href = "login.html";
    }

    $('#ancoreSesion').on('click', function () {
        if ($('#ancoreSesion').html() == '<i class="fa fa-close"></i> Cerrar Sesión') {
            //acá debe direccionarlo directamente al login y vaciar la variable de session
            sessionStorage.clear();
            window.location.href = "login.html";
            return;
        }
        else {
            //directo al login
            window.location.href = "login.html";
        }


    });

    $('[data-toggle="tooltip"]').tooltip()
    function ViewModel(data) {
        var self = this;
        nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        // knockout mapping JSON data to view model

        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);


        ko.mapping.fromJS(data, {}, self);

    }
    $.ajax({
        url: ObtenerUrl('Calendario'),
        type: "POST",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId") }),
        contentType: "application/json",
        dataType: "json",
        autoLoad: false,
        success: function (data) {
            // ok



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
                        if (rolId == 1)
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

                var eventRecorder = new Y.SchedulerEventRecorder({
                    on: {
                        //init: function (event) {
                        //    alert('init:' + this.isNew() + ' --- ');
                        //    var toolbarBtnGroup = Y.one('#bb .toolbar .btn-group');
                        //    if (toolbarBtnGroup != null)
                        //        toolbarBtnGroup.appendChild('<button id="edit" type="button">Edit</button>');

                        //},
                        //load: function (event) {
                        //    alert('load:' + this.isNew() + ' --- ');
                        //},
                        //click: function (event) {
                        //    alert('click:' + this.isNew() + ' --- ');
                        //},
                        //change: function (event) {
                //    alert('change:' + this.isNew() + ' --- ' + this.getContentNode().val());
                        //},

                        //save: function (event) {
                        //    alert('Save Event:' + this.isNew() + ' --- ' + this.getContentNode().val());
                        //},
                        //edit: function (event) {
                        //    alert('Edit Event:' + this.isNew() + ' --- ' + this.getContentNode().val());
                        //},
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
                        }
                    }
                });
                //var eventRecorder = new Y.SchedulerEventRecorder();

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

                //var editButton;
                var saveButton;

                Y.Do.after(function () {
                    var rolId = sessionStorage.getItem("RolId");
                    //solo para administradores por mientras
                    if (rolId == '1') {
                        var popup = Y.one("#bb")._node.childNodes[1];
                        var cantidadNodos = popup.childNodes[0].length;
                        var titulo;
                        //estamos editando si hay 5 nodos
                        if (cantidadNodos >= 6)
                        {
                            titulo = popup.childNodes[0][0];
                            titulo.defaultValue = titulo.value;
                        }
                        else
                        {
                            titulo = popup.childNodes[0][0];
                            titulo.defaultValue = "Ingrese su evento";
                        }                
                        
                        var toolbarBtnGroup = Y.one("#bb .btn-toolbar-content .btn-group");

                        //toolbarBtnGroup.appendChild('<button id="edit" type="button">Edit</button>');
                        toolbarBtnGroup.appendChild('<button id="guardar" type="button">Guardar</button>');

                        var btnGuardar = toolbarBtnGroup._node.childNodes[0];
                        btnGuardar.className = "hidden";
                        //btnGuardar.textContent = "Guardar";
                        //btnGuardar.replace('<button id="edit" type="button">Edit</button>');


                        //if (editButton)
                        //    editButton.destroy();
                        //editButton = new Y.Button({
                        //    label: 'Edit',
                        //    srcNode: '#edit',
                        //}).render();

                        if (saveButton)
                            saveButton.destroy();
                        saveButton = new Y.Button({
                            label: 'Guardar',
                            srcNode: '#guardar',
                        }).render();

                        //editButton.on('click', function (event) {
                        //    alert('Edit clicked!');
                        //    eventRecorder.hidePopover();
                        //});

                        saveButton.on('click', function (event) {
                            //alert('Edit guardar!');
                            var cantidadNodos = popup.childNodes[0].length;
                            var titulo;
                            var startDate;
                            var endDate;
                            var esNuevo = true;

                            if (cantidadNodos > 6)
                            {
                                titulo = popup.childNodes[0][0];
                                startDate = popup.childNodes[0][1];
                                endDate = popup.childNodes[0][2];
                                esNuevo = false;
                            }
                            else
                            {
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


                            if (titulo.value != '')
                            {
                                var eventoCal = {
                                    InstId : instId,
                                    IdUsuario : idUsuario,
                                    Titulo: titulo.value,
                                    FechaInicio: inicioStr,
                                    FechaTermino: terminoStr,
                                    EsNuevo: esNuevo

                                }

                                var json = ko.toJSON(eventoCal);

                                if (esNuevo)
                                {
                                    Insertar(json);
                                }
                                else
                                {
                                    Modificar(json);
                                }


                                //alert('Save Event:' + ' --- ' + titulo.value + ' ' + fechaIni);
                            }
                            else
                            {
                                getNotify('error', 'Error', 'Debe ingresar evento!');
                            }

                            
                            eventRecorder.hidePopover();
                        });
                    }
                    else
                    {
                        var popup = Y.one("#bb")._node.childNodes[1];
                        popup.className = "hidden";
                        getNotify('error', 'Error', 'Su rol no le permite crear o editar eventos!');
                    }

                }, eventRecorder, 'showPopover');

                Y.Do.after(function () {

                    // Make sure that the editButton is destroyed to avoid a memory leak

                    //if (editButton) {
                    //    editButton.destroy();
                    //}

                    if (saveButton) {
                        saveButton.destroy();
                    }
                }, eventRecorder, 'hidePopover');
            });

           
            $('#principal').show();
            $('#loading').hide();

            elem = document.getElementById('principal');

            ko.applyBindings(new ViewModel(data), elem);

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

    function Insertar(jsonEntidad)
    {
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

    function Modificar(jsonEntidad) {
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
                window.location.href = "listarRendicion.html";
            }
        });




    }

    function Eliminar(jsonEntidad) {
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
                window.location.href = "listarRendicion.html";
            }
        });




    }

});