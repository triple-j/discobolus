var gulp = require("gulp");

var sourcemaps = require('gulp-sourcemaps');

var ts = require("gulp-typescript");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var buffer = require('vinyl-buffer');

var less = require('gulp-less');

var path = require('path');

var dataTags = require('./gulp/gulp-data-tags')

//START: Settings
var userscript = "./src/discobolus.user.js";
var distFolder = "./dist/";
var watchFiles = [
    "./src/**/*.ts",
    "./src/**/*.tsx",
    "./src/**/*.less",
    "./src/**/*.js",
];
//END: Settings

gulp.task("dev-less", function () {
    return gulp.src("./src/less/main.less")
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distFolder));
});

gulp.task("dev-typescript", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/typescript/main.ts'],
        cache: {},
        packageCache: {},
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts'],
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"));
});

gulp.task("dist-less", function () {
    return gulp.src("./src/less/main.less")
        .pipe(less())
        .pipe(gulp.dest(distFolder));
});

gulp.task("dist-typescript", function () {
    return browserify({
        basedir: '.',
        debug: false,
        entries: ['src/typescript/main.ts'],
        cache: {},
        packageCache: {},
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts'],
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest("dist"));
});

gulp.task("dist-data-tags", function () {
    return gulp.src(userscript)
        .pipe(dataTags({cwd: path.join(__dirname, "src")}))
        .pipe(gulp.dest(distFolder));
});

gulp.task("dev", gulp.series(
    gulp.parallel(
        "dev-less",
        "dev-typescript",
    ),
    "dist-data-tags"
));

gulp.task("dist", gulp.series(
    gulp.parallel(
        "dist-less",
        "dist-typescript",
    ),
    "dist-data-tags"
));

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(watchFiles, gulp.series('dist'));
});

// Default Task
gulp.task('default', gulp.series('dist', 'watch'));
