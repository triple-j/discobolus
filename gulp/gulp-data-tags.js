var through = require('through2');
var PluginError = require('gulp-util').PluginError;
var fs = require('fs');
var path = require('path');

const PLUGIN_NAME = 'gulp-data-tags';

/**
 * Replace `{{data:.*}}` tags with data-urls
 * @param {string} text - text to search through
 * @param {string} base - base path for relative fileSize
 * @param {boolean} [recursive=false] - recursively search file
 * @param {Array.<string>} [whitelistExt=[".html",".js",".css"]] - extensions to
 *      recursively search
 * @return {string}
 */
function replaceDataTags(text, base, recursive, whitelistExts) {
    recursive = recursive || false;
    whitelistExts = whitelistExts || [
        ".html",
        ".js",
        ".css",
    ];
    var tagMatches = text.match(/{{data:.*}}/gi) || [];
    var reFilePath = /{{data:.*;file,(.*)}}/i;

    tagMatches.forEach(function(dataTag){
        var dataMatches = dataTag.match(reFilePath);
        var dataUrl = dataTag.replace(/(^{+|}+$)/g, '');
        var filePath;
        var fileBuffer;
        var base64;

        if (dataMatches !== null) {
            filePath = path.join(base, dataMatches[1]);
            fileExt = path.extname(filePath).toLowerCase();

            // create data-url
            fileBuffer = fs.readFileSync(filePath);
            if (recursive && whitelistExts.includes(fileExt)) {
                fileBuffer = new Buffer(replaceDataTags(
                    fileBuffer.toString(),
                    filePath.replace(/(.*[\/\\]).*/, "$1"),
                    true,
                    whitelistExts
                ));
            }
            base64 = fileBuffer.toString('base64');
            dataUrl = dataUrl.replace(/file,(.*)$/, "base64," + base64);

            // replace tag
            text = text.replace(dataTag, dataUrl);
        }
    });

    return text;
}

function gulpDataTags(options) {
    options = options || {};

    return through.obj(function(file, encoding, callback) {
        var text = null;
        var base = options.cwd || file.base

        if (file.isNull()) {
            //console.log("NULL");
            // do nothing
        } else if (file.isStream()) {
            //console.log("STREAM");
            this.emit('error', new PluginError("gulp-data-tags", 'Streams not supported!'));
        } else if (file.isBuffer()) {
            //console.log("BUFFER");
            //this.emit('error', new PluginError("gulp-data-tags", 'Buffers not supported!'));

            text = file.contents.toString(encoding);
            text = replaceDataTags(text, base, options.recursive, options.whitelistExts);

            file.contents = new Buffer(text, encoding);
        }

        callback(null, file);
    });
}

// Exporting the plugin main function
module.exports = gulpDataTags;
