/**
 * Created by vcoronado on 29-05-2017.
 */
//$(document).ready(function () {
    jQuery.support.cors = true;
    //var con = $.connection("http://localhost:34080/");


    //$.connection.chatHub.url ="http://localhost:34080/signalr";
    $.connection.hub.url = "http://localhost:34080/signalr/hubs";
    var chat = $.connection.chatHub;
    //chat.url = "http://localhost:34080/signalr";
    var username = sessionStorage.getItem("NombreUsuario");


    chat.client.updateUsers = function (userCount, userList) {
        $('#onlineUsersCount').text('Online users: ' + userCount);
        $('#userList').empty();
        userList.forEach(function (username) {
            $('#userList').append('<li>' + username + '</li>');
        });
    }

    chat.client.broadcastMessage = function (username, message) {
        //$('#messagesArea').append('<li><strong>' + username + '</strong>: ' + message);
        getNotify('success', 'Notificacion', message);
        //alert(message);
    }

    $.connection.hub.start().done(function () {
        chat.server.connect(username);
    });

    $('#btnSendMessage').click(function(){
        var message = $('#userMessage').val();
        chat.server.send(message);
        $('#userMessage').val("");
    });

    function AbrirUsuarios() {
        chat.server.send('usuarios');
        window.location.href = "usuarios.html";
    }

//});
