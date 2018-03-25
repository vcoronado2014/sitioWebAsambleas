﻿﻿function ObtenerUrl(api)
{
    return 'http://api.asambleas.cl/api/' + api;
    //return 'http://localhost:58013/api/' + api;
    //return 'http://apps.asambleas.cl/api/' + api;
    //return 'http://localhost:50929/api/' + api;
    //return 'http://127.0.0.1:8080/api/' + api;
}
﻿function ObtenerUrlDos(api)
{
    return 'http://api.asambleas.cl/api/' + api;
    //return 'http://localhost:58013/api/' + api;
    //return 'http://apps.asambleas.cl/api/' + api;
    //return 'http://localhost:58013/api/' + api;
    //return 'http://127.0.0.1:8080/api/' + api;
}
﻿function ObtenerUrlDescargaExcel(nombreArchivo)
{
    return 'http://api.asambleas.cl/Excel/' + nombreArchivo;
    //return 'http://localhost:58013/Excel/' + nombreArchivo;
    //return 'http://apps.asambleas.cl/Excel/' + nombreArchivo;
}
﻿function ObtenerUrlSignalR()
{
    return 'http://vcoronado-001-site8.dtempurl.com/api/' + api;
    //return "http://localhost:34080/signalr/hubs";
    //http://172.16.116.138/apiasambleas/api/
}
function CantidadComentarios(){
    return 3;
}
function TiempoCierreSesion(){
    //en milisegundos estos son por defecto 15 minutos
    return 900000;
}
versionCorta = ko.observable(RetornaVersionUltraCorta());
function RetornaVersionLarga() {
    return 'WebSite v2.5';
}
function RetornaVersionCorta() {
    return 'v=2.5';
}
function RetornaVersionUltraCorta() {
    return 'v2.5';
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

//
// Validador de Rut
// Descargado desde http://www.juque.cl/
//
function revisarDigito(dvr) {
    dv = dvr + ""
    if (dv != '0' && dv != '1' && dv != '2' && dv != '3' && dv != '4' && dv != '5' && dv != '6' && dv != '7' && dv != '8' && dv != '9' && dv != 'k' && dv != 'K') {
        //alert("Debe ingresar un digito verificador valido");
        getNotify('error', 'Dígito verificador', 'Debe ingresar un digito verificador valido.');
        return false;
    }
    return true;
}

function revisarDigito2(crut) {
    largo = crut.length;
    if (largo < 2) {
        //alert("Debe ingresar el rut completo")
        getNotify('error', 'Incompleto', 'Debe ingresar el rut completo.');
        return false;
    }
    if (largo > 2)
        rut = crut.substring(0, largo - 1);
    else
        rut = crut.charAt(0);
    dv = crut.charAt(largo - 1);
    revisarDigito(dv);

    if (rut == null || dv == null)
        return 0

    var dvr = '0'
    suma = 0
    mul = 2

    for (i = rut.length - 1 ; i >= 0; i--) {
        suma = suma + rut.charAt(i) * mul
        if (mul == 7)
            mul = 2
        else
            mul++
    }
    res = suma % 11
    if (res == 1)
        dvr = 'k'
    else if (res == 0)
        dvr = '0'
    else {
        dvi = 11 - res
        dvr = dvi + ""
    }
    if (dvr != dv.toLowerCase()) {
        //alert("EL rut es incorrecto")
        getNotify('error', 'Incorrecto', 'El Rut es Incorrecto.');
        return false
    }

    return true
}

function Rut(texto) {
    var tmpstr = "";
    for (i = 0; i < texto.length ; i++)
        if (texto.charAt(i) != ' ' && texto.charAt(i) != '.' && texto.charAt(i) != '-')
            tmpstr = tmpstr + texto.charAt(i);
    texto = tmpstr;
    largo = texto.length;

    if (largo < 2) {
        //alert("Debe ingresar el rut completo")
        getNotify('error', 'Incompleto', 'Rut Incompleto.');
        return false;
    }

    for (i = 0; i < largo ; i++) {
        if (texto.charAt(i) != "0" && texto.charAt(i) != "1" && texto.charAt(i) != "2" && texto.charAt(i) != "3" && texto.charAt(i) != "4" && texto.charAt(i) != "5" && texto.charAt(i) != "6" && texto.charAt(i) != "7" && texto.charAt(i) != "8" && texto.charAt(i) != "9" && texto.charAt(i) != "k" && texto.charAt(i) != "K") {
            //alert("El valor ingresado no corresponde a un R.U.T valido");
            getNotify('error', 'Inválido', 'El Rut es Inválido.');
            return false;
        }
    }

    var invertido = "";
    for (i = (largo - 1), j = 0; i >= 0; i--, j++)
        invertido = invertido + texto.charAt(i);
    var dtexto = "";
    dtexto = dtexto + invertido.charAt(0);
    dtexto = dtexto + '-';
    cnt = 0;

    for (i = 1, j = 2; i < largo; i++, j++) {
        //alert("i=[" + i + "] j=[" + j +"]" );
        if (cnt == 3) {
            dtexto = dtexto + '.';
            j++;
            dtexto = dtexto + invertido.charAt(i);
            cnt = 1;
        }
        else {
            dtexto = dtexto + invertido.charAt(i);
            cnt++;
        }
    }

    invertido = "";
    for (i = (dtexto.length - 1), j = 0; i >= 0; i--, j++)
        invertido = invertido + dtexto.charAt(i);

    //window.document.form1.rut.value = invertido.toUpperCase()

    if (revisarDigito2(texto))
        return true;

    return false;
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

function Menu()
{
    //ahora procesamos a variable de session
    //rescatamos el rol desde la variable de session
    //antes evaluamos si esta variable existe
    if (sessionStorage != null)
    {
        //var obj = JSON.parse(sessionStorage.RolesPermisos);
        var obj;

        MuestraLogueados = ko.observable(false);

        if (sessionStorage.getItem("ES_CPAS"))
            CssEncabezado = ko.observable("navbar bg-success navbar-fixed-top");
        else
            CssEncabezado = ko.observable("navbar navbar-inverse navbar-default navbar-fixed-top");

        //valores predeterminados
        CreaUsuario = ko.observable(false);
        ModificaUsuario = ko.observable(false);
        EliminaUsuario = ko.observable(false);
        VerUsuario = ko.observable(false);
        CreaInstitucion = ko.observable(false);
        ModificaInstitucion = ko.observable(false);
        EliminaInstitucion = ko.observable(false);
        VerInstitucion = ko.observable(false);
        CreaDocumento = ko.observable(false);
        EliminaDocumento = ko.observable(false);
        VerDocumento = ko.observable(false);
        CreaCalendario = ko.observable(false);
        ModificaCalendario = ko.observable(false);
        EliminaCalendario = ko.observable(false);
        VerCalendario = ko.observable(false);
        CreaTricel = ko.observable(false);
        ModificaTricel = ko.observable(false);
        EliminaTricel = ko.observable(false);
        VerTricel = ko.observable(false);
        CreaProyecto = ko.observable(false);
        ModificaProyecto = ko.observable(false);
        EliminaProyecto = ko.observable(false);
        VerProyecto = ko.observable(false);
        CreaRendicion = ko.observable(false);
        ModificaRendicion = ko.observable(false);
        EliminaRendicion = ko.observable(false);
        VerRendicion = ko.observable(false);
        CreaRol = ko.observable(false);
        ModificaRol = ko.observable(false);
        EliminaRol = ko.observable(false);
        VerRol = ko.observable(false);
        CreaMuro = ko.observable(false);
        ModificaMuro = ko.observable(false);
        EliminaMuro = ko.observable(false);
        VerMuro = ko.observable(false);
        PuedeVotarProyecto = ko.observable(false);
        PuedeVotarTricel = ko.observable(false);
        VerMailing= ko.observable(false);
        CreaMailing= ko.observable(false);
        VerReportes= ko.observable(false);
        VerReporteAsistencia= ko.observable(false);
        //el menu se ve siempre
        menuMenu = ko.observable(true);
        //este parametro lo vamos a dejar visible siempre
        CreaMroSolicitudes = ko.observable(false);
        ModificaMroSolicitudes = ko.observable(false);
        EliminaMroSolicitudes= ko.observable(false);
        VerMroSolicitudes= ko.observable(false);
        //para la administracion de solicitudes
        CreaSolicitudes= ko.observable(false);

        if (sessionStorage.RolesPermisos) {
            obj = JSON.parse(sessionStorage.RolesPermisos);

            if (obj.RolId == 1)
                MuestraLogueados = ko.observable(true);

            //nuevos campos
            if (obj.CreaMroSolicitud == 1)
                CreaMroSolicitudes = ko.observable(true);

            if (obj.ModificaMroSolicitud == 1)
                ModificaMroSolicitudes = ko.observable(true);

            if (obj.EliminaMroSolicitud == 1)
                EliminaMroSolicitudes = ko.observable(true);

            if (obj.VerMroSolicitud == 1)
                VerMroSolicitudes = ko.observable(true);

            if (obj.CreaSolicitud == 1)
                CreaSolicitudes = ko.observable(true);

            if (obj.CreaUsuario == 1)
                CreaUsuario = ko.observable(true);

            if (obj.ModificaUsuario == 1)
                ModificaUsuario = ko.observable(true);

            if (obj.EliminaUsuario == 1)
                EliminaUsuario = ko.observable(true);

            if (obj.VerUsuario == 1)
                VerUsuario = ko.observable(true);

            if (obj.CreaInstitucion == 1)
                CreaInstitucion = ko.observable(true);

            if (obj.ModificaInstitucion == 1)
                ModificaInstitucion = ko.observable(true);

            if (obj.EliminaInstitucion == 1)
                EliminaInstitucion = ko.observable(true);

            if (obj.VerInstitucion == 1)
                VerInstitucion = ko.observable(true);

            if (obj.CreaDocumento == 1)
                CreaDocumento = ko.observable(true);

            if (obj.EliminaDocumento == 1)
                EliminaDocumento = ko.observable(true);

            if (obj.VerDocumento == 1)
                VerDocumento = ko.observable(true);

            if (obj.CreaCalendario == 1)
                CreaCalendario = ko.observable(true);

            if (obj.ModificaCalendario == 1)
                ModificaCalendario = ko.observable(true);

            if (obj.EliminaCalendario == 1)
                EliminaCalendario = ko.observable(true);

            if (obj.VerCalendario == 1)
                VerCalendario = ko.observable(true);

            if (obj.CreaTricel == 1)
                CreaTricel = ko.observable(true);

            if (obj.ModificaTricel == 1)
                ModificaTricel = ko.observable(true);

            if (obj.EliminaTricel == 1)
                EliminaTricel = ko.observable(true);

            if (obj.VerTricel == 1)
                VerTricel = ko.observable(true);

            if (obj.CreaProyecto == 1)
                CreaProyecto = ko.observable(true);

            if (obj.ModificaProyecto == 1)
                ModificaProyecto = ko.observable(true);

            if (obj.EliminaProyecto == 1)
                EliminaProyecto = ko.observable(true);

            if (obj.VerProyecto == 1)
                VerProyecto = ko.observable(true);

            if (obj.CreaRendicion == 1)
                CreaRendicion = ko.observable(true);

            if (obj.ModificaRendicion == 1)
                ModificaRendicion = ko.observable(true);

            if (obj.EliminaRendicion == 1)
                EliminaRendicion = ko.observable(true);

            if (obj.VerRendicion == 1)
                VerRendicion = ko.observable(true);

            if (obj.CreaRol == 1)
                CreaRol = ko.observable(true);

            if (obj.ModificaRol == 1)
                ModificaRol = ko.observable(true);

            if (obj.EliminaRol == 1)
                EliminaRol = ko.observable(true);

            if (obj.VerRol == 1)
                VerRol = ko.observable(true);

            if (obj.CreaMuro == 1)
                CreaMuro = ko.observable(true);

            if (obj.ModificaMuro == 1)
                ModificaMuro = ko.observable(true);

            if (obj.EliminaMuro == 1)
                EliminaMuro = ko.observable(true);

            if (obj.VerMuro == 1)
                VerMuro = ko.observable(true);

            if (obj.PuedeVotarProyecto == 1)
                PuedeVotarProyecto = ko.observable(true);

            if (obj.PuedeVotarTricel == 1)
                PuedeVotarTricel = ko.observable(true);

            if (obj.VerMailing == 1)
                VerMailing = ko.observable(true);

            if (obj.CreaMailing == 1)
                CreaMailing = ko.observable(true);

            if (obj.VerReportes == 1)
                VerReportes = ko.observable(true);

            if (obj.VerReporteAsistencia == 1)
                VerReporteAsistencia = ko.observable(true);
        }
    }


}

function IrInicio()
{
    if (sessionStorage.getItem("ES_CPAS") == "true")
    {
        window.location.href = '#';
    }
    else
    {
        //window.location.href = 'index.html';
        window.location.href = '#';
    }
}

function ValidaExtension(archivo, extensiones)
{
    extensiones_permitidas = extensiones;

    if (!archivo) {
        getNotify('error', 'Seleccione', 'Debe seleccionar un archivo válido.');
        return false;
    }
    else
    {
        var tamano = archivo.size;
        //màximo 3,5 mb
        if (tamano < 3670016) {

            extension = (archivo.name.substring(archivo.name.lastIndexOf("."))).toLowerCase();
            permitida = false;
            for (var i = 0; i < extensiones_permitidas.length; i++) {
                if (extensiones_permitidas[i] == extension) {
                    permitida = true;
                    break;
                }
            }
            if (!permitida) {
                //mierror = "Comprueba la extensión de los archivos a subir. \nSólo se pueden subir archivos con extensiones: " + extensiones_permitidas.join();
                getNotify('error', 'Extensión', 'La extensiòn del archivo no está permitida ' + extensiones_permitidas.join());
                return false;
            }else{
                //submito!
                return true;
            }

        }
        else
        {
            getNotify('error', 'Tamaño', 'El tamaño del archivo no puede superar el màximo permitido.');
            return false;

        }

    }

}

function FormatMiles(input)
{
    var retorno;
    var num = input.toString().replace(/\./g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/,'');
        //input.value = num;
        retorno = num;
    }

    else{
        //alert('Solo se permiten numeros');
        //input.value = input.value.replace(/[^\d\.]*/g,'');
        retorno = input.toString().replace(/[^\d\.]*/g,'');
    }
    return retorno;
}

function FechaString(fechaC)
{
    var fecha = moment(fechaC);

    var annoTer = fecha.get('year');
    var mesTer = fecha.get('month') + 1;
    var diaTer = fecha.get('date');
    var horaTer = fecha.get('hour');
    var minutoTer = fecha.get('minute');

    if (diaTer < 10)
        diaTer = "0" + diaTer;

    if (mesTer < 10)
        mesTer = "0" + mesTer;

    if (horaTer < 10)
        horaTer = "0" + horaTer;

    if (minutoTer < 10)
        minutoTer = "0" + minutoTer;

    var terminoStr = diaTer + '-' + mesTer + '-' + annoTer + ' ' + horaTer + ':' + minutoTer;
    return terminoStr;

}
function FechaEntera(fechaC)
{
    var fecha = moment(fechaC);

    var annoTer = fecha.get('year');
    var mesTer = fecha.get('month') + 1;
    var diaTer = fecha.get('date');
    var horaTer = fecha.get('hour');
    var minutoTer = fecha.get('minute');

    if (diaTer < 10)
        diaTer = "0" + diaTer;

    if (mesTer < 10)
        mesTer = "0" + mesTer;

    if (horaTer < 10)
        horaTer = "0" + horaTer;

    if (minutoTer < 10)
        minutoTer = "0" + minutoTer;

    var terminoStr = annoTer.toString() + mesTer.toString() + diaTer.toString();
    return parseInt(terminoStr);
}
function FechaEnteraConHora(fechaC)
{
    var fecha = moment(fechaC);

    var annoTer = fecha.get('year');
    var mesTer = fecha.get('month');
    var diaTer = fecha.get('date');
    var horaTer = fecha.get('hour');
    var minutoTer = fecha.get('minute');

    if (diaTer < 10)
        diaTer = "0" + diaTer;

    if (mesTer < 10)
        mesTer = "0" + mesTer;

    if (horaTer < 10)
        horaTer = "0" + horaTer;

    if (minutoTer < 10)
        minutoTer = "0" + minutoTer;

    var terminoStr = annoTer.toString() + mesTer.toString() + diaTer.toString() + horaTer.toString() + minutoTer.toString();
    return parseInt(terminoStr);
}
function InvertirFechaStr(fechaStr){
    var arrFecha = fechaStr.split('-');
    if (arrFecha.length == 3){
        if (arrFecha[0].length == 4){
            return arrFecha[2] + '-' + arrFecha[1] + '-' + arrFecha[0];
        }
        else{
            return fechaStr;
        }
    }
    else{
        return fechaStr;
    }
}
function EntregaFechaDate(fechaStr){

    var arrFecha = fechaStr.split('-');
    if (arrFecha != null && arrFecha.length == 3){
        var intYear = parseInt(arrFecha[2]);
        var intMonth = parseInt(arrFecha[1]) - 1;
        var intDay = parseInt(arrFecha[0]);
        return new Date(intYear, intMonth, intDay);
    }
    else{
        //entrega fecha hora actual.
        return new Date();
    }

}

function FechaEnteraStr(fechaStr)
{
    var parteUno = fechaStr.split('-');
    var parteDos = parteUno[2].split(' ');

    return parseInt(parteDos[0] + parteUno[1] + parteUno[0]);

}
function FechaEnteraStrT(fechaStr)
{
    var parteUno = fechaStr.split('-');
    var parteDos = parteUno[2].split('T');

    return parseInt(parteDos[0] + parteUno[1] + parteUno[0]);

}
var victor;
function ini() {
    victor = setTimeout('location="index.html"',TiempoCierreSesion());
}
function parar() {
    clearTimeout(victor);
    victor = setTimeout('location=location.href',TiempoCierreSesion());
}
