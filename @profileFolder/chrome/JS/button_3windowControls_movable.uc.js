Components.utils.import('resource:///modules/CustomizableUI.jsm');

(function () {
    let controlbuttonContainer = document.querySelector('#nav-bar-customization-target').insertBefore(
        _ucUtils.createElement(document, 'toolbaritem', {
            id: 'uc-controlbutton-container',
            defaultArea: CustomizableUI.AREA_TABSTRIP,
            label: 'Window controls',
            title: 'Window controls',
            removable: 'true',
            class: 'chromeclass-toolbar-additional toolbaritem-combined-buttons',
            style: '-moz-box-align: stretch; margin: 0; padding: 0;',
            'cui-areatype': 'toolbar',
        }),
        document.querySelector('#urlbar-container')
    );

    controlbuttonContainer.appendChild(document.querySelector('.titlebar-buttonbox.titlebar-color'));

    document.querySelector('#titlebar .titlebar-buttonbox-container').remove();
    document.querySelector('#titlebar .titlebar-buttonbox-container').remove();

    function init() {
        if (document.querySelector('#uc-controlbutton-container') === null) {
            document.querySelector('#TabsToolbar-customization-target').append(controlbuttonContainer);
        }
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
