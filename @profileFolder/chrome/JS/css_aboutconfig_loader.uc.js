(function () {
    var prefs_css_dir = 'CSS_aboutconfig';

    Components.utils.import('resource://gre/modules/Services.jsm');
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var prefservice = {};
    var prefcache = {};

    var prefs_init = async function () {
        // iterate css directory, get filepaths - unique prefnames
        var files = Services.dirsvc.get('UChrm', Ci.nsIFile);
        files.append(prefs_css_dir);
        files = files.directoryEntries;
        while (files.hasMoreElements()) {
            var file = files.getNext().QueryInterface(Ci.nsIFile);
            var prefname = file.leafName.substring(0, file.leafName.lastIndexOf('.'));
            prefcache[prefname] = { filepath: file.path };
        }

        // parse files and fire pref & css loading for each
        await Promise.all(
            Object.keys(prefcache).map(async function (pref_name) {
                var filedata = await IOUtils.readUTF8(prefcache[pref_name].filepath);
                filedata = filedata.substring(filedata.indexOf('metadata firstline'));

                // get first line meta data
                var metadata = {};
                var metadatatemp = filedata.split('\n', 1)[0].split('|');
                metadatatemp.forEach((element) => {
                    tempdata = element.split(':');
                    metadata[tempdata[0]] = tempdata[1];
                });
                if ('branch' in metadata) if (metadata.branch.length > 0 && metadata.branch != '_' && !metadata.branch.endsWith('.')) metadata.branch = metadata.branch + '.';
                prefcache[pref_name].metadata = metadata;

                // get css data, discard metadata lines
                if ((metadata.type == 'bool' ? filedata.indexOf('metadata boolean') : -1) == -1) {
                    prefcache[pref_name].cssdata1 = filedata.substring(filedata.indexOf('\n') + 1);
                } else {
                    // look for twopart bool logic
                    var boolpair = filedata.split('metadata boolean', 2);
                    prefcache[pref_name].cssdata1 = boolpair[0].substring(boolpair[0].indexOf('\n') + 1).substring(boolpair[0].lastIndexOf('\n') + 1, -1);
                    prefcache[pref_name].cssdata2 = boolpair[1].substring(boolpair[1].indexOf('\n') + 1);
                }

                // create pref services
                if (!(metadata.branch in prefservice)) {
                    prefservice[metadata.branch] = {};
                    prefservice[metadata.branch].normal = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefService).getBranch(metadata.branch).QueryInterface(Ci.nsIPrefBranch);
                    prefservice[metadata.branch].default = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefService).getDefaultBranch(metadata.branch).QueryInterface(Ci.nsIPrefBranch);
                }

                // preference & css loading
                pref_handling(pref_name, true);
            })
        );
    };
    var pref_handling = function (pref_name, firstLoad = false) {
        if (!firstLoad) {
            // dont bug out for incode setpref calls
            if (prefalreadyloading) return;
            else prefalreadyloading = true;
        }

        var md = prefcache[pref_name].metadata;
        var pref_value = pref_handling_setgetValue(pref_name, md, firstLoad); // sets defaults if firstload
        var cssuri = pref_handling_encodeCss(pref_name, md, pref_value);

        if (!firstLoad) {
            // unload cached css
            if ('cssuri' in prefcache[pref_name]) if (sss.sheetRegistered(prefcache[pref_name].cssuri, sss.USER_SHEET)) sss.unregisterSheet(prefcache[pref_name].cssuri, sss.USER_SHEET);

            // resolve conflicting prefs
            if (pref_value == true && md.resolveconflicts != '_') {
                conflicts = md.resolveconflicts.split(',');
                conflicts.forEach((conflict) => {
                    var conflict_name = conflict.substring(0, conflict.indexOf('['));
                    var conflict_newvalue = conflict.substring(conflict.indexOf('[') + 1, conflict.lastIndexOf(']'));
                    conflict_newvalue = conflict_newvalue == 'true' ? true : conflict_newvalue == 'false' ? false : isNaN(conflict_newvalue) ? conflict_newvalue : parseInt(conflict_newvalue);
                    if ('cssuri' in prefcache[conflict_name]) if (sss.sheetRegistered(prefcache[conflict_name].cssuri, sss.USER_SHEET)) sss.unregisterSheet(prefcache[conflict_name].cssuri, sss.USER_SHEET);
                    pref_handling_setgetValue(conflict_name, prefcache[conflict_name].metadata, false, conflict_newvalue, false);
                    console.log('unloaded conflicting css: ' + conflict_name);
                });
            }
        }
        if (cssuri) {
            sss.loadAndRegisterSheet(cssuri, sss.USER_SHEET);
            prefcache[pref_name].cssuri = cssuri;
            console.log('loaded css: ' + pref_name);
        } else delete prefcache[pref_name].cssuri;

        prefalreadyloading = false;
    };
    var pref_handling_setgetValue = function (pref_name, md, setdefault = false, setregular = '_', getregular = true) {
        // set the default, set the regular, return regular
        var pref_value;
        if (['boolean', 'bool', '_'].includes(md.type)) {
            if (setdefault) prefservice[md.branch].default.setBoolPref(pref_name, md.default == 'false' ? false : true);
            if (setregular != '_') prefservice[md.branch].normal.setBoolPref(pref_name, setregular);
            if (getregular) pref_value = prefservice[md.branch].normal.getBoolPref(pref_name);
        } else if (['string', 'text'].includes(md.type)) {
            if (setdefault) prefservice[md.branch].default.setCharPref(pref_name, md.default != '_' ? md.default : '');
            if (setregular != '_') prefservice[md.branch].normal.setCharPref(pref_name, setregular);
            if (getregular) pref_value = prefservice[md.branch].normal.getCharPref(pref_name);
        } else if (['number', 'integer', 'int'].includes(md.type)) {
            if (setdefault) prefservice[md.branch].default.setIntPref(pref_name, md.default != '_' ? parseInt(md.default) : 0);
            if (setregular != '_') prefservice[md.branch].normal.setIntPref(pref_name, setregular);
            if (getregular) pref_value = prefservice[md.branch].normal.getIntPref(pref_name);
            var min = parseInt(md.min);
            var max = parseInt(md.max);
            if (pref_value < min) {
                prefservice[md.branch].normal.setIntPref(pref_name, min);
                pref_value = min;
            }
            if (pref_value > max) {
                prefservice[md.branch].normal.setIntPref(pref_name, max);
                pref_value = max;
            }
        }
        return pref_value;
    };
    var pref_handling_encodeCss = function (pref_name, md, pref_value) {
        var cssuri;
        if (['boolean', 'bool', '_'].includes(md.type)) {
            // if boolean, use the proper css
            if (pref_value) cssuri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(prefcache[pref_name].cssdata1));
            else cssuri = 'cssdata2' in prefcache[pref_name] ? makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(prefcache[pref_name].cssdata2)) : null;
        } else {
            // if not bool, insert the pref value into the css as a 'variable'
            cssuri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(prefcache[pref_name].cssdata1.replace('_', pref_value)));
        }
        return cssuri;
    };
    var observer_callback = function (pref_service, pref_activity, pref_name) {
        if (pref_activity == 'nsPref:changed') pref_handling(pref_name, false);
    };
    var observer_init = function () {
        //add pref observer for all pref branches
        Object.keys(prefservice).map(function (pref_branch) {
            prefservice[pref_branch].normal.addObserver('', observer_callback, false);
        });
    };

    prefs_init();
    window.addEventListener('load', observer_init, false);
})();
