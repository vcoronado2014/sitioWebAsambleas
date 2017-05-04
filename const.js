﻿function ObtenerUrl(api)
{
    //return 'http://api.asambleas.cl/api/' + api;
    return 'http://localhost:50929/api/' + api;
    //http://172.16.116.138/apiasambleas/api/
}
﻿function ObtenerUrlDos(api)
{
    //return 'http://vcoronado-001-site8.dtempurl.com/api/' + api;
    return 'http://localhost:58013/api/' + api;
    //http://172.16.116.138/apiasambleas/api/
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
        var rolId = sessionStorage.getItem("RolId");
        if (rolId != null)
        {
            shouldShowMessage = ko.observable(false);
            //ahora procesamos el menu
            menuMenu = ko.observable(false);
            //hijos
            menuMenuUsuarios = ko.observable(false);
            menuMenuInstituciones = ko.observable(false);
            menuMenuRendiciones = ko.observable(false);
            menuMenuDocumentos = ko.observable(false);
            menuMenuCalendarrio = ko.observable(false);
            //tricel
            menuTricel = ko.observable(false);
            //hijo
            menuTricelListar = ko.observable(false);
            //proyecto
            menuProyecto = ko.observable(false);
            //hijo
            menuProyectoListar = ko.observable(false);

            switch(rolId)
            {
                //super
                case '1':
                    shouldShowMessage = ko.observable(true);

                    menuMenu = ko.observable(true);
                    menuMenuUsuarios = ko.observable(true);
                    menuMenuInstituciones = ko.observable(true);
                    menuMenuRendiciones = ko.observable(true);
                    menuMenuDocumentos = ko.observable(true);
                    menuMenuCalendarrio = ko.observable(true);
                    menuTricel = ko.observable(true);
                    menuTricelListar = ko.observable(true);
                    menuProyecto = ko.observable(true);
                    menuProyectoListar = ko.observable(true);
                    break;
                //administrador centro educacional
                case '2':
                    shouldShowMessage = ko.observable(true);

                    menuMenu = ko.observable(true);
                    menuMenuUsuarios = ko.observable(true);
                    //menuMenuInstituciones = ko.observable(true);
                    menuMenuRendiciones = ko.observable(true);
                    menuMenuDocumentos = ko.observable(true);
                    menuMenuCalendarrio = ko.observable(true);
                    menuTricel = ko.observable(true);
                    menuTricelListar = ko.observable(true);
                    menuProyecto = ko.observable(true);
                    menuProyectoListar = ko.observable(true);
                    break;
                //presidente
                case '3':
                case '4':
                case '5':
                case '6':
                    menuMenu = ko.observable(true);
                    menuMenuUsuarios = ko.observable(true);
                    //menuMenuInstituciones = ko.observable(true);
                    menuMenuRendiciones = ko.observable(true);
                    menuMenuDocumentos = ko.observable(true);
                    menuMenuCalendarrio = ko.observable(true);
                    //menuTricel = ko.observable(true);
                    //menuTricelListar = ko.observable(true);
                    menuProyecto = ko.observable(true);
                    menuProyectoListar = ko.observable(true);
                    break;
                default:
                    menuMenu = ko.observable(true);
                    menuMenuRendiciones = ko.observable(true);
                    menuMenuDocumentos = ko.observable(true);
                    menuMenuCalendarrio = ko.observable(true);
                    break;
            }


        }
    }


}