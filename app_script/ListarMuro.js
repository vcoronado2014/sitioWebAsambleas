/**
 * Created by victorcoronado on 09/09/17.
 */
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

        muro = ko.observableArray(data);
        //self.items = ko.observableArray(items);
        //self.items.comentarios = ko.observableArray(items.comentarios);
        nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));


        Menu();

        if (sessionStorage.getItem("RolId") == '1') {
            permitirCrear = ko.observable(true);
            permitirEliminar = ko.observable(true);
        }
        else
        {
            permitirCrear = ko.observable(false);
            permitirEliminar = ko.observable(false);
        }

        ko.mapping.fromJS(data, {}, self);



    }

    var obtenerMuro = jQuery.ajax({
        url : ObtenerUrl('Muro'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), UsuId: sessionStorage.getItem("Id") })
    });

    $.when(obtenerMuro).then(
        function(data){
            elem = document.getElementById('principal');

            ko.applyBindings(new ViewModel(data), elem);

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
            swal(JSON.stringify(result))
        }).catch(swal.noop)

    }

    eliminarMuro = function (item) {
        var texto = "Está seguro de eliminar el comentario: " + item.Texto;;
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