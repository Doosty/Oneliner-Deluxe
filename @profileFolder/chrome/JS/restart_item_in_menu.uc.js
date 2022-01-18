/* Restart item script for Firefox 89+ by Aris https://github.com/Aris-t2/CustomJSforFx/blob/4111b9769ca005adf4dd710b7ed15c154949a3fd/scripts/restart_item_in_menu.uc.js
 */

var { Services } = Components.utils.import('resource://gre/modules/Services.jsm', {});

var RestartMenuFileAppItems = {
    init: function () {
        restartitem_filemenu = document.createXULElement('menuitem');
        restartitem_filemenu.setAttribute('label', 'Restart');
        restartitem_filemenu.setAttribute('id', 'fileMenu-restart-item');
        restartitem_filemenu.setAttribute('accesskey', 'R');
        restartitem_filemenu.setAttribute('acceltext', 'R');
        restartitem_filemenu.setAttribute('style', '-moz-context-properties: fill; fill: currentColor;');
        restartitem_filemenu.setAttribute('insertbefore', 'menu_FileQuitItem');
        restartitem_filemenu.setAttribute('onclick', 'if (event.button == 0) {RestartMenuFileAppItems.restartApp(false);} else if (event.button == 1) {RestartMenuFileAppItems.restartApp(true)};');
        restartitem_filemenu.setAttribute('oncommand', 'RestartMenuFileAppItems.restartApp(false);');

        if (document.getElementById('menu_FileQuitItem').previousSibling.id != 'fileMenu-restart-item')
            document.getElementById('menu_FileQuitItem').parentNode.insertBefore(restartitem_filemenu, document.getElementById('menu_FileQuitItem'));

        restartitem_appmenu = document.createXULElement('toolbarbutton');
        restartitem_appmenu.setAttribute('label', 'Restart');
        restartitem_appmenu.setAttribute('id', 'appMenu-restart-button');
        restartitem_appmenu.setAttribute('class', 'subviewbutton');
        restartitem_appmenu.setAttribute('accesskey', 'R');
        restartitem_appmenu.setAttribute('shortcut', 'Alt+R');
        restartitem_appmenu.setAttribute('insertbefore', 'appMenu-quit-button2');
        restartitem_appmenu.setAttribute('onclick', 'if (event.button == 0) {RestartMenuFileAppItems.restartApp(false);} else if (event.button == 1) {RestartMenuFileAppItems.restartApp(true)};');
        restartitem_appmenu.setAttribute('oncommand', 'RestartMenuFileAppItems.restartApp(false);');

        var AMObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (document.querySelector('#appMenu-restart-button') == null)
                    document.querySelector('#appMenu-quit-button2').parentNode.insertBefore(restartitem_appmenu, document.getElementById('appMenu-quit-button2'));
            });
        });

        /* changed from default #PanelUI-menu-button to be compatible with onelinerdeluxe */
        AMObserver.observe(document.querySelector('#movable-PanelUI-button'), { attributes: true, attributeFilter: ['open'] });

        /* icon handling in a separate css file, pasting it here for reference
    #fileMenu-restart-item {  background-image: url("chrome://global/skin/icons/reload.svg"); }
    #appMenu-restart-button { list-style-image: url("chrome://global/skin/icons/reload.svg"); }
    */
    },

    restartApp: function (clearcaches) {
        var cancelQuit = Components.classes['@mozilla.org/supports-PRBool;1'].createInstance(Components.interfaces.nsISupportsPRBool);
        var observerSvc = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
        if (clearcaches) {
            Components.classes['@mozilla.org/xre/app-info;1'].getService(Components.interfaces.nsIXULRuntime).invalidateCachesOnRestart();
        }
        observerSvc.notifyObservers(cancelQuit, 'quit-application-requested', 'restart');
        if (cancelQuit.data) return false;
        Services.startup.quit(Services.startup.eRestart | Services.startup.eAttemptQuit);
    },
};

if (gBrowserInit.delayedStartupFinished) RestartMenuFileAppItems.init();
else {
    let delayedListener = (subject, topic) => {
        if (topic == 'browser-delayed-startup-finished' && subject == window) {
            Services.obs.removeObserver(delayedListener, topic);
            RestartMenuFileAppItems.init();
        }
    };
    Services.obs.addObserver(delayedListener, 'browser-delayed-startup-finished');
}
