$(document).ready(function () {

    //un poco de nockout
    var PersonaViewModel = {
        usuario: ko.observable(),
        password: ko.observable(),

        autentificar: function () {


            $('#mensaje').text('');
            $.ajax({
                url: ObtenerUrl('Login'),
                //url: "http://localhost:48909/api/login",
                type: "POST",
                data: ko.toJSON({ usuario: this.usuario, password: this.password }),
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    //guardamos en session storage
                    sessionStorage.setItem("NombreUsuario", result.AutentificacionUsuario.NombreUsuario);
                    sessionStorage.setItem("CorreoElectronico", result.AutentificacionUsuario.CorreoElectronico);
                    sessionStorage.setItem("RolId", result.AutentificacionUsuario.RolId);
                    sessionStorage.setItem("Id", result.AutentificacionUsuario.Id);
                    sessionStorage.setItem("InstId", result.AutentificacionUsuario.InstId);
                    sessionStorage.setItem("NombreRol", result.Rol.Nombre);
                    sessionStorage.setItem("NombreCompleto", result.Persona.Nombres + ' ' + result.Persona.ApellidoPaterno + ' ' + result.Persona.ApellidoMaterno);
                    sessionStorage.setItem("NombreInstitucion", result.Institucion.Nombre);

                    //ahora redireccionamos
                    var url = 'inicio.html';
                    window.location.href = url;

                },
                error: function (error) {
                    if (error.status.toString() == "500") {
                        $('#mensaje').text("Nombre de usuario o contraseña inválida!");
                    }
                    else {
                        $('#mensaje').text(error.statusText);
                        //alert("fail");
                    }

                }
            });
        }

    };

    ko.applyBindings(PersonaViewModel);

});

