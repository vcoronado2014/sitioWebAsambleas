
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
            sessionStorage.clear();
            window.location.href = "index.html";
            return;
        }
        else
        {
            //directo al login
            window.location.href = "index.html";
        }


    });


    function PersonViewModel(data, dataP, dataT) {
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

        //se sustituye por Menu
        /*
        if (sessionStorage.getItem("RolId") == '1')
            shouldShowMessage = ko.observable(true);
        else
            shouldShowMessage = ko.observable(false);
        */
        //aplicar Menu
        Menu();

        //manejaremos un poco la vista para que no se vea mal
        claseMostrarIngresos = ko.observable("col-lg-3 col-md-6");
        claseMostrarDocumentos = ko.observable("col-lg-3 col-md-6");
        if (sessionStorage.getItem("RolId") != '1')
        {
            //solo puede ver dos elementos
            claseMostrarIngresos = ko.observable("col-xs-12 col-md-6");
            claseMostrarDocumentos = ko.observable("col-xs-12 col-md-6");
        }

        var dataConsulta = ko.toJSON({ InstId: self.instId });
        var dataConsultaDos = ko.toJSON({ IdUsuario: sessionStorage.getItem("Id") });

        var obtenerUsuarios = jQuery.ajax({
            url : ObtenerUrl('ListarUsuarios'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: dataConsulta
        });

        var obtenerInstituciones =  jQuery.ajax({
            url : ObtenerUrl('Institucion'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: dataConsultaDos
        });

        var obtenerRendiciones =  jQuery.ajax({
            url : ObtenerUrl('Rendicion'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: dataConsulta
        });

        var obtenerDocumentos =  jQuery.ajax({
            url : ObtenerUrl('FileDocumento'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: dataConsulta
        });

        $.when(obtenerUsuarios, obtenerInstituciones, obtenerRendiciones, obtenerDocumentos).then(
            function(resultUsuarios, resultInstituciones, resultRendiciones, resultDocumentos){
                //ambas habran tenido exito
                //alert('exito');
                $('#infoUsuarios').text(resultUsuarios[0].length);
                $('#infoInstituciones').text(resultInstituciones[0].proposals.length);
                $('#infoIngresos').text(resultRendiciones[0].proposals.length);
                $('#infoDocumentos').text(resultDocumentos[0].proposals.length);

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
                    fechaInicio : moment(new Date(itemsProcesar[i].annoIni,itemsProcesar[i].mesIni, parseInt(itemsProcesar[i].diaIni),  itemsProcesar[i].horaIni, itemsProcesar[i].minutosIni,0, 0)).format("DD-MM-YYYY"),
                    fechaTermino : moment(new Date(itemsProcesar[i].annoTer, itemsProcesar[i].mesTer, parseInt(itemsProcesar[i].diaTer), itemsProcesar[i].horaTer, itemsProcesar[i].minutosTer, 0, 0)).format("DD-MM-YYYY"),
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

    }


    var dataCalendario = [];
    var dataProyecto =  [];
    var dataTricel =  [];

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

    $.when(obtenerCalendario, obtenerProyecto, obtenerTricel).then(
        function(data, dataP, dataT){
            dataCalendario = data[0];
            dataProyecto = dataP[0];
            dataTricel = dataT[0];
            elem = document.getElementById('principal');

            ko.applyBindings(new PersonViewModel(dataCalendario, dataProyecto, dataTricel));

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


    $('#principal').show();
    $('#loading').hide();

});
$(window).load(function () {
    // Una vez se cargue al completo la página desaparecerá el div "cargando"
    //$('#principal').hide();
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