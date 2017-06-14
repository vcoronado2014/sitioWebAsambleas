
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


    function PersonViewModel(data, dataP, dataT, dataU, dataI, dataR, dataD) {
        var self = this;
        //self.people = ko.observableArray([]);
        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
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

        //manejaremos un poco la vista para que no se vea mal
        //claseMostrarInstituciones = ko.observable("col-lg-4 col-md-4");
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

        $('#infoUsuariosN').text(dataU.length);
        $('#infoInstituciones').text(dataI.proposals.length);
        $('#infoIngresos').text(dataR.proposals.length);
        $('#infoDocumentos').text(dataD.proposals.length);

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
                    fechaInicio : moment(new Date(itemsProcesar[i].annoIni,itemsProcesar[i].mesIni - 1, parseInt(itemsProcesar[i].diaIni),  itemsProcesar[i].horaIni, itemsProcesar[i].minutosIni,0, 0)).format("DD-MM-YYYY"),
                    fechaTermino : moment(new Date(itemsProcesar[i].annoTer, itemsProcesar[i].mesTer - 1, parseInt(itemsProcesar[i].diaTer), itemsProcesar[i].horaTer, itemsProcesar[i].minutosTer, 0, 0)).format("DD-MM-YYYY"),
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