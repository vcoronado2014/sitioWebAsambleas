/**
 * Created by victorcoronado on 09/09/17.
 */
$(function () {

    document.querySelector("html").classList.add('js');
//swal-input1
   /*  $('#textAreaPrueba').emoji({ place: 'after' }); */


    //$('#swal-input1').emoji({ place: 'after' });

    var fileInputUno = document.querySelector(".input-file-uno"),
        button = document.querySelector(".input-file-trigger"),
        the_return = document.querySelector(".file-return");

        var fileInpuDos = document.querySelector(".input-file-dos"),
        button = document.querySelector(".input-file-trigger"),
        the_return = document.querySelector(".file-return");

        var fileInputTres = document.querySelector(".input-file-tres"),
        button = document.querySelector(".input-file-trigger"),
        the_return = document.querySelector(".file-return");

        var fileInputCuatro = document.querySelector(".input-file-cuatro"),
        button = document.querySelector(".input-file-trigger"),
        the_return = document.querySelector(".file-return");



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
            //implementacion v2.8 agregar imagenes
            var itemsProcesar = data;
            if (itemsProcesar && itemsProcesar.length > 0) {
                for(var i in itemsProcesar){
                    if (itemsProcesar[i].Perfil.Id > 0){
                        itemsProcesar[i].Perfil.Url = ObtenerUrlRaizNovedades() + '/' +  itemsProcesar[i].Perfil.Foto;
                    }
                    itemsProcesar[i].CantidadArchivos = itemsProcesar[i].ArchivosAdjuntos.length;
                    if (itemsProcesar[i].ArchivosAdjuntos && itemsProcesar[i].ArchivosAdjuntos.length > 0){
                        for(var s in itemsProcesar[i].ArchivosAdjuntos){

                            //aca procesamos los archivos
                            var arc = itemsProcesar[i].ArchivosAdjuntos[s].NombreArchivo.split('.');
                            if (arc.length == 2) {
                                itemsProcesar[i].ArchivosAdjuntos[s].Extension = arc[1];
                                itemsProcesar[i].ArchivosAdjuntos[s].Src = ObtenerUrlRaiz() + itemsProcesar[i].ArchivosAdjuntos[s].NombreCarpeta + '/' + itemsProcesar[i].ArchivosAdjuntos[s].NombreArchivo;
                            }
                            if (itemsProcesar[i].CantidadArchivos == 1){
                                itemsProcesar[i].ArchivosAdjuntos[s].Width = "75%";
                            }
                            if (itemsProcesar[i].CantidadArchivos == 2){
                                itemsProcesar[i].ArchivosAdjuntos[s].Width = "48%";
                            }
                            if (itemsProcesar[i].CantidadArchivos == 3){
                                itemsProcesar[i].ArchivosAdjuntos[s].Width = "32%";
                            }
                            if (itemsProcesar[i].CantidadArchivos == 4){
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
            data = itemsProcesar;
            console.log(data);
        //********************************** */
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

        if (ModificaMuro()) {
            var textoOriginal = '<div class="col-xs-12">' + 'original: ' + item.Texto + "</div>";
            var prioridadId = item.PrioridadId;
            var mroId = item.MroId;
            var id = item.Id;
            swal({
                title: 'Responder',
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                width: '500px',
                confirmButtonText: "Enviar",
                cancelButtonText: "Cancelar",
                customClass: 'sweetalert-md',
                html: textoOriginal +
                '<div class="col-xs-12><div class="input-group"  style="width: 100%;">' +
                /* '<input id="swal-input1" class="swal2-input" style="width: 100%;" value="' + item.Texto + '"/>' + */
                /* '<textarea id="swal-input1" class="swal2-input"  style="width: 100%; height:150px;" maxlength="250">' + item.Texto + '</textarea>' +  */
                '<textarea id="swal-input1" class="swal2-input" style="width: 100%; height:150px; margin-bottom: 0;" maxlength="250">' + item.Texto + '</textarea></div><div class="col-12"><div id="container"></div>' +
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
                                        customClass: 'sweetalert-md',
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
                },
                onClose: () => {
                    return;
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
                customClass: 'sweetalert-md',
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
                                        customClass: 'sweetalert-md',
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
                title: 'Agregar Comentario',
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Enviar",
                cancelButtonText: "Cancelar",
                customClass: 'sweetalert-md',
                html: 
                '<div class="row">' +

                '<div class="col-xs-12 input-file-container" style="margin: 0; padding: 1px;">'+
                '<input class="input-file" type="file" accept="image/*" onchange="agregarArchivo()"  #fileInput id="my-file-uno">' +
                '<label tabindex="0" for="my-file-uno" class="input-file-trigger">Agregar Archivos</label>' +
                '<p class="file-return" id="file-return-uno"></p>' +
                '</div>' +
                
                '<div class="col-xs-12" id="listadoArchivosAdjuntos">'+
                '</div>' +

/*                 '<div class="col-xs-6 input-file-container" style="margin: 0; padding: 1px;">'+
                '<input class="input-file" type="file" accept="image/*" onchange="change()"  #fileInput id="my-file-uno">' +
                '<label tabindex="0" for="my-file-uno" class="input-file-trigger">Archivo 1...</label>' +
                '<p class="file-return" id="file-return-uno"></p>' +
                '</div>' +
                

                '<div class="col-xs-6 input-file-container" style="margin: 0; padding: 1px;">'+
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

                '<div class="col-xs-12><label for="basic-url">Ingrese Comentario</label><div class="input-group"  style="width: 100%;">' +
                /* '<input id="swal-input1" class="swal2-input" style="width: 100%;" />' + */
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
                            Texto: texto,
                            EsCpas: sessionStorage.getItem("ES_CPAS")
                        };

                        setTimeout(function () {

                            $.ajax({
                                url: ObtenerUrl('Muro'),
                                type: 'PUT',
                                data: ko.toJSON(entidad),
                                contentType: "application/json",
                                dataType: "json",
                                complete: function (data) {
                                    var estaCompletado = false;
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
                                    if (listaArchivos.length == contadorArchivos){
                                        swal({
                                            title: 'Guardado',
                                            text: "Registro guardado con éxito.",
                                            type: 'success',
                                            showCancelButton: false,
                                            confirmButtonClass: "btn-success",
                                            customClass: 'sweetalert-md',
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
                                }
                            });
                                    //lo comentamos por mientras
                                    /*
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
                                    */

                                
                            

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
    guardarArchivo = function () {
        var id = getParameterByName('id');
        var eliminado = getParameterByName('ELIMINAR');

        if (id != "0") {

            var files = $("#txtArchivo").get(0).files;
            extensiones_permitidas = new Array(".gif", ".jpg", ".doc", ".pdf", ".xls", ".xlsx", ".docx", ".png");

            if (ValidaExtension(files[0], extensiones_permitidas) == true) {

                var model = new FormData();
                model.append("ProId", id);
                model.append("UploadedImage", files[0]);


                swal({
                    title: "Subir",
                    text: "¿Está seguro de subir este archivo?",
                    type: "info",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    customClass: 'sweetalert-md',
                    showLoaderOnConfirm: true
                }, function (isConfirm) {
                    if (isConfirm) {


                        setTimeout(function () {

                            $.ajax({
                                url: ObtenerUrlDos('ArchivoProyecto'),
                                type: 'POST',
                                dataType: 'json',
                                data: model,
                                processData: false,
                                contentType: false,// not json
                                complete: function (data) {

                                    swal({
                                            title: "Guardado",
                                            text: "El Registro ha sido guardado con éxito.",
                                            type: "success",
                                            showCancelButton: false,
                                            confirmButtonClass: "btn-success",
                                            confirmButtonText: "Ok",
                                            cancelButtonText: "No, cancel plx!",
                                            closeOnConfirm: true,
                                            customClass: 'sweetalert-md',
                                            closeOnCancel: false
                                        },
                                        function (isConfirm) {
                                            if (isConfirm) {
                                                EnviarMensajeSignalR('Se ha agregado un archivo a un Proyecto.', "ListarProyecto.html", "4", sessionStorage.getItem("RolId"), data);
                                                window.location.href = "CrearModificarProyecto.html?id=" + id + "&ELIMINAR=" + eliminado;


                                            } else {
                                                swal("Cancelled", "Your imaginary file is safe :)", "error");
                                            }
                                        });

                                }
                            });

                        }, 2000);

                    }
                    else {
                        window.location.href = "ListarProyecto.html";
                    }
                });

            }
        }
        else
        {
            getNotify('error', 'Guardar', 'Debe Guardar antes de agregar un archivo.');
        }



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
                customClass: 'sweetalert-md',
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
                            Id: mroId,
                            EsCpas: sessionStorage.getItem("ES_CPAS")
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
                                        customClass: 'sweetalert-md',
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
                                url: ObtenerUrl('Muro'),
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

    function changeListener($event){
        console.log($event);
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