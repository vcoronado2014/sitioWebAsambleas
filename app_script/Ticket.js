/**
 * Created by VICTOR CORONADO on 21/10/2017.
 */
/**
 * Created by VICTOR CORONADO on 13/10/2017.
 */
$(document).ready(function () {
    var doc = new jsPDF();
    var nombreUsuario = getParameterByName('NOMBRE_USUARIO');
    var nombre = getParameterByName('NOMBRE_PROYECTO');
    var beneficios = getParameterByName('BENEFICIOS_PROYECTO');
    var descripcion = getParameterByName('DESCRIPCION_PROYECTO');
    var objetivo = getParameterByName('OBJETIVO_PROYECTO');
    var monto = getParameterByName('MONTO_PROYECTO');
    var texto = getParameterByName('TEXTO_PROYECTO');
    var tipo = getParameterByName('TIPO');
    var nombreInstitucion = sessionStorage.getItem("NombreInstitucion").toUpperCase();
    if (tipo == 'Proyecto')
        ConstruirReporte(nombreUsuario, nombre, beneficios, descripcion, objetivo, monto, texto, nombreInstitucion, tipo, doc);
    else
        ConstruirReporteTricel(nombreUsuario, nombre, objetivo, texto, nombreInstitucion, tipo, doc);

    function ConstruirReporteTricel(nombreUsuario, nombre, objetivo, texto, nombreInstitucion, tipo, doc) {
        ConstruirEncabezado(nombreInstitucion, tipo, doc);
        //construimos
        doc.setTextColor(0);
        doc.setFontType("normal");
        doc.setFontSize("9");
        doc.text(10, 30, "Nombre Tricel:");
        doc.text(50, 30, nombre);

        doc.text(10, 40, "Objetivo:");
        doc.text(50, 40, objetivo);

        doc.setFontSize("10");
        doc.setFontType('bold');
        doc.text(10, 80, texto);

        doc.setLineWidth(0.5);
        doc.line(10, 90, 200, 90);

        ConstruirPie(nombreUsuario, doc);

        $("#mostrarPdf").attr("src", doc.output('datauristring'));

    }
    function ConstruirReporte(nombreUsuario, nombre, beneficios, descripcion, objetivo, monto, texto, nombreInstitucion, tipo, doc) {
        ConstruirEncabezado(nombreInstitucion, tipo, doc);
        //construimos
        doc.setTextColor(0);
        doc.setFontType("normal");
        doc.setFontSize("9");
        doc.text(10, 30, "Nombre Proyecto:");
        doc.text(50, 30, nombre);

        doc.text(10, 40, "Objetivo:");
        doc.text(50, 40, objetivo);

        doc.text(10, 50, "Beneficios:");
        doc.text(50, 50, beneficios);

        doc.text(10, 60, "Descripción:");
        doc.text(50, 60, descripcion);

        doc.text(10, 70, "Monto:");
        doc.text(50, 70, monto);

        doc.setFontSize("10");
        doc.setFontType('bold');
        doc.text(10, 80, texto);

        doc.setLineWidth(0.5);
        doc.line(10, 90, 200, 90);

        ConstruirPie(nombreUsuario, doc);

        $("#mostrarPdf").attr("src", doc.output('datauristring'));

    }
    function ConstruirPie(usuario,doc)
    {
        //set color gray
        doc.setTextColor(100);

        doc.setFont("helvetica");
        doc.setFontType("italic");
        doc.setFontSize("8");
        doc.text(10, 95, '');

        var fecha = FechaString(new Date());
        doc.text(200, 95, fecha, null, null, 'right');


    }


    function ConstruirEncabezado(institucion, tipo,  doc) {
        //set color gray
        doc.setTextColor(0);

        doc.setFont("helvetica");
        doc.setFontType("italic");
        doc.setFontSize("12");
        doc.text(10, 10, institucion);

        doc.setFontSize("14");
        if (tipo == 'Proyecto')
            doc.text(10, 20, 'Cupón de Votación de Proyecto');
        else
            doc.text(10, 20, 'Cupón de Votación de Tricel');
        //linea
        doc.setLineWidth(0.5);
        doc.line(10, 25, 200, 25);

    }
});

