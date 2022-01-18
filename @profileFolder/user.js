/* load userchrome.css & usercontent.css */
user_pref('toolkit.legacyUserProfileCustomizations.stylesheets', true);

/* enable dev tools and disable warnings */
user_pref('devtools.chrome.enabled', true);
user_pref('devtools.debugger.remote-enabled', true);
user_pref('devtools.debugger.prompt-connection', false);

/* dont show a warning when opening config */
user_pref('browser.aboutConfig.showWarning', false);

/* proton enabled  */
user_pref('browser.proton.enabled', true);

/* proton tooltip */
user_pref('browser.proton.places-tooltip.enabled', true);

/* fill SVG Color */
user_pref('svg.context-properties.content.enabled', true);

/* css backdrop filters */
user_pref('layout.css.backdrop-filter.enabled', true);
user_pref('gfx.webrender.all', true);

/* css color-mix */
user_pref('layout.css.color-mix.enabled', true);

/* apply compact mode */
user_pref('browser.compactmode.show', true);
user_pref('browser.uidensity', 1);
user_pref('browser.touchmode.auto', false);

/* integrated calculator and unit converter in urlbar  (example "50kg to lbs" or "58+34") */
user_pref('browser.urlbar.suggest.calculator', true);
user_pref('browser.urlbar.unitConversion.enabled', true);

/* dont close window when last tab closes */
user_pref('browser.tabs.closeWindowWithLastTab', false);

/* dont warn on close */
user_pref('browser.tabs.warnOnClose', false);

/* autohide download button when empty */
user_pref('browser.download.autohideButton', true);

/* enables context-fill which fills with theme appropriate color  */
user_pref('svg.context-properties.content.enabled', true);

/* bookmarks toolbar needs to be set to visible for the autohiding to work */
user_pref('browser.toolbars.bookmarks.visibility', 'always');

/******************/
/* Urlbar cleanup */
/******************/

/* popular sites aren't automatically shown when URL bar gains focus */
user_pref('browser.urlbar.suggest.topsites', false);

/* open tabs aren't suggested when typing in the URL bar */
/* can still be done by typing % before the search */
user_pref('browser.urlbar.suggest.openpage', false);

/* bookmarks aren't automatically suggested when typing in the URL bar,
/* can still be done by typing * before the search */
user_pref('browser.urlbar.suggest.bookmark', false);

/* history isn't automatically suggested when typing in the URL bar */
/* can still be done by typing ^ before the search */
user_pref('browser.urlbar.suggest.history', false);

/* hide group labels */
user_pref('browser.urlbar.groupLabels.enabled', false);

/* hide sponsored sites */
user_pref('browser.urlbar.sponsoredTopSites', false);

/*OTHER*/
/*
user_pref("extensions.pocket.enabled", false); // pocket disabled
user_pref("browser.startup.homepage", "about:blank");  // homepage to about:blank
user_pref("browser.cache.disk.enable", false);  //shift cache from disk to ram
user_pref("browser.cache.memory.enable", true); //shift cache from disk to ram
*/
