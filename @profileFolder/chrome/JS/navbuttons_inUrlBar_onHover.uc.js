Components.utils.import('resource:///modules/CustomizableUI.jsm');
var { Services } = Components.utils.import('resource://gre/modules/Services.jsm', {});
var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);

(function () {
    let goarrow = document.querySelector('#urlbar-go-button');
    let stop = document.querySelector('#stop-button');
    let reload = document.querySelector('#reload-button');
    let back = document.querySelector('#back-button');
    let forward = document.querySelector('#forward-button');
    let pageActionButtons = document.querySelector('#page-action-buttons');
    pageActionButtons.append(goarrow);
    pageActionButtons.append(back);
    pageActionButtons.append(reload);
    pageActionButtons.append(stop);
    pageActionButtons.append(forward);

    let css = Services.io.newURI(
        'data:text/css;charset=utf-8,' +
            encodeURIComponent(
                '\
	#urlbar-go-button{-moz-box-ordinal-group: 2;}\
	#back-button{-moz-box-ordinal-group: 3;}\
	#reload-button{-moz-box-ordinal-group: 4;}\
	#stop-button{-moz-box-ordinal-group: 5;}\
	#forward-button{-moz-box-ordinal-group: 6;}\
	#urlbar-go-button, #forward-button, #stop-button, #reload-button, #back-button{\
	--toolbarbutton-inner-padding: 0px 3px !important; -moz-box-align: stretch !important;}\
	'
            ),
        null,
        null
    );
    sss.loadAndRegisterSheet(css, sss.AGENT_SHEET);

    function init() {
        document.querySelector('#stop-reload-button').remove();
    }
    if (gBrowserInit.delayedStartupFinished) init();
    else {
        let delayedListener = (subject, topic) => {
            if (topic == 'browser-delayed-startup-finished' && subject == window) {
                Services.obs.removeObserver(delayedListener, topic);
                init();
            }
        };
        Services.obs.addObserver(delayedListener, 'browser-delayed-startup-finished');
    }
})();
