/**
 * Created by vcoronado on 09-06-2017.
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

    $('[data-toggle="tooltip"]').tooltip()

    function ReportesViewModel(data) {
        var self = this;
        //self.people = ko.observableArray([]);
        self.nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        self.id = ko.observable(sessionStorage.getItem("Id"));
        self.instId = ko.observable(sessionStorage.getItem("InstId"));
        self.nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));
        self.idUsuario = getParameterByName('idUsuario');

        self.elem = document.getElementById('principal');

        Menu();

        //ko.mapping.fromJS(data, {}, self);

    }

    elem = document.getElementById('principal');
    ko.applyBindings(new ReportesViewModel([]), self.elem);

    $('#principal').show();
    $('#loading').hide();

});
function MostrarReporteUsuarios()
{
    var idInst = sessionStorage.getItem("InstId");
    var idUsuario = sessionStorage.getItem("Id");
    var nombreUsuario= sessionStorage.getItem("NombreUsuario");
    var rolId= sessionStorage.getItem("RolId");
    var nombreReporte = 'usuarios';

    var URL = 'vistaReporte.html?INST_ID=' + idInst + '&USU_ID=' + idUsuario + '&NOMBRE_REPORTE=' + nombreReporte+ '&NOMBRE_USUARIO=' + nombreUsuario + '&ROL_ID=' + rolId + '&MODO=mostrar';
    var win = window.open(URL, "_blank");

}
function MostrarReporteInstituciones()
{
    var idInst = sessionStorage.getItem("InstId");
    var idUsuario = sessionStorage.getItem("Id");
    var nombreUsuario= sessionStorage.getItem("NombreUsuario");
    var rolId= sessionStorage.getItem("RolId");
    var nombreReporte = 'instituciones';

    var URL = 'vistaReporte.html?INST_ID=' + idInst + '&USU_ID=' + idUsuario + '&NOMBRE_REPORTE=' + nombreReporte+ '&NOMBRE_USUARIO=' + nombreUsuario + '&ROL_ID=' + rolId+ '&MODO=mostrar';
    var win = window.open(URL, "_blank");

}
function MostrarReporteRendiciones()
{
    var idInst = sessionStorage.getItem("InstId");
    var idUsuario = sessionStorage.getItem("Id");
    var nombreUsuario= sessionStorage.getItem("NombreUsuario");
    var rolId= sessionStorage.getItem("RolId");
    var nombreReporte = 'rendiciones';

    var URL = 'vistaReporte.html?INST_ID=' + idInst + '&USU_ID=' + idUsuario + '&NOMBRE_REPORTE=' + nombreReporte+ '&NOMBRE_USUARIO=' + nombreUsuario + '&ROL_ID=' + rolId + '&MODO=mostrar';
    var win = window.open(URL, "_blank");

}

function DescargarReporteUsuarios()
{
    var idInst = sessionStorage.getItem("InstId");
    var idUsuario = sessionStorage.getItem("Id");
    var nombreUsuario= sessionStorage.getItem("NombreUsuario");
    var rolId= sessionStorage.getItem("RolId");
    var nombreReporte = 'usuarios';

    var URL = 'vistaReporte.html?INST_ID=' + idInst + '&USU_ID=' + idUsuario + '&NOMBRE_REPORTE=' + nombreReporte+ '&NOMBRE_USUARIO=' + nombreUsuario + '&ROL_ID=' + rolId + '&MODO=desc1argar';
    var win = window.open(URL, "_blank");
    win.close();

}
function DescargarReporteInstituciones()
{
    var idInst = sessionStorage.getItem("InstId");
    var idUsuario = sessionStorage.getItem("Id");
    var nombreUsuario= sessionStorage.getItem("NombreUsuario");
    var rolId= sessionStorage.getItem("RolId");
    var nombreReporte = 'instituciones';

    var URL = 'vistaReporte.html?INST_ID=' + idInst + '&USU_ID=' + idUsuario + '&NOMBRE_REPORTE=' + nombreReporte+ '&NOMBRE_USUARIO=' + nombreUsuario + '&ROL_ID=' + rolId+ '&MODO=descargar';
    var win = window.open(URL, "_blank");

}
function DescargarReporteRendiciones()
{
    var idInst = sessionStorage.getItem("InstId");
    var idUsuario = sessionStorage.getItem("Id");
    var nombreUsuario= sessionStorage.getItem("NombreUsuario");
    var rolId= sessionStorage.getItem("RolId");
    var nombreReporte = 'rendiciones';

    var URL = 'vistaReporte.html?INST_ID=' + idInst + '&USU_ID=' + idUsuario + '&NOMBRE_REPORTE=' + nombreReporte+ '&NOMBRE_USUARIO=' + nombreUsuario + '&ROL_ID=' + rolId + '&MODO=descargar';
    var win = window.open(URL, "_blank");

}