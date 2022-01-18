Components.utils.import('resource:///modules/CustomizableUI.jsm');
var { Services } = Components.utils.import('resource://gre/modules/Services.jsm', {});
var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);

(function () {
    let widgetId = 'movable-overflow-button';

    let listener = {
        onWidgetCreated: function (aWidgetId, aArea) {
            if (aWidgetId != widgetId) return;

            if (listener.css !== undefined) sss.unregisterSheet(listener.css, sss.AGENT_SHEET);

            listener.css = Services.io.newURI(
                'data:text/css;charset=utf-8,' + encodeURIComponent('\
#' + aWidgetId + '{\
list-style-image: url("chrome://global/skin/icons/chevron.svg");\
}\
#nav-bar-overflow-button {\
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
        label: 'Overflow menu',
        tooltiptext: 'More tools...',
        onCreated: function (node) {
            let originalMenu = node.ownerDocument.getElementById('nav-bar').overflowable;

            // helper function to not repeat so much code
            function setEvent(event) {
                node.addEventListener(
                    event,
                    function () {
                        originalMenu._chevron = node;
                    },
                    { capture: true }
                );
                node.addEventListener(event, originalMenu);
            }

            setEvent('mousedown');
            setEvent('keypress');
            //setEvent("dragend");
            //setEvent("dragover");
        },
    });
})();
