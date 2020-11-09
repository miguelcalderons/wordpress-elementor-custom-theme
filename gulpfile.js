const slug = 'custom-theme';// Change this to the plugin slug
const gulp = require("gulp")
const webpackStream = require('webpack-stream')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const del = require('del')
var argv = require('yargs').argv
var csso = require('gulp-csso')//Minify CSS with CSSO
var gulpif = require('gulp-if')
var livereload = require('gulp-livereload');

gulp.task('jsAdmin', () => {
    return gulp.src('./admin/src/js/index.js')
        .pipe(webpackStream({mode:argv.mode}))
        .pipe(rename(slug+'-admin.js'))
        .pipe(gulp.dest('admin/js/'))
        .pipe(livereload());
});

gulp.task('sassAdmin', () => {
    return gulp.src('./admin/src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename(slug+'-admin.css'))
        .pipe(gulp.dest('./admin/css/'))
        .pipe(livereload());
});

gulp.task('jsPublic', () => {
    return gulp.src('./public/src/js/index.js')
        .pipe(webpackStream({mode:argv.mode}))
        .pipe(rename(slug+'-public.js'))
        .pipe(gulp.dest('public/js/'))
        .pipe(livereload());
});

gulp.task('sassPublic', () => {
    return gulp.src('./public/src/scss/main.scss')
        .pipe(sass({outputStyle: 'nested',}).on('error', sass.logError))
        .pipe(rename(slug+'-public.css'))
        .pipe(gulpif(argv === 'production', csso()))
        .pipe(gulp.dest('./public/css/'))
        .pipe(livereload());
});

gulp.task('clean', () => {
    return del([
        './public/css/'+slug+'-public.css',
        './admin/css/'+slug+'-admin.css',
        './public/js/'+slug+'-public.js',
        './admin/js/'+slug+'-admin.js',
    ]);
});

// gulp watch task that runs the above tasks in series and then watches for changes
gulp.task('watch', () => {
    gulp.watch('./public/src/scss/**/*.scss', (done) => {
        gulp.series(['sassPublic'])(done);
    });
    gulp.watch('./admin/src/scss/**/*.scss', (done) => {
        gulp.series(['sassAdmin'])(done);
    });
    gulp.watch('./public/src/js/**/*.js', (done) => {
        gulp.series(['jsPublic'])(done);
    });
    gulp.watch('./admin/src/js/**/*.js', (done) => {
        gulp.series(['jsAdmin'])(done);
    });
});

// gulp build task that runs the above tasks in series
gulp.task('build', gulp.series(['clean', 'sassPublic', 'sassAdmin', 'jsPublic', 'jsAdmin']));