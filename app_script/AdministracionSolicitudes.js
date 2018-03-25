/**
 * Created by VICTOR CORONADO on 08/12/2017.
 */
$(document).ready(function () {

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
    listadoUsuarios = [];

    function InstitucionViewModel(roles, data, dataUsuarios) {
        var self = this;
        self.roles = ko.observableArray(roles);
        var itemsT = data[0].proposals;
        //usuarios = ko.observableArray(data);
        self.itemsT = ko.observableArray(itemsT);
        //self.people = ko.observableArray([]);
        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.idInstitucion = getParameterByName('id');
        if (roles != null && roles.length > 0)
        {
            var nuevo = { Id: 0, Nombre: 'Seleccione' };
            roles.push(nuevo);
        }
        frmIdRol = ko.observable(0);
        selectedRol = ko.observable(0);

        self.elem = document.getElementById('principal');
        //procesamos los usuarios para mostrar el listado
        var listaNueva = [];
        if (dataUsuarios){
            if (dataUsuarios.length > 0){
                for(var i in dataUsuarios){
                    if (dataUsuarios[i].OtroUno == sessionStorage.getItem("NombreInstitucion")){
                        //agregar
                        listaNueva.push(dataUsuarios[i]);
                    }
                }
            }
        }
        if (listaNueva != null && listaNueva.length > 0){
            var s = '<ul class="list-group" id="ulContenidoUsuarios">';
            for(var i in listaNueva){
                var nombre = listaNueva[i].NombreCompleto + ', ' + listaNueva[i].Rol;
                var rolId =listaNueva[i].OtroSeis;
                var id = listaNueva[i].Id + '_li';
                var idChk = listaNueva[i].Id;
                s += '<li class="list-group-item" id="' + id + '" ><input type="checkbox" class="form-check-input" id="' + idChk + '"> ' + nombre + '<span class="hidden">' + rolId + '</span> </li>';

            }
            s += '</ul>';
            //seteamos el elemento con los nuevos valores
            $("#contenidoUsuarios").html(s);
        }

        //del formulario
        Menu();

        ko.mapping.fromJS(data, {}, self);



    }

    //obtenemos los para
    var obtenerRoles = jQuery.ajax({
        url : ObtenerUrl('RolInstitucion'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId") })
    });

    var obtenerSol = jQuery.ajax({
        url : ObtenerUrl('Solicitudes'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId") })
    });
    var obtenerUsuarios = $.getJSON(ObtenerUrl('ListarUsuarios') + '?instId=' + sessionStorage.getItem("InstId") +  '&rolId=' + sessionStorage.getItem("RolId"));


    $.when(obtenerRoles, obtenerSol, obtenerUsuarios).then(
        function(dataRol, data, dataUsuarios){

            elem = document.getElementById('principal');

            //frmIdRol = ko.observable(0);
           // selectedRol = 0;
            ko.applyBindings(new InstitucionViewModel(dataRol[0], data, dataUsuarios[0].proposals), self.elem);


            $('#principal').show();
            $('#loading').hide();

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
            $('#principal').show();
            $('#loading').hide();
        }
    );

    //consltar usuarios
    self.onChange = function (item) {
        var id= $("#selectIdRol").val();
        //buscar los usuarios de esa institucion y ese rol
        if (id > 0) {
            $.ajax({
                url: ObtenerUrl('Persona'),
                type: "POST",
                data: ko.toJSON({InstId: sessionStorage.getItem("InstId"), RolId: id.toString()}),
                contentType: "application/json",
                dataType: "json",
                success: function (personas) {
                    //// ok
                    self.elem = document.getElementById('listUsuarios');
                    //var div = document.getElementById('contenidoUsuarios');
                    //ko.cleanNode(self.elem);
                    //ko.applyBindings(new InstitucionViewModel([], personas), self.elem);
                    //<li class="list-group-item" data-bind="text: usu.Rut"></li>
                    if (personas != null && personas.length > 0){
                        var s = '<ul class="list-group" id="ulContenidoUsuarios">';
                        for(var i in personas){
                            var nombre = personas[i].Nombres + ' ' + personas[i].ApellidoPaterno + ' ' + personas[i].ApellidoMaterno;
                            var id = personas[i].Id + '_li';
                            var idChk = personas[i].Id;
                            s += '<li class="list-group-item" id="' + id + '" ><input type="checkbox" class="form-check-input" id="' + idChk + '"> ' + nombre + '</li>';

                        }
                        s += '</ul>';
                        //seteamos el elemento con los nuevos valores
                        $("#contenidoUsuarios").html(s);
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
        }
        else
        {
            //limpiar
            $("#contenidoUsuarios").html('<ul class="list-group"><li class="list-group-item">No hay Datos</li></ul>');

        }

    }

    self.guardar = function () {

        var arr = [];
        $("#ulContenidoUsuarios").each(function(index){
            if (index >= 0 ){ // ignorando el primer elemento cuando index es igual 0
                var element = $(this); // <-- en la variable element tienes tu elemento

                var cantidad = element[0].childNodes.length;
                var idRol = $("#selectIdRol").val();


                for (var i = 0; i <= cantidad; i++) {
                    var nnn = element[0].childNodes[i];
                    //ahora tenemos los valores de los elementos del nodo
                    if (nnn != undefined) {
                        if (nnn.childNodes.length > 0) {
                            var check = nnn.childNodes[0];
                            var text = nnn.childNodes[1];
                            var idUsuario = check.id;
                            var nombreUsuario = text.data;
                            var idRolG = nnn.childNodes[2].innerText;
                            //verificamos si esta checkeado
                            if (check.checked){
                                //si esta checkeado hay que agregarlo al arreglo
                                var entidad = {
                                  UsuId: idUsuario, Nombre: nombreUsuario, RolId: idRolG, InstId: sessionStorage.getItem("InstId")
                                };
                                arr.push(entidad);
                            }

                            //console.log(check + ' ' + text);
                        }
                    }
                }
                //verificamos si hay o no usuarios seleccionados
                if (arr.length == 0){
                    //mensaje de error
                    getNotify('error', 'Selección', 'Debe seleccionar al menos un usuario de la lista');
                }
                else {
                    //ahora se debe procesar la lista
                    swal({
                        title: "Guardar",
                        text: "¿Está seguro de asociar a estos usuarios?",
                        type: "info",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        customClass: 'sweetalert-xs',
                        showLoaderOnConfirm: true
                    }, function (isConfirm) {
                        if (isConfirm) {
                            setTimeout(function () {

                                $.ajax({
                                    url: ObtenerUrl('Solicitudes'),
                                    type: "PUT",
                                    data: ko.toJSON(arr),
                                    contentType: "application/json",
                                    dataType: "json",
                                    success: function (dataF) {
                                        //ok
                                        swal({
                                                title: "Asociado",
                                                text: "Se han asociado los usuarios con éxito.",
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
                                                    EnviarMensajeSignalR('Se ha crado asociación de Solicitudes.', "administracionsolicitudes.html", "4", sessionStorage.getItem("RolId"), dataF);
                                                    window.location.href = "administracionsolicitudes.html";
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
                            //window.location.href = "usuarios.html";
                        }
                    });


                }

            }
        });

        /*
         var idRegion = $("#selectIdRegion").val();
         var idUsuario = getParameterByName('idUsuario');
         var idComuna = $("#selectIdComuna").val();
         var idRol = $("#selectIdRol").val();
         //var instId = sessionStorage.getItem("InstId");
         var instId = $("#selectInstitucion").val();
         //**********************************************
         var pass = $("#txtPassword").val();
         var nuevaPass = $("#txtNuevaPassword").val()
         if (pass != nuevaPass)
         {
         frmPassword = '';
         frmNuevaPassword = '';
         }
         //ahora se podría guardar
         var usuario = {
         Id: idUsuario,
         NombreUsuario: frmNombreUsuario,
         Nombres: frmNombres,
         PrimerApellido: frmApellidoPaterno,
         SegundoApellido: $("#txtSegundoApellido").val(),
         Rut: frmRut,
         Correo: frmCorreoElectronico,
         Telefono: frmTelefono,
         IdRegion: idRegion,
         IdComuna: idComuna,
         Direccion: frmDireccion,
         IdRol: idRol,
         Password: pass,
         InstId: instId,
         NuevaPassword: nuevaPass,
         EsCpas: sessionStorage.getItem("ES_CPAS")
         };
         $.ajax({
         url: ObtenerUrl('ObtenerUsuario'),
         type: "PUT",
         data: ko.toJSON(usuario),
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
         EnviarMensajeSignalR('Se ha creado/modificado un usuario.', "usuarios.html", "4", sessionStorage.getItem("RolId"), result);
         window.location.href = "usuarios.html";
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
         */

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


});
function Volver() {
    window.location.href = "ListarRoles.html";
}
function buscar(regId) {
    alert(regId);
}