/**
 * Created by vcoronado on 05-04-2017.
 */
$(document).ready(function () {

    function PersonViewModel(){
        var self = this;
        //del formulario
        self.frmNombreUsuario = ko.observable("");
        self.frmNombres = ko.observable("");
        self.frmApellidoPaterno = ko.observable("");
        self.frmApellidoMaterno = ko.observable("");
        self.frmRut = ko.observable("");
        self.frmTelefono = ko.observable(sessionStorage.getItem("telefonoInstitucionPrueba"));
        self.frmCorreoElectronico = ko.observable(sessionStorage.getItem("correoInstitucionPrueba"));
        self.frmIdRegion = ko.observable(sessionStorage.getItem("idRegionInstitucionPrueba"));
        self.frmIdComuna = ko.observable(sessionStorage.getItem("idComunaInstitucionPrueba"));
        self.frmDireccion = ko.observable(sessionStorage.getItem("direccionInstitucionPrueba"));

        self.frmPassword = ko.observable("");
        self.frmNuevaPassword = ko.observable("");


        siguiente = function(item){

            sessionStorage.setItem("nombreUsuarioPrueba", frmRut);
            sessionStorage.setItem("nombresUsuarioPrueba", frmNombres);
            sessionStorage.setItem("apellidoPaternoPrueba", frmApellidoPaterno);
            sessionStorage.setItem("apellidoMaternoPrueba", frmApellidoMaterno);
            sessionStorage.setItem("rutPrueba", frmRut);


        }
        salir = function(){
            sessionStorage.clear();
            window.location.href = "index.html";

        }
    }

    ko.applyBindings(new PersonViewModel());

});
