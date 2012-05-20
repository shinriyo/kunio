$(document).ready(function () {
    var ws = new WebSocket("ws://localhost:8888/socket");
    // ClientSocketにはoni_messageないけどOKなの?
    ws.onmessage = function(event) {
        $(body).append('<div>' + event.data + '</div>');
        $('body').append('<div>Start!</div>');
    }
});
