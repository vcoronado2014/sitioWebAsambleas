$(function () {
    var chat = $.connection.chatHub;
    var username;
    do {
        username = prompt("Insert your username: ");
    } while (username == null || username == "");

    chat.client.updateUsers = function (userCount, userList) {
        $('#onlineUsersCount').text('Usuarios en línea: ' + userCount);
        $('#userList').empty();
        userList.forEach(function (username) {
            $('#userList').append('<li>' + username + '</li>');
        });
    }

    chat.client.updateGrupos = function (usuariosCount, gruposCount, gruposList, messagesCount, messagesArr) {
        //alert(gruposCount);
        $('#totalUsuariosConectados').text(usuariosCount);
        $('#totalGruposCreados').text(gruposCount);
        $('#totalMensajesProcesados').text(messagesCount);
    }

    chat.client.broadcastMessage = function (username, message) {
        $('#messagesArea').append('<li><strong>' + username + '</strong>: ' + message);
    }

    chat.client.broadcastMessageUrl = function (username, message, url) {
        $('#messagesArea').append('<li><strong>' + username + '</strong>: ' + message);
    }

    $.connection.hub.start().done(function () {
        chat.server.connect(username);
    });

    $('#btnSendMessage').click(function(){
        var message = $('#userMessage').val();
        chat.server.send(message);
        $('#userMessage').val("");
    });

});

