/* Notify all the things! */
(function () {
    "use strict";

    if ("granted" !== Notification.permission) {
        Notification.requestPermission();
    }

    var n, popupCallback;

    if (Game.Popup) {
        // For security reasons and because we still need it we are going to
        // the original callback aside.
        popupCallback = Game.Popup;

        Game.Popup = function (text) {

            popupCallback(text);

            n = new Notification("Message", {
                icon: "http://orteil.dashnet.org/cookieclicker/img/goldCookie.png",
                body: text
            });
        };
    }
}());
