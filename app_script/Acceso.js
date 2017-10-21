/**
 * Created by vcoronado on 03-04-2017.
 */
$(document).ready(function () {

    //versionCorta = ko.observable(RetornaVersionUltraCorta());
    //un poco de nockout
    var PersonaViewModel = {
        usuario: ko.observable(),
        password: ko.observable(),
        rutRecuperar: ko.observable(),


        autentificar: function () {


            $( "#progressbar" ).progressbar({
                value: false
            });

            $('#mensaje').text('');

            var obtenerLogin = jQuery.ajax({
                url : ObtenerUrl('Login'),
                type: 'POST',
                dataType : "json",
                contentType: "application/json",
                data: ko.toJSON({ usuario: this.usuario, password: this.password })
            });

            $.when(obtenerLogin).then(
                function(result){

                    sessionStorage.setItem("NombreUsuario", result.AutentificacionUsuario.NombreUsuario);
                    sessionStorage.setItem("CorreoElectronico", result.AutentificacionUsuario.CorreoElectronico);
                    sessionStorage.setItem("RolId", result.AutentificacionUsuario.RolId);
                    sessionStorage.setItem("Id", result.AutentificacionUsuario.Id);
                    sessionStorage.setItem("InstId", result.AutentificacionUsuario.InstId);
                    sessionStorage.setItem("NombreRol", result.Rol.Nombre);
                    sessionStorage.setItem("NombreCompleto", result.Persona.Nombres + ' ' + result.Persona.ApellidoPaterno + ' ' + result.Persona.ApellidoMaterno);
                    sessionStorage.setItem("NombreInstitucion", result.Institucion.Nombre);
                    //roles permisos
                    sessionStorage.setItem("RolesPermisos", JSON.stringify(result.PermisoRol));
                    sessionStorage.setItem("DireccionInstitucion", result.Institucion.Direccion);
                    sessionStorage.setItem("ComunaUsuario", result.Comuna.Nombre);
                    sessionStorage.setItem("ComunaInstitucion", result.ComunaInstitucion.Nombre);
                    sessionStorage.setItem("TelefonoInstitucion", result.Institucion.Telefono);
                    sessionStorage.setItem("CorreoInstitucion", result.Institucion.CorreoElectronico);
                    //ahora redireccionamos
                    var url = 'inicio.html';
                    window.location.href = url;



                },
                function (error){

                    if (error.status.toString() == "500") {
                        $('#mensaje').text("Nombre de usuario o contraseña inválida!");
                    }
                    else {
                        $('#mensaje').text(error.statusText);
                    }

                },
                function(){
                    //acá podemos quitar el elemento cargando
                    //alert('quitar cargando');
                }
            )
        },

        recuperarClave: function(){
            $("#progressbarRecuperar").progressbar({
                value: false
            });

            $('#mensajeRecuperar').text('');

            var obtenerLoginRecuperar = jQuery.ajax({
                url : ObtenerUrl('RecuperarClave'),
                type: 'POST',
                dataType : "json",
                contentType: "application/json",
                data: ko.toJSON({ NombreUsuario: this.rutRecuperar, EsCpas: sessionStorage.getItem("ES_CPAS") })
            });

            $.when(obtenerLoginRecuperar).then(
                function(result){
                    if (result.Id == 0)
                        $('#mensajeRecuperar').text("NO EXISTE EL USUARIO, CONTACTE AL ADMINISTRADOR.");
                    else
                        $('#mensajeRecuperar').text("Su Clave ha sido enviada al correo: " + result.CorreoElectronico);

                    $('#rutRecuperar').val('');
                    $('#progressbarRecuperar').hide();



                },
                function (error){

                    if (error.status.toString() == "500") {
                        $('#mensajeRecuperar').text("ERROR DE COMUNICACION.");
                    }
                    else {
                        $('#mensajeRecuperar').text(error.statusText);
                    }

                },
                function(){
                    //acá podemos quitar el elemento cargando
                    //alert('quitar cargando');
                }
            )

        }

    };

    ko.applyBindings(PersonaViewModel);

});