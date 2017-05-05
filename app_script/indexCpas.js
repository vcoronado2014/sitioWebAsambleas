/**
 * Created by vcoronado on 05-05-2017.
 */
$(function () {

    function ViewModel(vinculos, articulos, instituciones) {
        var self = this;

        //nombreCompleto = ko.observable(sessionStorage.getItem("NombreCompleto"));
        //self.nombreRol = ko.observable(sessionStorage.getItem("NombreRol"));
        //nombreInstitucion = ko.observable(sessionStorage.getItem("NombreInstitucion"));
        //self.birthDay = ko.observable(moment(new Date()).format("DD-MM-YYYY"));


        //Menu();
        self.vinculosArr = JSON.parse(vinculos);
        self.articulosArr = JSON.parse(articulos);
        self.institucionesArr = JSON.parse(instituciones);

        ko.mapping.fromJS(self.vinculosArr, self.articulosArr, self.instituciones, {}, self);

    }
    //verificamos
    if (sessionStorage.getItem("vinculos") != null && sessionStorage.getItem("articulos") != null && sessionStorage.getItem("instituciones") != null)
    {
        var vinculos = sessionStorage.getItem("vinculos");
        var articulos = sessionStorage.getItem("articulos");
        var instituciones = sessionStorage.getItem("instituciones");

        ko.applyBindings(new ViewModel(vinculos, articulos, instituciones));
    }


});