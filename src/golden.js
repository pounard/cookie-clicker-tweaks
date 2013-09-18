/* Golden click all the things! */
(function () {
    "use strict";

    // @todo This is not the right pattern and this probably won't work with
    // any other browser than Firefox and Safari. Chrome is stupid and wants
    // to do things differently than others.
    if ("granted" !== Notification.permission) {
        Notification.requestPermission();
    }

    var n, displayed = false;

    // Delay may be a bit too aggressive, but you're playing to a game which
    // will burn your CPU out of your browser anyway so don't complain while
    // using this.
    setInterval(function () {
        if (!displayed && Game.goldenCookie.life > 0) {
            displayed = true;
            // This is for fun and is useless.
            if ("granted" === Notification.permission) {
                n = new Notification("Golden cookie!", {
                    icon: "http://orteil.dashnet.org/cookieclicker/img/goldCookie.png",
                    body: "I clicked a Golden cookie for you.",
                    tag: "golden-cookie"
                });
            }
            // Magic setTimeout() which could live alone in this script.
            setTimeout(function () {
                Game.goldenCookie.click();
                displayed = false;
            }, 200);
        } else if (Game.goldenCookie.life == 0) {
            displayed = false;
        }
    }, 100);
}());
