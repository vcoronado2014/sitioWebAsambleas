$(document).ready(function () {
    var tipo = getParameterByName('tipo');
    var id = getParameterByName('id');


    swal({
        title: "Eliminar",
        text: "¿Está seguro de eliminar?",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        customClass: 'sweetalert-xs',
        showLoaderOnConfirm: true
    }, function (isConfirm) {
        if (isConfirm) {

            setTimeout(function () {

                if (tipo=='documentousuario') {

                    $.ajax({
                        url: ObtenerUrl('FileNuevo') + "?id=" + id + "&EsCpas=" + sessionStorage.getItem("ES_CPAS"),
                        type: "GET",
                        contentType: "application/json",
                        dataType: "json",
                        success: function (data) {

                            swal({
                                    title: "Eliminado",
                                    text: "El Registro ha sido eliminado con éxito.",
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonClass: "btn-success",
                                    confirmButtonText: "Ok",
                                    cancelButtonText: "No, cancel plx!",
                                    closeOnConfirm: true,
                                    customClass: 'sweetalert-xs',
                                    closeOnCancel: false
                                },
                                function (isConfirm) {
                                    if (isConfirm) {
                                        EnviarMensajeSignalR('Se ha subido un Documento.', "ListarDocumento.html", "4", sessionStorage.getItem("RolId"), data);
                                        window.location.href = "ListarDocumento.html";


                                    } else {
                                        swal("Cancelled", "Your imaginary file is safe :)", "error");
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
                }
                if (tipo=='archivotricel') {

                    var tricelId = getParameterByName('tricelId');

                    $.ajax({
                        url: ObtenerUrl('ArchivoTricel'),
                        type: "DELETE",
                        data: ko.toJSON({ Id: id }),
                        contentType: "application/json",
                        dataType: "json",
                        success: function (data) {

                            swal({
                                    title: "Eliminado",
                                    text: "El Registro ha sido eliminado con éxito.",
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonClass: "btn-success",
                                    confirmButtonText: "Ok",
                                    cancelButtonText: "No, cancel plx!",
                                    closeOnConfirm: true,
                                    customClass: 'sweetalert-xs',
                                    closeOnCancel: false
                                },
                                function (isConfirm) {
                                    if (isConfirm) {
                                        EnviarMensajeSignalR('Se ha subido un Documento.', "ListarDocumento.html", "4", sessionStorage.getItem("RolId"), data);
                                        window.location.href = "CrearModificarVotacion.html?id=" + tricelId + "&ELIMINAR=0";


                                    } else {
                                        swal("Cancelled", "Your imaginary file is safe :)", "error");
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
                }
                if (tipo == 'archivoproyecto'){
                    var proId = getParameterByName('proyectoId');

                    $.ajax({
                        url: ObtenerUrl('ArchivoProyecto'),
                        type: "DELETE",
                        data: ko.toJSON({ Id: id }),
                        contentType: "application/json",
                        dataType: "json",
                        success: function (data) {

                            swal({
                                    title: "Eliminado",
                                    text: "El Registro ha sido eliminado con éxito.",
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonClass: "btn-success",
                                    confirmButtonText: "Ok",
                                    cancelButtonText: "No, cancel plx!",
                                    closeOnConfirm: true,
                                    customClass: 'sweetalert-xs',
                                    closeOnCancel: false
                                },
                                function (isConfirm) {
                                    if (isConfirm) {
                                        EnviarMensajeSignalR('Se ha subido un Documento.', "ListarDocumento.html", "4", sessionStorage.getItem("RolId"), data);
                                        window.location.href = "CrearModificarProyecto.html?id=" + proId + "&ELIMINAR=0";


                                    } else {
                                        swal("Cancelled", "Your imaginary file is safe :)", "error");
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
                }

            }, 2000);

            }
            else {
                //window.location.href = "listarDocumento.html";
                if (tipo=='documentousuario') {
                    window.location.href = "listarDocumento.html";
                }
            if (tipo=='archivotricel') {
                var tricelId = getParameterByName('tricelId');
                window.location.href = "CrearModificarVotacion.html?id=" + tricelId + "&ELIMINAR=0";
            }
            if (tipo=='archivoproyecto') {
                var proId = getParameterByName('proyectoId');
                window.location.href = "CrearModificarProyecto.html?id=" + proId + "&ELIMINAR=0";
            }

            }
    });


   
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
    function getParameterByName(name, url) {

        //// query string: ?foo=lorem&bar=&baz
        //var foo = getParameterByName('foo'); // "lorem"
        //var bar = getParameterByName('bar'); // "" (present with empty value)
        //var baz = getParameterByName('baz'); // "" (present with no value)
        //var qux = getParameterByName('qux'); // null (absent)

        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function getParameterByName(name, url) {

        //// query string: ?foo=lorem&bar=&baz
        //var foo = getParameterByName('foo'); // "lorem"
        //var bar = getParameterByName('bar'); // "" (present with empty value)
        //var baz = getParameterByName('baz'); // "" (present with no value)
        //var qux = getParameterByName('qux'); // null (absent)

        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
});