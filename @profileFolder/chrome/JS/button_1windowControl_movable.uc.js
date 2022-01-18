Components.utils.import('resource:///modules/CustomizableUI.jsm');
var { Services } = Components.utils.import('resource://gre/modules/Services.jsm', {});
var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);

(function () {
    let widgetId = 'minMaxClose-button';

    let listener = {
        onWidgetCreated: function (aWidgetId, aArea) {
            if (aWidgetId != widgetId) return;

            if (listener.css !== undefined) sss.unregisterSheet(listener.css, sss.AGENT_SHEET);

            listener.css = Services.io.newURI(
                'data:text/css;charset=utf-8,' + encodeURIComponent('\
#' + aWidgetId + '{\
list-style-image: url("chrome://global/skin/icons/radio.svg");\
padding: 0px !important;\
}\
'),
                null,
                null
            );

            sss.loadAndRegisterSheet(listener.css, sss.AGENT_SHEET);
        },
    };

    CustomizableUI.addListener(listener);
    CustomizableUI.createWidget({
        id: widgetId,
        type: 'button',
        class: 'toolbarbutton-1 chromeclass-toolbar-additional',
        defaultArea: CustomizableUI.AREA_TABSTRIP,
        label: 'MinMaxClose Button',
        tooltiptext: 'Left-Click: Close\nRight-Click: Minimize\nMiddle-Click: Maximize/Restore',
        onClick: (e) => {
            let win = e.view;
            switch (e.button) {
                case 0: // left click
                    console.log('Closing');
                    win.BrowserTryToCloseWindow(e);
                    break;

                case 1: // middle click
                    let max = win.document.getElementById('main-window').getAttribute('sizemode') == 'maximized' ? true : false;
                    if (!max) {
                        win.maximize();
                    } else if (max) {
                        win.restore();
                    }
                    break;
                case 2: // right click
                    win.minimize();
                    break;
            }
        },
    });
})();
