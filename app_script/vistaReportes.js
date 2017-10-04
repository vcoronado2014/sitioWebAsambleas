/**
 * Created by VICTOR CORONADO on 14/06/2017.
 */
//$(document).ready(function () {

    var nombreReporte = getParameterByName('NOMBRE_REPORTE');
    var instId = getParameterByName('INST_ID');
    var usuId = getParameterByName('USU_ID');
    var nombreUsuario = getParameterByName('NOMBRE_USUARIO');
    var rolId = getParameterByName('ROL_ID');
    var modo = getParameterByName('MODO');

    var dataUsuarios = [];
    var dataInstituciones = [];
    var dataRendiciones = [];
    var dataVotaciones = [];

    var sort_by = function(field, reverse, primer){

        var key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    };

    switch (nombreReporte)
    {
        case 'usuarios':
            CrearReporteUsuarios(instId, usuId, nombreUsuario, rolId, modo);
            break;
        case 'instituciones':
            CrearReporteInstituciones(instId, usuId, nombreUsuario, rolId, modo);
            break;
        case 'rendiciones':
            CrearReporteRendiciones(instId, usuId, nombreUsuario, rolId, modo);
            break;
        case 'votaciones':
            CrearReporteVotaciones(instId, usuId, nombreUsuario, rolId, modo);
            break;
        case 'asistencia':
            CrearReporteAsistencia(instId, usuId, nombreUsuario, rolId, modo);
            break;
        default:
            break;
    }

    function CrearReporteUsuarios(instId, usuId, nombreUsuario, rolId, modo)
    {
        var obtenerUsuarios = jQuery.ajax({
            url : ObtenerUrl('ListarUsuarios') + '?instId=' + instId + '&rolId=' + rolId,
            type: 'GET',
            dataType : "json"
            //,
            //contentType: "application/json",
            //data: ko.toJSON({ InstId: instId })
        });

        $.when(obtenerUsuarios).then(
            function(data){
                dataUsuarios = [];
                var contador = 0;

                //aca construir el Reporte

                var results = [],
                    length = Math.ceil(data.proposals.length / 22);

                for (var i = 0; i < length; i++) {
                    results.push(data.proposals.slice(i * 22, (i + 1) * 22));
                }

                var cantidadPaginas = results.length - 1;
                var paginas = 0;

                var doc = new jsPDF();

                for(var t in results)
                {
                    //la data solo se puede construir hasta 22 registros, luego se inserta nueva hoja
                    ConstruirEncabezado('Reporte de Usuarios', 'Este reporte le muestra los usuarios creados en el Sistema.', doc);
                    ConstruirPdfUsuarios(doc, results[t]);
                    ConstruirPie(nombreUsuario, paginas + 1, cantidadPaginas + 1, doc);
                    //agrega pagina mientras el largo del arreglo -1 sea igual a la cantidad de paginas
                    if (paginas < cantidadPaginas)
                        doc.addPage();
                    paginas++;
                }

                //mostrar
                if (modo == 'mostrar')
                    $("#mostrarPdf").attr("src", doc.output('datauristring'));
                else
                    doc.save('usuarios.pdf');

            },
            function (){
                //alguna ha fallado
                alert('error');
            },
            function(){
                //acá podemos quitar el elemento cargando
                alert('quitar cargando');
            }
        );


    }

    function CrearReporteAsistencia(instId, usuId, nombreUsuario, rolId, modo)
    {
        var obtenerUsuarios = jQuery.ajax({
            url : ObtenerUrl('ListarUsuarios') + '?instId=' + instId + '&rolId=' + rolId,
            type: 'GET',
            dataType : "json"
            //,
            //contentType: "application/json",
            //data: ko.toJSON({ InstId: instId })
        });

        $.when(obtenerUsuarios).then(
            function(data){
                dataUsuarios = [];
                var contador = 0;

                //aca construir el Reporte

                var results = [],
                    length = Math.ceil(data.proposals.length / 22);

                for (var i = 0; i < length; i++) {
                    results.push(data.proposals.slice(i * 22, (i + 1) * 22));
                }

                var cantidadPaginas = results.length - 1;
                var paginas = 0;

                var doc = new jsPDF();

                for(var t in results)
                {
                    var nombreInstitucion = sessionStorage.getItem("NombreInstitucion").toUpperCase();
                    var dirInstitucion = sessionStorage.getItem("DireccionInstitucion");
                    //la data solo se puede construir hasta 22 registros, luego se inserta nueva hoja
                    var fr = moment().locale('es');
                    //ConstruirEncabezado('LISTADO DE ASISTENCIA A LA ASAMBLEA DE ELECCIÓN', 'DE DIRECTORIO DE LA ORGANIZACIÓN ' + nombreInstitucion + ' ' + fr.format('LL'), doc);
                    ConstruirEncabezadoAsistencia('LISTADO DE ASISTENCIA A LA ASAMBLEA',nombreInstitucion, dirInstitucion, doc);
                    ConstruirPdfAsistencia(doc, results[t]);
                    ConstruirPieAsistencia(paginas + 1, cantidadPaginas + 1, doc);
                    //agrega pagina mientras el largo del arreglo -1 sea igual a la cantidad de paginas
                    if (paginas < cantidadPaginas) {
                        doc.addPage();
                        doc.setFontSize("16");
                    }
                    paginas++;
                }

                //mostrar
                if (modo == 'mostrar')
                    $("#mostrarPdf").attr("src", doc.output('datauristring'));
                else
                    doc.save('usuarios.pdf');

            },
            function (){
                //alguna ha fallado
                alert('error');
            },
            function(){
                //acá podemos quitar el elemento cargando
                alert('quitar cargando');
            }
        );


    }

    function CrearReporteInstituciones(instId, usuId, nombreUsuario, rolId, modo)
    {
        var obtenerInstituciones = jQuery.ajax({
            url : ObtenerUrl('Institucion'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: ko.toJSON({ IdUsuario: usuId })
        });

        $.when(obtenerInstituciones).then(
            function(data){
                dataInstituciones = [];
                var contador = 0;
                /*
                 //pruebas para aumentar el tamaño del arreglo
                 for (var s=0; s<10; s++) {


                 for (var i in data) {

                 dataUsuarios[contador] = data[i];
                 contador++;

                 }
                 }
                 */
                //aca construir el Reporte

                var results = [],
                    length = Math.ceil(data.proposals.length / 22);

                for (var i = 0; i < length; i++) {
                    results.push(data.proposals.slice(i * 22, (i + 1) * 22));
                }

                var cantidadPaginas = results.length - 1;
                var paginas = 0;

                var doc = new jsPDF();

                for(var t in results)
                {
                    //la data solo se puede construir hasta 22 registros, luego se inserta nueva hoja
                    ConstruirEncabezado('Reporte de Instituciones', 'Este reporte le muestra las Instituciones creadas en el Sistema.', doc);
                    ConstruirPdfInstituciones(doc, results[t]);
                    ConstruirPie(nombreUsuario, paginas + 1, cantidadPaginas + 1, doc);
                    //agrega pagina mientras el largo del arreglo -1 sea igual a la cantidad de paginas
                    if (paginas < cantidadPaginas)
                        doc.addPage();
                    paginas++;
                }

                //mostrar
                if (modo == 'mostrar')
                    $("#mostrarPdf").attr("src", doc.output('datauristring'));
                else
                    doc.save('instituciones.pdf');

            },
            function (){
                //alguna ha fallado
                alert('error');
            },
            function(){
                //acá podemos quitar el elemento cargando
                alert('quitar cargando');
            }
        );


    }

    function CrearReporteRendiciones(instId, usuId, nombreUsuario, rolId, modo)
    {
        var obtenerRendiciones = jQuery.ajax({
            url : ObtenerUrl('Rendicion'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: ko.toJSON({ InstId: instId })
        });

        $.when(obtenerRendiciones).then(
            function(data){
                dataRendiciones = [];
                var contador = 0;

                //aca construir el Reporte

                var results = [],
                    length = Math.ceil(data.proposals.length / 22);

                for (var i = 0; i < length; i++) {
                    results.push(data.proposals.slice(i * 22, (i + 1) * 22));
                }

                var cantidadPaginas = results.length - 1;
                var paginas = 0;

                var doc = new jsPDF();

                for(var t in results)
                {
                    //la data solo se puede construir hasta 22 registros, luego se inserta nueva hoja
                    ConstruirEncabezado('Reporte de Rendiciones', 'Este reporte le muestra los Ingresos y Egresosde dineros de su Institución.', doc);
                    ConstruirPdfRendiciones(doc, results[t]);
                    ConstruirPie(nombreUsuario, paginas + 1, cantidadPaginas + 1, doc);
                    //agrega pagina mientras el largo del arreglo -1 sea igual a la cantidad de paginas
                    if (paginas < cantidadPaginas)
                        doc.addPage();
                    paginas++;
                }

                //mostrar
                if (modo == 'mostrar')
                    $("#mostrarPdf").attr("src", doc.output('datauristring'));
                else
                    doc.save('rendiciones.pdf');

            },
            function (){
                //alguna ha fallado
                alert('error');
            },
            function(){
                //acá podemos quitar el elemento cargando
                alert('quitar cargando');
            }
        );


    }

    function CrearReporteVotaciones(instId, usuId, nombreUsuario, rolId, modo)
    {
        var obtenerRendiciones = jQuery.ajax({
            url : ObtenerUrlDos('Reporte'),
            type: 'POST',
            dataType : "json",
            contentType: "application/json",
            data: ko.toJSON({ InstId: instId, RolId: rolId })
        });

        $.when(obtenerRendiciones).then(
            function(data){
                dataVotaciones = [];
                var contador = 0;

                //aca construir el Reporte

                var results = [],
                    length = Math.ceil(data.length / 22);

                for (var i = 0; i < length; i++) {
                    results.push(data.slice(i * 22, (i + 1) * 22));
                }

                var cantidadPaginas = results.length - 1;
                var paginas = 0;

                var doc = new jsPDF();

                for(var t in results)
                {
                    //la data solo se puede construir hasta 22 registros, luego se inserta nueva hoja
                    ConstruirEncabezado('Reporte de Votaciones', 'Este reporte le muestra las votaciones de Proyectos y Listas Tricel de su Institución.', doc);
                    ConstruirPdfVotaciones(doc, results[t]);
                    ConstruirPie(nombreUsuario, paginas + 1, cantidadPaginas + 1, doc);
                    //agrega pagina mientras el largo del arreglo -1 sea igual a la cantidad de paginas
                    if (paginas < cantidadPaginas)
                        doc.addPage();
                    paginas++;
                }

                //mostrar
                if (modo == 'mostrar')
                    $("#mostrarPdf").attr("src", doc.output('datauristring'));
                else
                    doc.save('votaciones.pdf');

            },
            function (){
                //alguna ha fallado
                alert('error');
            },
            function(){
                //acá podemos quitar el elemento cargando
                alert('quitar cargando');
            }
        );


    }

    function ConstruirEncabezado(titulo, subtitulo, doc)
    {
        //set color gray
        doc.setTextColor(0);
        doc.setFont("helvetica");
        doc.setFontType("bold");
        doc.text(20, 20, titulo);

        doc.setFont("helvetica");
        doc.setFontType("italic");
        doc.setFontSize("12");
        doc.text(20, 30, subtitulo);

        //linea
        doc.setLineWidth(0.5);
        doc.line(10, 35, 200, 35);

    }
    function ConstruirEncabezadoAsistencia(titulo, institucion, direccion, doc)
    {
        //set color gray
        doc.setTextColor(0);
        doc.setFontSize("10");
        doc.setFont("helvetica");
        doc.setFontType("italic");
        doc.text(10, 10, institucion);
        doc.text(10, 15, direccion);

        doc.setFontSize("14");
        doc.setFont("helvetica");
        doc.setFontType("bold");
        doc.text(50, 30, titulo);

        //linea
        doc.setLineWidth(0.5);
        doc.line(10, 35, 200, 35);

    }
    function ConstruirPie(usuario, paginaActual, paginasTotal, doc)
    {
        doc.setLineWidth(0.3);
        doc.line(10, 270, 200, 270);

        //set color gray
        doc.setTextColor(100);

        doc.setFont("helvetica");
        doc.setFontType("italic");
        doc.setFontSize("8");
        doc.text(20, 280, usuario);

        doc.text(105, 280, 'Pág. ' + paginaActual + ' de ' + paginasTotal, null, null, 'center');
        var fecha = FechaString(new Date());
        doc.text(200, 280, fecha, null, null, 'right');


    }

    function ConstruirPieAsistencia(paginaActual, paginasTotal, doc)
    {
        doc.setLineWidth(0.3);
        doc.line(10, 270, 200, 270);

        //set color gray
        doc.setTextColor(100);

        doc.setFont("helvetica");
        doc.setFontType("italic");
        doc.setFontSize("8");
        doc.text(20, 280, 'Pág. ' + paginaActual + ' de ' + paginasTotal);

        //doc.text(105, 280, 'Pág. ' + paginaActual + ' de ' + paginasTotal, null, null, 'center');
        var fecha = FechaString(new Date());
        doc.text(200, 280, fecha, null, null, 'right');


    }


function ConstruirPdfAsistencia(doc, arreglo) {
    //set color gray
    doc.setTextColor(0);
    doc.setFontType("normal");
    doc.setFontSize("9");
    doc.text(10, 40, "Nombre");

    doc.text(70, 40, "Rut");

    doc.text(100, 40, "Domicilio");

    doc.text(170, 40, "Firma");

    //linea
    doc.setLineWidth(0.5);
    doc.line(10, 45, 200, 45);

    /*
     var itemsProcesar = dataR;
     */


    var lineaInicio = 50;

    if (arreglo != null) {
        arreglo.sort(sort_by('OtroUno', false, function(a){return a.toUpperCase()}));

        for (var i in arreglo) {

            doc.text(10, lineaInicio, arreglo[i].NombreCompleto);

            doc.text(70, lineaInicio, arreglo[i].OtroCuatro);

            doc.text(100, lineaInicio, arreglo[i].OtroCinco);

            doc.text(170, lineaInicio, "______________");

            lineaInicio = lineaInicio + 10;

        }
    }


    //el tope son 280 para el salto de pagina

}
    function ConstruirPdfUsuarios(doc, arreglo) {
        //set color gray
        doc.setTextColor(0);
        doc.setFontType("normal");
        doc.setFontSize("9");
        doc.text(10, 40, "Institución");

        doc.text(50, 40, "Nombre");

        doc.text(120, 40, "Usuario");

        doc.text(150, 40, "Rol");

        //linea
        doc.setLineWidth(0.5);
        doc.line(10, 45, 200, 45);

        /*
         var itemsProcesar = dataR;
         */


        var lineaInicio = 50;

        if (arreglo != null) {
            arreglo.sort(sort_by('OtroUno', false, function(a){return a.toUpperCase()}));

            for (var i in arreglo) {

                doc.text(10, lineaInicio, arreglo[i].OtroUno);

                doc.text(50, lineaInicio, arreglo[i].NombreCompleto);

                doc.text(120, lineaInicio, arreglo[i].NombreUsuario);

                doc.text(150, lineaInicio, arreglo[i].Rol);

                lineaInicio = lineaInicio + 10;

            }
        }


        //el tope son 280 para el salto de pagina

    }
    function ConstruirPdfInstituciones(doc, arreglo) {
        //aca voy
        //set color gray
        doc.setTextColor(0);
        doc.setFontType("normal");
        doc.setFontSize("9");
        doc.text(10, 40, "Nombre");

        doc.text(80, 40, "Teléfono");

        doc.text(110, 40, "Correo");


        //linea
        doc.setLineWidth(0.5);
        doc.line(10, 45, 200, 45);

        /*
         var itemsProcesar = dataR;
         */


        var lineaInicio = 50;

        if (arreglo != null) {


            arreglo.sort(sort_by('NombreCompleto', false, function(a){return a.toUpperCase()}));

            for (var i in arreglo) {

                doc.text(10, lineaInicio, arreglo[i].NombreCompleto);

                doc.text(80, lineaInicio, arreglo[i].OtroUno);

                doc.text(110, lineaInicio, arreglo[i].OtroDos);

                lineaInicio = lineaInicio + 10;

            }
        }


        //el tope son 280 para el salto de pagina

    }
    function ConstruirPdfRendiciones(doc, arreglo) {
        //aca voy
        //set color gray
        doc.setTextColor(0);
        doc.setFontType("normal");
        doc.setFontSize("9");
        doc.text(10, 40, "Fecha");

        doc.text(30, 40, "Detalle");

        doc.text(120, 40, "Nro. Doc");

        doc.text(140, 40, "Tipo");

        doc.text(170, 40, "Monto");


        //linea
        doc.setLineWidth(0.5);
        doc.line(10, 45, 200, 45);

        /*
         var itemsProcesar = dataR;
         */


        var lineaInicio = 50;

        if (arreglo != null) {


            arreglo.sort(sort_by('OtroUno', false, function(a){return a.toUpperCase()}));

            for (var i in arreglo) {

                doc.text(10, lineaInicio, arreglo[i].NombreUsuario);

                doc.text(30, lineaInicio, arreglo[i].NombreCompleto);

                doc.text(120, lineaInicio, arreglo[i].OtroDos);

                doc.text(140, lineaInicio, arreglo[i].OtroUno);

                doc.text(180, lineaInicio, arreglo[i].OtroCuatro, null, null, 'right');


                lineaInicio = lineaInicio + 10;

            }
        }


        //el tope son 280 para el salto de pagina

    }

    function ConstruirPdfVotaciones(doc, arreglo) {
        //aca voy
        //set color gray
        doc.setTextColor(0);
        doc.setFontType("normal");
        doc.setFontSize("9");
        doc.text(10, 40, "Institución");

        doc.text(50, 40, "Fechas");

        doc.text(90, 40, "Nombre");

        doc.text(130, 40, "Lista");

        doc.text(170, 40, "Si");

        doc.text(180, 40, "No");

        doc.text(190, 40, "Tipo");


        //linea
        doc.setLineWidth(0.5);
        doc.line(10, 45, 200, 45);

        /*
         var itemsProcesar = dataR;
         */


        var lineaInicio = 50;

        if (arreglo != null) {


            //arreglo.sort(sort_by('OtroUno', false, function(a){return a.toUpperCase()}));

            for (var i in arreglo) {

                doc.text(10, lineaInicio, arreglo[i].Institucion);

                doc.text(50, lineaInicio, arreglo[i].Fechas);

                doc.text(90, lineaInicio, arreglo[i].Nombre);

                doc.text(130, lineaInicio, arreglo[i].Lista);

                doc.text(170, lineaInicio, arreglo[i].VotosSi.toString());
                if (arreglo[i].Tipo == 'Lista')
                    doc.text(180, lineaInicio, '');
                else
                    doc.text(180, lineaInicio, arreglo[i].VotosNo.toString());

                doc.text(190, lineaInicio, arreglo[i].Tipo);


                lineaInicio = lineaInicio + 10;

            }
        }


        //el tope son 280 para el salto de pagina

    }

//});