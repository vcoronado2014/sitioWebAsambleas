$(document).ready(function () {
    exp: var elem = document.getElementById('principal');
    exp: var invitacionesArr = [];
    //exp: var existe = true;
    //objeto a guardar
    function PersonViewModel(data){
        var self = this;
        //del formulario

        self.frmCorreoElectronico = ko.observable('');
        self.estaAceptada = ko.observable(true);
        self.tieneLicencias = ko.observable(false);
        self.mostrarBoton = ko.observable(false);

        self.invitaciones = ko.observableArray(data);

        //evaluamos la data
        if (data && data.length > 0){
            var contadorAceptadas = 0;
            var contadorLicencias = 0;

            data.forEach(invitacion => {
                if (invitacion.Invitados.Aceptada == 0){
                    invitacion.Invitados.FechaMostrar = moment(invitacion.Invitados.FechaCreacion).format("DD-MM-YYYY");
                    invitacion.EstaAceptada = false;
                    contadorAceptadas++;
                  }
                  else {
                    invitacion.EstaAceptada = true;
                    invitacion.Invitados.FechaMostrar = moment(invitacion.Invitados.FechaAceptada).format("DD-MM-YYYY");
                  }
                  if (invitacion.LicenciasLibres <= 0){
                    invitacion.TieneLicencias = false;
                  }
                  else {
                    invitacion.TieneLicencias = true;
                    contadorLicencias++;
                  }
            });
            if (contadorAceptadas > 0){
                self.estaAceptada = ko.observable(false);
              }
              if (contadorLicencias > 0){
                self.tieneLicencias = ko.observable(true);
              }
              //limpiamos
              $('#lista').empty();
              $('#botonSiguiente').empty();
              construyeLista(data);
              //ahora evaluamos si mostrar el boton o no
              if (self.estaAceptada() == false && self.tieneLicencias()){
                  self.mostrarBoton = ko.observable(true);
                  $('#botonSiguiente').append(
                    '<button type="button" class="btn btn-primary btn-lg  col-xs-12 col-md-6 pull-right" data-bind="click: siguiente">' +
                    'Siguiente' +
                    '</button>'
                  );
              }
              console.log(self.mostrarBoton());
              self.invitaciones = ko.observableArray(data);
              console.log(data);
             
        }
        else{
            $('#lista').empty();
            $('#botonSiguiente').empty();
            $('#lista').append(
                '<h5>No hay invitaciones para el correo ingresado</h5>'
            );
        }


        buscar = function(item){
            var correo = $('#txtCorreo').val();
            if (validarEmail(correo)){
                $.ajax({
                    url: ObtenerUrl('Invitados'),
                    type: "POST",
                    data: ko.toJSON({ Correo: correo }),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {
                        // ok
                        self.invitaciones = data;
                        ko.cleanNode(elem);
                        ko.applyBindings(new PersonViewModel(data), elem);

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
            }
            //console.log(correo);
        }

        siguiente = function(item){
            //console.log(invitacionesArr);
            var objeto = JSON.stringify(invitacionesArr);
            sessionStorage.setItem("INVITADOS", objeto);
            window.location = "CreaRegistro.html"; 

        }
        volver = function(){
            sessionStorage.clear();
            window.location.href = "index.html";

        }
    }

    ko.applyBindings(new PersonViewModel([]), elem);

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
    function construyeLista(lista){
     if (lista && lista.length > 0){
         invitacionesArr = lista;
         lista.forEach(invi => {
            var divUno = '<div class="list-group">';
            var grupo = '<a href="#" class="list-group-item">';
            var tituloUno = '<h5 class="list-group-item-heading">'+ invi.Invitados.Correo + '</h5>';
            var fechaUno = '<p class="list-group-item-text">' + invi.Invitados.FechaMostrar +  '</p>';
            var texto = '';
            if (invi.EstaAceptada == false && invi.TieneLicencias == true){
                texto = 'Haz sido invitado por la Institución ' + invi.Institucion.Nombre+' para pertenecer a su asamblea con el rol de ' + invi.Invitados.NombreRol +', presiona el botón siguiente para completar el registro.';
            }
            if (invi.EstaAceptada == true && invi.TieneLicencias == true){
                texto = 'Ya aceptaste la invitación de la Institución ' + invi.Institucion.Nombre + ' para pertenecer a su asamblea con el rol de ' + invi.Invitados.NombreRol+ ' el día ' + invi.Invitados.FechaMostrar + '.';
            }
            if (invi.EstaAceptada == false && invi.TieneLicencias == false){
                texto = 'Haz sido invitado por la Institución ' + invi.Institucion.Nombre +' para pertenecer a su asamblea con el rol de ' + invi.Invitados.NombreRol +', sin embargo la Institución ya no cuenta con Licencias disponibles.';
            }
            if (invi.EstaAceptada == true && invi.TieneLicencias == false){
                texto = 'Ya aceptaste la invitación de la Institución ' + invi.Institucion.Nombre + ' para pertenecer a su asamblea con el rol de ' + invi.Invitados.NombreRol + ' el día ' + invi.Invitados.FechaMostrar + '.';
            }
            $('#lista').append(
                divUno +
                grupo +
                tituloUno +
                fechaUno +
                texto +
                '</a></div>'
            );

         });
     }


    }

});
