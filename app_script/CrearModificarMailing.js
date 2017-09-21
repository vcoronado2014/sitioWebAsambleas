/**
 * Created by vcoronado on 14-09-2017.
 */
$(document).ready(function () {
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
    $("#txtNombreUsuario").attr('disabled', 'disabled');

    function InstitucionViewModel(data, dataR) {
        var self = this;
        //self.people = ko.observableArray([]);

        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.idInstitucion = getParameterByName('id');
        //guardamos los roles actuales
        self.rolesActuales = ko.observableArray(dataR);

        self.elem = document.getElementById('principal');

        //del formulario
        self.frmNombre = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        //de los permisos
        self.frmPId= ko.observable(0);
        self.frmPInstId= ko.observable(0);
        self.frmPRolId= ko.observable(0);
        self.frmPCreaUsuario= ko.observable(false);
        self.frmPModificaUsuario= ko.observable(false);
        self.frmPEliminaUsuario= ko.observable(false);
        self.frmPCreaInstitucion= ko.observable(false);
        self.frmPModificaInstitucion= ko.observable(false);
        self.frmPEliminaInstitucion= ko.observable(false);
        self.frmPCreaDocumento= ko.observable(false);
        self.frmPEliminaDocumento= ko.observable(false);
        self.frmPCreaCalendario= ko.observable(false);
        self.frmPModificaCalendario= ko.observable(false);
        self.frmPEliminaCalendario= ko.observable(false);
        self.frmPCreaTricel= ko.observable(false);
        self.frmPModificaTricel= ko.observable(false);
        self.frmPEliminaTricel= ko.observable(false);
        self.frmPCreaProyecto= ko.observable(false);
        self.frmPModificaProyecto= ko.observable(false);
        self.frmPEliminaProyecto= ko.observable(false);
        self.frmPCreaRendicion= ko.observable(false);
        self.frmPModificaRendicion= ko.observable(false);
        self.frmPEliminaRendicion= ko.observable(false);
        self.frmPCreaRol= ko.observable(false);
        self.frmPModificaRol= ko.observable(false);
        self.frmPEliminaRol= ko.observable(false);
        self.frmPCreaMuro= ko.observable(false);
        self.frmPModificaMuro= ko.observable(false);
        self.frmPEliminaMuro= ko.observable(false);


        Menu();
        guardar = function () {


            var entidad = {
                Id: getParameterByName('id'),
                Nombre: $("#txtNombreUsuario").val(),
                PermisoId: frmPId(),
                InstId: frmPInstId(),
                CreaUsuario: $('#chkCreaUsuario')[0].checked,
                ModificaUsuario: $('#chkModificaUsuario')[0].checked,
                EliminaUsuario: $('#chkEliminaUsuario')[0].checked,
                CreaInstitucion: false,
                ModificaInstitucion: false,
                EliminaInstitucion: false,
                CreaDocumento: $('#chkCreaDocumento')[0].checked,
                EliminaDocumento: $('#chkEliminaDocumento')[0].checked,
                CreaCalendario: $('#chkCreaCalendario')[0].checked,
                ModificaCalendario: $('#chkModificaCalendario')[0].checked,
                EliminaCalendario: $('#chkEliminaCalendario')[0].checked,
                CreaTricel: $('#chkCreaTricel')[0].checked,
                ModificaTricel: $('#chkModificaTricel')[0].checked,
                EliminaTricel: $('#chkEliminaTricel')[0].checked,
                CreaProyecto: $('#chkCreaProyecto')[0].checked,
                ModificaProyecto: $('#chkModificaProyecto')[0].checked,
                EliminaProyecto: $('#chkEliminaProyecto')[0].checked,
                CreaRendicion: $('#chkCreaRendicion')[0].checked,
                ModificaRendicion: $('#chkModificaRendicion')[0].checked,
                EliminaRendicion: $('#chkEliminaRendicion')[0].checked,
                CreaMuro: $('#chkCreaMuro')[0].checked,
                ModificaMuro: $('#chkModificaMuro')[0].checked,
                EliminaMuro: $('#chkEliminaMuro')[0].checked,
                CreaRol: $('#chkCreaRol')[0].checked,
                ModificaRol: $('#chkModificaRol')[0].checked,
                EliminaRol: $('#chkEliminaRol')[0].checked,

            };

            $.ajax({
                url: ObtenerUrl('Mailing'),
                type: "PUT",
                data: ko.toJSON(entidad),
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
                                //EnviarMensajeSignalR('Se ha creado/modificado Mailing.', "inicio.html", "1", sessionStorage.getItem("RolId"), result);
                                window.location.href = "CrearModificarMailing.html";
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
        cancelar = function () {
            window.location.href = "inicio.html";

        }
    }
    var instIdBuscar = sessionStorage.getItem('InstId');
    if (parseInt(instIdBuscar) > 0) {
        $.ajax({
            url: ObtenerUrl('Mailing') + '?instId=' + instIdBuscar,
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (dataR) {
                // ok
                //frmIdRegion = ko.observable(data.RegId);
                if (dataR.length > 0) {
                    self.frmNombre = sessionStorage.getItem("NombreInstitucion");

                    // los datos del formulario
                    // ok
                    self.frmPId = ko.observable(dataR[0].Id);
                    self.frmPInstId = ko.observable(sessionStorage.getItem("InstId"));
                    self.frmPRolId = ko.observable(sessionStorage.getItem("RolId"));
                    if (dataR[0].CreaUsuario == 1)
                        self.frmPCreaUsuario = ko.observable(true);
                    if (dataR[0].ModificaUsuario == 1)
                        self.frmPModificaUsuario = ko.observable(true);
                    if (dataR[0].EliminaUsuario == 1)
                        self.frmPEliminaUsuario = ko.observable(true);

                    if (dataR[0].CreaInstitucion == 1)
                        self.frmPCreaInstitucion = ko.observable(true);
                    if (dataR[0].ModificaInstitucion == 1)
                        self.frmPModificaInstitucion = ko.observable(true);
                    if (dataR[0].EliminaInstitucion == 1)
                        self.frmPEliminaInstitucion = ko.observable(true);

                    if (dataR[0].CreaDocumento == 1)
                        self.frmPCreaDocumento = ko.observable(true);
                    if (dataR[0].EliminaDocumento == 1)
                        self.frmPEliminaDocumento = ko.observable(true);

                    if (dataR[0].CreaCalendario == 1)
                        self.frmPCreaCalendario = ko.observable(true);
                    if (dataR[0].ModificaCalendario == 1)
                        self.frmPModificaCalendario = ko.observable(true);
                    if (dataR[0].EliminaCalendario == 1)
                        self.frmPEliminaCalendario = ko.observable(true);

                    if (dataR[0].CreaTricel == 1)
                        self.frmPCreaTricel = ko.observable(true);
                    if (dataR[0].ModificaTricel == 1)
                        self.frmPModificaTricel = ko.observable(true);
                    if (dataR[0].EliminaTricel == 1)
                        self.frmPEliminaTricel = ko.observable(true);

                    if (dataR[0].CreaProyecto == 1)
                        self.frmPCreaProyecto = ko.observable(true);
                    if (dataR[0].ModificaProyecto == 1)
                        self.frmPModificaProyecto = ko.observable(true);
                    if (dataR[0].EliminaProyecto == 1)
                        self.frmPEliminaProyecto = ko.observable(true);

                    if (dataR[0].CreaRendicion == 1)
                        self.frmPCreaRendicion = ko.observable(true);
                    if (dataR[0].ModificaRendicion == 1)
                        self.frmPModificaRendicion = ko.observable(true);
                    if (dataR[0].EliminaRendicion == 1)
                        self.frmPEliminaRendicion = ko.observable(true);

                    if (dataR[0].CreaRol == 1)
                        self.frmPCreaRol = ko.observable(true);
                    if (dataR[0].ModificaRol == 1)
                        self.frmPModificaRol = ko.observable(true);
                    if (dataR[0].EliminaRol == 1)
                        self.frmPEliminaRol = ko.observable(true);

                    if (dataR[0].CreaMuro == 1)
                        self.frmPCreaMuro = ko.observable(true);
                    if (dataR[0].ModificaMuro == 1)
                        self.frmPModificaMuro = ko.observable(true);
                    if (dataR[0].EliminaMuro == 1)
                        self.frmPEliminaMuro = ko.observable(true);


                    getNotify('success', 'Éxito', 'Recuperado con éxito!');

                    ko.applyBindings(new InstitucionViewModel(data, dataR), self.elem);
                }
                else{
                    var data = [];
                    var dataR = [];
                    self.frmNombre = sessionStorage.getItem("NombreInstitucion");
                    self.frmPId= ko.observable(0);
                    self.frmPInstId= ko.observable(sessionStorage.getItem("InstId"));
                    self.frmPRolId= ko.observable(0);

                    ko.applyBindings(new InstitucionViewModel(data, dataR), self.elem);
                }



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
        var elimina = getParameterByName('ELIMINADO');
        if(elimina == 1)
        {
            //bloquear todos los controles y cambiar el nombre del botòn
            $("#txtNombreUsuario").attr('disabled', 'disabled');


            swal({
                title: "Eliminar",
                text: "¿Está seguro de eliminar este Mailing?",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                customClass: 'sweetalert-xs',
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {

                    if ($("#txtNombreUsuario").val() == "Super Administrador") {

                        setTimeout(function () {

                            swal({
                                    title: "Error",
                                    text: "No se puede eliminar el Rol Super Administrador.",
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
                                        window.location.href = "ListarRoles.html";
                                    } else {
                                        swal("Cancelled", "Your imaginary file is safe :)", "error");
                                    }
                                });

                        }, 2000);
                    }

                    else
                    {
                        setTimeout(function () {
                            $.ajax({
                                url: ObtenerUrl('PermisoRol'),
                                type: "DELETE",
                                data: ko.toJSON({ Id: idRolP, InstId: frmPInstId() }),
                                contentType: "application/json",
                                dataType: "json",
                                success: function (dataF) {
                                    if (dataF.Descripcion.length < 50 ){
                                        swal({
                                                title: "Error",
                                                text: "No se puede eliminar este rol",
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
                                                    window.location.href = "ListarRoles.html";
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
                                                    EnviarMensajeSignalR('Se ha eliminado un rol.', "ListarRoles.html", "2", sessionStorage.getItem("RolId"), dataF);
                                                    window.location.href = "ListarRoles.html";
                                                } else {
                                                    swal("Cancelled", "Your imaginary file is safe :)", "error");
                                                }
                                            });
                                    }
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

                }
                else
                {
                    window.location.href = "ListarRoles.html";
                }
            });
        }

    }
    else {
        //$("#txtNombreUsuario").removeAttr('disabled');
        var data = [];
        var dataR = [];
        self.frmNombre = sessionStorage.getItem("NombreInstitucion");
        self.frmPId= ko.observable(0);
        self.frmPInstId= ko.observable(sessionStorage.getItem("InstId"));
        self.frmPRolId= ko.observable(0);

        ko.applyBindings(new InstitucionViewModel(data, dataR), self.elem);

    }

    function validar(NombreInstitucion, IdComuna, CorreoElectronico, Telefono, Direccion) {
        var retorno = true;
        if (NombreInstitucion === '' || NombreInstitucion === null) {
            getNotify('error', 'Requerido', 'Nombre de Institución Requerida.');
            retorno = false;
        }
        if (CorreoElectronico === '' || CorreoElectronico === null) {
            getNotify('error', 'Requerido', 'Correo Electrónico Requerido.');
            retorno = false;
        }
        if (Telefono === '' || Telefono === null) {
            getNotify('error', 'Requerido', 'Teléfono Requerido.');
            retorno = false;
        }
        if (Direccion === '' || Direccion === null) {
            getNotify('error', 'Requerido', 'Direccion Requerida.');
            retorno = false;
        }

        if (IdComuna === '0' || IdComuna === null) {
            getNotify('error', 'Requerido', 'Comuna Requerida.');
            retorno = false;
        }

        return retorno;
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

    function validarEmail(email) {
        var retorno = true;
        expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!expr.test(email)) {
            getNotify('error', 'Email', "La dirección de correo " + email + " es incorrecta.")
            //alert("Error: La dirección de correo " + email + " es incorrecta.");
            retorno = false;
        }
        return retorno;
    }

});
function Volver() {
    window.location.href = "inicio.html";
}
