/**
 * Created by vcoronado on 09-06-2017.
 */
$(document).ready(function () {
    /*
    $('#principal').hide();
    $('#loading').show();

    function MostrarReporteUsuarios()
    {
        var idInst = sessionStorage.getItem("InstId");
        var idUsuario = sessionStorage.getItem("Id");
        var nombreReporte = 'usuarios';

        var URL = 'vistaReporte.html?INST_ID=' + idInst + '&USU_ID=' + idUsuario + '&NOMBRE_REPORTE=' + nombreReporte;
        var win = window.open(URL, "_blank");

    }
    */
    $('#principal').show();
    $('#loading').hide();

});
function MostrarReporteUsuarios()
{
    var idInst = sessionStorage.getItem("InstId");
    var idUsuario = sessionStorage.getItem("Id");
    var nombreUsuario= sessionStorage.getItem("NombreUsuario");
    var nombreReporte = 'usuarios';

    var URL = 'vistaReporte.html?INST_ID=' + idInst + '&USU_ID=' + idUsuario + '&NOMBRE_REPORTE=' + nombreReporte+ '&NOMBRE_USUARIO=' + nombreUsuario;
    var win = window.open(URL, "_blank");

}