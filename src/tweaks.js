/* Golden click all the things! */

var CookieTweak = {};

(function () {
    "use strict";

    var GamePopupCallback = {}, Golden;

    // @todo This is not the right pattern and this probably won't work with
    // any other browser than Firefox and Safari. Chrome is stupid and wants
    // to do things differently than others.
    if ("granted" !== Notification.permission) {
        Notification.requestPermission();
    }

    // Tweaker configuration
    CookieTweak.Config = {
        // If set to true, display desktop notifications
        desktopNotificationEnabled: true
    };

    // Click helper
    CookieTweak.ultraClick = function () {

        var time = 50, i = 0;

        // Hack the game
        Game.clickFrenzy=Game.fps*time;
        Game.recalculateGains=1;
        Game.Popup('Manual click frenzy! Clicking power x777 for ' + time + ' seconds!');

        for (i; i < 10000; ++i) {
            setTimeout(function () {
                Game.ClickCookie();
            }, i * 2);
        }
    };

    // Game notifications and desktop notifications helper
    CookieTweak.Notification = {

        // Current notification, if any
        current: null,

        // Display a notification
        show: function (text, title, tag) {
            if (text) {
                var opts = {
                    icon: "http://orteil.dashnet.org/cookieclicker/img/goldCookie.png",
                    body: text
                };

                opts.title = title || "Message";

                if (CookieTweak.Config.desktopNotificationEnabled && "granted" === Notification.permission) {

                    if (tag) {
                        opts.tag = tag;
                    }

                    new Notification(title, opts);
                }

                if (console && console.log) {
                    console.log(opts.title + ": " + opts.body);
                }
            }
        }
    };

    // Golden cookie clicker
    Golden = function () {

        // Has a golden cookie being displayed
        this.displayed = false;

        // Clicker setInterface resource
        this.clickerInterval = null;

        // Spawner setInterface resource
        this.spawnerInterval = null;

        // Start cookie clicker
        this.startClicker = function () {
            var self = this;

            // Delay may be a bit too aggressive, but you're playing to a game
            // which will burn your CPU out of your browser anyway so don't
            // complain while using this.
            if (!this.clickerInterval) {
                this.clickerInterval = setInterval(function () {
                    if (!self.displayed && Game.goldenCookie.life > 0) {

                        self.displayed = true;
                        CookieTweak.Notification.show("I clicked a Golden cookie for you.", "Golden cookie!",  "golden-cookie-click");

                        // Magic setTimeout() which could live alone in this script.
                        setTimeout(function () {
                            Game.goldenCookie.click();
                            self.displayed = false;
                        }, 200);
                    } else if (Game.goldenCookie.life == 0) {
                        self.displayed = false;
                    }
                }, 100);

                CookieTweak.Notification.show("Golden cookie clicker started");
            }
        };

        // Stop cookie clicker
        this.stopClicker = function () {
            if (this.clickerInterval) {
                clearInterval(this.clickerInterval);

                CookieTweak.Notification.show("Golden cookie clicker stopped");
            }
        };

        // Start cookie spawner
        this.startSpawner = function () {
            var self = this;

            // Delay may be a bit too aggressive, but you're playing to a game
            // which will burn your CPU out of your browser anyway so don't
            // complain while using this.
            if (!this.spawnerInterval) {
                this.spawnerInterval = setInterval(function () {
                    if (!self.displayed) {

                        self.displayed = true;
                        CookieTweak.Notification.show("I spawned a Golden cookie for you.", "Golden cookie!",  "golden-cookie-spawn");

                        // Magic setTimeout() which could live alone in this script.
                        setTimeout(function () {
                            Game.goldenCookie.time = Game.goldenCookie.minTime + 100;
                            Game.goldenCookie.life = 0;
                            Game.goldenCookie.spawn();
                            self.displayed = false;
                        }, 200);
                    }
                }, 10000);

                CookieTweak.Notification.show("Golden cookie spawner started");
            }
        };

        // Stop cookie spawner
        this.stopSpawner = function () {
            if (this.spawnerInterval) {
                clearInterval(this.spawnerInterval);

                CookieTweak.Notification.show("Golden cookie spawner stopped");
            }
        };
    };

    // Intercept game popup function and proxy it in order to display
    // notifications using desktop notifications
    if (Game.Popup) {
        // For security reasons and because we still need it we are going to
        // the original callback aside.
        GamePopupCallback.gamePopupCallback = Game.Popup;
        Game.Popup = function (text) {
            GamePopupCallback.gamePopupCallback(text);
            CookieTweak.Notification.show(text);
        };
    }

    CookieTweak.GoldenClicker = new Golden();
}());
