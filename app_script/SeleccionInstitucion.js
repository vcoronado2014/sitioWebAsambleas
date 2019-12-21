/**
 * Created by vcoronado on 06-09-2017.
 */
$(function () {
    exp: var elem = document.getElementById('principal');
    exp: var instituciones = [];
    exp: var result;

    if (sessionStorage.getItem('INSTITUCIONES')){
        result = JSON.parse(sessionStorage.getItem('INSTITUCIONES'));
        instituciones = result.Instituciones;
        construyeLista(instituciones);
        console.log(instituciones);
    }

    function construyeLista(instituciones){
        var elem1 = document.getElementById('lista');
        elem1.innerHTML = '';

        if (instituciones && instituciones.length > 1){
            instituciones.forEach(institucion => {
                var divA = '<div class="col-xs-12 col-sm-6 panel" style="cursor: pointer;" onclick="seleccionar(' + institucion.Id +')">' +
                            '<div class="text-center">'+
                            '<span class="glyphicon glyphicon-home" aria-hidden="true" style="font-size: 4em;"></span>'+
                            '</div>' + 
                            '<h2 class="text-center">' + institucion.Nombre + '</h2>' + 
                            '<h5 class="text-center"><span class="glyphicon glyphicon-earphone" aria-hidden="true"></span> ' + institucion.Telefono + '</h5>' +
                            '<h5 class="text-center"><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> ' + institucion.CorreoElectronico + '</h5>' +
                            '</div>';

                            var ul = document.createElement('div');
                            elem1.appendChild(ul);
                            ul.innerHTML += divA;
            });

        }
        else {
            sessionStorage.clear();
            window.location.href = "index.html";
        }
    }

    seleccionar = function(item){
        console.log(item);
        var rolId = 0;
        var rolNombre = '';
        var ausId = 0;
        if (result.RlAusInst && result.RlAusInst.length > 0){
            result.RlAusInst.forEach(rl => {
                if (rl.InstId == item){
                    rolId = rl.RolId;
                    ausId = rl.AusId;
                }
            });
        }
        if (instituciones && instituciones.length > 0){
            instituciones.forEach(institucion => {
                if (institucion.Id == item){
                    //abrir y setear variables
                    sessionStorage.setItem("NombreUsuario", result.AutentificacionUsuario.NombreUsuario);
                    sessionStorage.setItem("CorreoElectronico", result.AutentificacionUsuario.CorreoElectronico);
                    sessionStorage.setItem("Id", ausId);
                    sessionStorage.setItem("InstId", institucion.Id);
                    sessionStorage.setItem("NombreCompleto", result.Persona.Nombres + ' ' + result.Persona.ApellidoPaterno + ' ' + result.Persona.ApellidoMaterno);
                    sessionStorage.setItem("NombreInstitucion", institucion.Nombre);
                    sessionStorage.setItem("DireccionInstitucion", institucion.Direccion);
                    sessionStorage.setItem("ComunaUsuario", result.Comuna.Nombre);
                    sessionStorage.setItem("ComunaInstitucion", result.ComunaInstitucion.Nombre);
                    sessionStorage.setItem("TelefonoInstitucion", institucion.Telefono);
                    sessionStorage.setItem("CorreoInstitucion", institucion.CorreoElectronico);
                    sessionStorage.setItem("ES_CPAS", false);
                    //rol hay que traerlo
                    $.ajax({
                        url: ObtenerUrl('RolInstitucion'),
                        type: "POST",
                        data: ko.toJSON({ InstId: institucion.Id }),
                        contentType: "application/json",
                        dataType: "json",
                        success: function (data) {
                            // procesar data
                            if (data && data.length > 0){
                                data.forEach(rol => {
                                    if (rol.Id == rolId){
                                        rolNombre = rol.Nombre;
                                    }
                                });
                            }

                            $.ajax({
                                url: ObtenerUrl('PermisoRol') + '?instId=' + institucion.Id + '&rolId=' + rolId,
                                type: "GET",
                                contentType: "application/json",
                                dataType: "json",
                                success: function (dataP) {
                                    // procesar data
                                    //ahora procesamos todo
                                    sessionStorage.setItem("RolId", rolId);
                                    sessionStorage.setItem("NombreRol", rolNombre);
                                    sessionStorage.setItem("RolesPermisos", JSON.stringify(dataP[0]));

                                    var url = 'inicio.html';
                                    window.location.href = url;


                                },
                                error: function (error) {
                                    if (error.status.toString() == "500") {
                                        getNotify('error', 'Error', 'Error de Servidor!');
                                    }
                                    else {
                                        getNotify('error', 'Error', 'Error de Servidor!');
                                    }
                                }
                            });

    
                        },
                        error: function (error) {
                            if (error.status.toString() == "500") {
                                getNotify('error', 'Error', 'Error de Servidor!');
                            }
                            else {
                                getNotify('error', 'Error', 'Error de Servidor!');
                            }
                        }
                    });


/*                     var url = 'inicio.html';
                    window.location.href = url; */

                }
            });
        }
    }


});
