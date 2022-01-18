Components.utils.import('resource:///modules/CustomizableUI.jsm');
var { Services } = Components.utils.import('resource://gre/modules/Services.jsm', {});
var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);

(function () {
    let widgetId = 'movable-PanelUI-button';

    let listener = {
        onWidgetCreated: function (aWidgetId, aArea) {
            if (aWidgetId != widgetId) return;

            if (listener.css !== undefined) sss.unregisterSheet(listener.css, sss.AGENT_SHEET);

            listener.css = Services.io.newURI(
                'data:text/css;charset=utf-8,' + encodeURIComponent('\
#' + aWidgetId + '{\
list-style-image: url("chrome://browser/skin/menu.svg");\
}\
#PanelUI-button {\
display: none !important;\
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
        defaultArea: CustomizableUI.AREA_BOOKMARKS,
        label: 'Main menu',
        tooltiptext: 'Open menu',
        onCreated: function (node) {
            let originalMenu = node.ownerDocument.defaultView.PanelUI;

            // helper function to not repeat so much code
            function setEvent(event) {
                node.addEventListener(
                    event,
                    function () {
                        originalMenu.menuButton = node;
                    },
                    { capture: true }
                );
                node.addEventListener(event, originalMenu);
            }

            setEvent('mousedown');
            setEvent('keypress');
        },
    });
})();
