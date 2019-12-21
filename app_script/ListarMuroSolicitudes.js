/**
 * Created by VICTOR CORONADO on 10/12/2017.
 */
/**
 * Created by victorcoronado on 09/09/17.
 */
$(function () {

    document.querySelector("html").classList.add('js');



    var fileInputUno = document.querySelector(".input-file-uno"),
        button = document.querySelector(".input-file-trigger"),
        the_return = document.querySelector(".file-return");

        var fileInputDos = document.querySelector(".input-file-dos"),
        button = document.querySelector(".input-file-trigger"),
        the_return = document.querySelector(".file-return");


    $('#principal').hide();
    $('#loading').show();
    exp: var fileUnoG = new Object();
    exp: var fileDosG = new Object();

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
        url : ObtenerUrl('SolMuro'),
        type: 'POST',
        dataType : "json",
        contentType: "application/json",
        data: ko.toJSON({ InstId: sessionStorage.getItem("InstId"), UsuId: sessionStorage.getItem("Id") })
    });

    $.when(obtenerMuro).then(
        function(data){
            //aca habria que recorrer las solicitudes para traerse los adjuntos
            var itemsProcesar = data;
            if (itemsProcesar && itemsProcesar.length > 0){

                for (var i in itemsProcesar) {
                    if (itemsProcesar[i].Perfil.Id > 0){
                        itemsProcesar[i].Perfil.Url = ObtenerUrlRaizNovedades() + '/' +  itemsProcesar[i].Perfil.Foto;
                    }
                    itemsProcesar[i].CantidadArchivos = itemsProcesar[i].Archivos.length;
                    if (itemsProcesar[i].Archivos && itemsProcesar[i].Archivos.length > 0) {
                        for (var s in itemsProcesar[i].Archivos) {
                            //aca procesamos los archivos
                            var arc = itemsProcesar[i].Archivos[s].NombreArchivo.split('.');
                            if (arc.length == 2) {
                                itemsProcesar[i].Archivos[s].Extension = arc[1];
                                itemsProcesar[i].Archivos[s].Src = ObtenerUrlRaiz() + itemsProcesar[i].Archivos[s].NombreCarpeta + '/' + itemsProcesar[i].Archivos[s].NombreArchivo;
                            }
                            if (itemsProcesar[i].CantidadArchivos == 1) {
                                itemsProcesar[i].Archivos[s].Width = "75%";
                            }
                            if (itemsProcesar[i].CantidadArchivos == 2) {
                                itemsProcesar[i].Archivos[s].Width = "48%";
                            }
                            if (itemsProcesar[i].CantidadArchivos == 3) {
                                itemsProcesar[i].Archivos[s].Width = "32%";
                            }
                            if (itemsProcesar[i].CantidadArchivos == 4) {
                                itemsProcesar[i].Archivos[s].Width = "24%";
                            }
                        }
                    }
                    if (itemsProcesar[i].RespuestaMuro && itemsProcesar[i].RespuestaMuro.length > 0) {
                        //ahora recorremos las respuestas
                        for (var t in itemsProcesar[i].RespuestaMuro) {
                            if (itemsProcesar[i].RespuestaMuro[t].Perfil.Id > 0){
                                itemsProcesar[i].RespuestaMuro[t].Perfil.Url = ObtenerUrlRaizNovedades() + '/' +  itemsProcesar[i].RespuestaMuro[t].Perfil.Foto;
                            }

                            if (itemsProcesar[i].RespuestaMuro[t].ArchivoAdjunto && itemsProcesar[i].RespuestaMuro[t].ArchivoAdjunto.Id > 0) {


                                var arcR = itemsProcesar[i].RespuestaMuro[t].ArchivoAdjunto.NombreArchivo.split('.');
                                if (arcR.length == 2) {
                                    itemsProcesar[i].RespuestaMuro[t].ArchivoAdjunto.Extension = arcR[1];
                                    itemsProcesar[i].RespuestaMuro[t].ArchivoAdjunto.Src = ObtenerUrlRaiz() + itemsProcesar[i].RespuestaMuro[t].ArchivoAdjunto.NombreCarpeta + '/' + itemsProcesar[i].RespuestaMuro[t].ArchivoAdjunto.NombreArchivo;
                                    itemsProcesar[i].RespuestaMuro[t].ArchivoAdjunto.Height = "75px";
                                }


                            }


                        }
                    }
                }
            }
            data = itemsProcesar;
            console.log(data);
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

    modificarMensaje = function (item) {

        if (ModificaMroSolicitudes()) {
            var textoOriginal = '<div class="col-xs-12">' + 'original: ' + item.Texto + "</div>";
            var prioridadId = item.PrioridadId;
            var mroId = item.MroId;
            var id = item.Id;
            var imagen = '';
            if (item.ArchivoAdjunto.Id > 0){
                imagen = 
                '<a href="' + item.ArchivoAdjunto.Src + '" target="_blank">' +
                '<img src="' + item.ArchivoAdjunto.Src + '" width="75%" alt="User Avatar"' +
                    'class="img-solicitudes"> </a>'
            }

            swal({
                title: 'Responder',
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Enviar",
                cancelButtonText: "Cancelar",
                customClass: 'sweetalert-xs',
                html: 
                    imagen +
                    textoOriginal +
                    '<div class="col-xs-12><div class="input-group"  style="width: 100%;">' +
                    '<textarea id="swal-input1" class="swal2-input"  style="width: 100%; height:150px;margin-bottom: 0;" maxlength="250">' + item.Texto + '</textarea>' + 
                    /* '<input id="swal-input1" class="swal2-input" style="width: 100%;" value="' + item.Texto + '"/>' + */
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
                                url: ObtenerUrl('ResSolMuro'),
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
                                        EnviarMensajeSignalR('Se ha modificado una Respuesta al muro.', "ListarMuroSolicitudes.html", "4", sessionStorage.getItem("RolId"), data);
                                        window.location.href = "ListarMuroSolicitudes.html";
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
        if (CreaMroSolicitudes()) {
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
                html: 
                '<h5>Agregue Un Archivo si lo desea</h5>' +
                '<div class="row">' +
                '<div class="col-xs-12 input-file-container" style="margin: 0; padding: 1px;">'+
                '<input class="input-file" type="file" accept="image/*" onchange="changeDos()"  #fileInput2 id="my-file-dos">' +
                '<label tabindex="0" for="my-file-dos" class="input-file-trigger">Archivo 1...</label>' +
                '<p class="file-return" id="file-return-dos"></p>' +
                '</div>' +
                '</div>' +
                
                textoOriginal +
                '<div class="col-xs-12><div class="input-group"  style="width: 100%;">' +
                /* '<input id="swal-input1" class="swal2-input" style="width: 100%;" />' + */
                '<textarea id="swal-input1" class="swal2-input"  style="width: 100%; height:150px;margin-bottom: 0;" maxlength="250"></textarea>' + 
                '</div></div>',
                onBeforeOpen: () => {
                    $('#swal-input1').emoji({ place: 'after', rowSize: 15 });
                },
                preConfirm: function () {

                    return new Promise(function (resolve, reject) {
                        var contadorArchivosGeneral = 0;
                        var texto = $('#swal-input1').val();
                        var instId = sessionStorage.getItem("InstId");
                        var usuId = sessionStorage.getItem("Id");
                        var rolId = sessionStorage.getItem("RolId");
                        //manejo de archivos para comparar
                        if (fileDosG && fileDosG.size > 0) {
                            contadorArchivosGeneral++;
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
                            MroId: mroId,
                            RolId: rolId,
                            Texto: texto
                        };

                        setTimeout(function () {

                            $.ajax({
                                url: ObtenerUrl('ResSolMuro'),
                                type: 'PUT',
                                data: ko.toJSON(entidad),
                                contentType: "application/json",
                                dataType: "json",
                                complete: function (data) {
                                    var contadorArchivos = 0;
                                    var resultado = JSON.parse(ko.toJSON(data)).responseJSON;
                                    if (fileDosG && fileDosG.size > 0) {
                                        contadorArchivos++;
                                        var modelUno = new FormData();
                                        modelUno.append("UploadedImage", fileDosG);
                                        modelUno.append("idElemento", resultado.Id);
                                        modelUno.append("instId", instId);
                                        modelUno.append("tipoPadre", '3');
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
                                    if (contadorArchivosGeneral == contadorArchivos){
                                        swal({
                                            title: 'Guardado',
                                            text: "Registro guardado con éxito.",
                                            type: 'success',
                                            showCancelButton: false,
                                            confirmButtonClass: "btn-success",
                                            customClass: 'sweetalert-xs',
                                            confirmButtonText: "Aceptar"
                                        }).then(function () {
                                            EnviarMensajeSignalR('Se ha agregado una Respuesta al muro.', "ListarMuroSolicitudes.html", "4", sessionStorage.getItem("RolId"), data);
                                            window.location.href = "ListarMuroSolicitudes.html";
                                        });
                                    }
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
        if (CreaMroSolicitudes()) {
            swal({
                title: 'Agregar Comentario',
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Enviar",
                cancelButtonText: "Cancelar",
                customClass: 'sweetalert-xs',
                html:
                '<h5>Agregue Un Archivo si lo desea</h5>' +
                '<div class="row">' +
                '<div class="col-xs-12 input-file-container" style="margin: 0; padding: 1px;">'+
                '<input class="input-file" type="file" accept="image/*" onchange="change()"  #fileInput id="my-file-uno">' +
                '<label tabindex="0" for="my-file-uno" class="input-file-trigger">Archivo 1...</label>' +
                '<p class="file-return" id="file-return-uno"></p>' +
                '</div>' +
                '</div>' +

                '<div class="col-xs-12><label for="basic-url">Ingrese Comentario</label><div class="input-group"  style="width: 100%;">' +
                /* '<input id="swal-input1" class="swal2-input" style="width: 100%;" />' + */
                '<textarea id="swal-input1" class="swal2-input"  style="width: 100%; height:150px;margin-bottom: 0;" maxlength="250"></textarea>' + 
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
                        if (fileUnoG && fileUnoG.size > 0) {
                            contadorArchivosGeneral++;
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
                            Texto: texto,
                            EsCpas: sessionStorage.getItem("ES_CPAS")
                        };

                        setTimeout(function () {

                            $.ajax({
                                url: ObtenerUrl('SolMuro'),
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
                                        modelUno.append("tipoPadre", '2');
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
                                    if (contadorArchivosGeneral == contadorArchivos){
                                        swal({
                                            title: 'Guardado',
                                            text: "Registro guardado con éxito.",
                                            type: 'success',
                                            showCancelButton: false,
                                            confirmButtonClass: "btn-success",
                                            customClass: 'sweetalert-xs',
                                            confirmButtonText: "Aceptar"
                                        }).then(function () {
                                            EnviarMensajeSignalR('Se ha agregado una Novedad al Muro.', "ListarMuroSolicitudes.html", "4", sessionStorage.getItem("RolId"), data);
                                            window.location.href = "ListarMuroSolicitudes.html";
                                        });
                                    }



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
        console.log(fileUnoG);

    } 
    changeDos = function (){
        //console.log(this);
        fileDosG = this.event.target.files[0];
        $('#file-return-dos')[0].innerHTML = fileDosG.name;
        console.log(fileDosG);

    } 
    modificarMuro = function(item){

        //validamos permiso
        if (ModificaMroSolicitudes()) {
            var imagen = '';
            var optionBaja = '<option value = "0">Baja</option>';
            var optionMedia = '<option value = "1">Media</option>';
            var optionAlta = '<option value = "2">Alta</option>';

            if (item.PrioridadId == 0)
                optionBaja = '<option value = "0" selected="selected">Baja</option>';
            if (item.PrioridadId == 1)
                optionMedia = '<option value = "1" selected="selected">Media</option>';
            if (item.PrioridadId == 2)
                optionAlta = '<option value = "2" selected="selected">Alta</option>';

/*             if (item.CantidadArchivos > 0){
                imagen = 
                '<a data-bind="attr: { href: item.Archivos[0].Src }" target="_blank">' +
                '<img data-bind="attr: { src: item.Archivos[0].Src, height: item.Archivos[0].Height }" alt="User Avatar"' +
                    'class="img-solicitudes"> </a>'
            
            } */
            if (item.CantidadArchivos > 0){
                imagen = 
                '<a href="' + item.Archivos[0].Src + '" target="_blank">' +
                '<img src="' + item.Archivos[0].Src + '" width="' + item.Archivos[0].Width + '" alt="User Avatar"' +
                    'class="img-solicitudes"> </a>'
            
            }

            swal({
                title: 'Modificar Comentario',
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Enviar",
                cancelButtonText: "Cancelar",
                customClass: 'sweetalert-xs',
                html: 
                    imagen +
                    '<div class="col-xs-12><label for="basic-url">Comentario</label><div class="input-group"  style="width: 100%;">' +
                    '<textarea id="swal-input1" class="swal2-input"  style="width: 100%; height:150px;margin-bottom: 0;" maxlength="250">' + item.Texto + '</textarea>' + 
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
                            Id: mroId,
                            EsCpas: sessionStorage.getItem("ES_CPAS")
                        };

                        setTimeout(function () {

                            $.ajax({
                                url: ObtenerUrl('SolMuro'),
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
                                        EnviarMensajeSignalR('Se ha modificado una Novedad al Muro.', "ListarMuroSolicitudes.html", "4", sessionStorage.getItem("RolId"), data);
                                        window.location.href = "ListarMuroSolicitudes.html";
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
        if (EliminaMroSolicitudes()) {
            var texto = "Está seguro de eliminar el comentario: " + item.Texto;
            var id = item.Id;
            var EsCpas = sessionStorage.getItem("ES_CPAS");
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
                                url: ObtenerUrl('SolMuro'),
                                type: "DELETE",
                                data: ko.toJSON({Id: id, EsCpas: EsCpas}),
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
                                        EnviarMensajeSignalR('Se ha eliminado un mensaje del muro.', "ListarMuroSolicitudes.html", "2", sessionStorage.getItem("RolId"), dataF);
                                        window.location.href = "ListarMuroSolicitudes.html";
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
        if (EliminaMroSolicitudes()) {
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
                                url: ObtenerUrl('ResSolMuro'),
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
                                        EnviarMensajeSignalR('Se ha eliminado un mensaje del muro.', "ListarMuroSolicitudes.html", "2", sessionStorage.getItem("RolId"), dataF);
                                        window.location.href = "ListarMuroSolicitudes.html";
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