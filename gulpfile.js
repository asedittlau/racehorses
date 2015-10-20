var hapi = require('hapi');
var bowerfiles = require('main-bower-files');

function fileExtensionRegexp(extensions) {
    return new RegExp(extensions.map(function(v) {
        return "\." + v;
    }).join("|") + "$");
}

// Gulp
var gulp = require('gulp');
var sass = require('gulp-sass');
var sftp = require('gulp-sftp');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var minify = require('gulp-minify-html');

var minifyOpts = {
    quotes: true,
    spare: true,
    empty: true
};

var paths = {
    styles: 'src/styles/**/*.scss',
    images: ['src/images/*', 'src/styles/images/*'],
    scripts: 'src/**/*.js',
    librariesCSS: bowerfiles({
        filter: fileExtensionRegexp(['css'])
    }),
    librariesJS: bowerfiles({
        filter: fileExtensionRegexp(['js'])
    }),
    html: 'src/**/*.html',
    font: ['src/styles/scss/fonts/*'].concat(bowerfiles({
        filter: fileExtensionRegexp(['svg', 'ttf', 'otf', 'eot', 'woff'])
    })),
    language: 'src/language/*.json',
    json: 'src/*.json'
};

var buildDest = './build';

gulp.task('styles', function() {
    return gulp.src(paths.styles)
        .pipe(sass())
        .pipe(autoprefixer('last 1 version', '> 1%'))
        .pipe(concat('all.min.css'))
        .pipe(gulp.dest(buildDest + '/css'));
});

gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(buildDest + '/img'));
});

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest(buildDest + '/js'));
});

gulp.task('librariesCSS', function() {
    return gulp.src(paths.librariesCSS)
        .pipe(concat('libraries.min.css'))
        .pipe(gulp.dest(buildDest + '/css'));
});

gulp.task('librariesJS', function() {
    return gulp.src(paths.librariesJS)
        .pipe(concat('libraries.min.js'))
        .pipe(gulp.dest(buildDest + '/js'));
});

gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(minify(minifyOpts))
        .pipe(gulp.dest(buildDest));
});

gulp.task('font', function() {
    return gulp.src(paths.font)
        .pipe(gulp.dest(buildDest + '/css/fonts'));
});

gulp.task('language', function() {
    return gulp.src(paths.language)
        .pipe(gulp.dest(buildDest + '/language'));
});

gulp.task('json', function() {
    return gulp.src(paths.json)
        .pipe(gulp.dest(buildDest));
});

gulp.task('comb', function() {
    return gulp.src(paths.styles)
        .pipe(csscomb())
        .pipe(gulp.dest('src/styles/'));
});

gulp.task('build', [
    'html',
    // 'librariesCSS',
    'librariesJS',
    'styles',
    'scripts',
    'images',
    'font',
    'language',
    'json'
]);

// Rerun the task when a file changes
gulp.task('watch', ['build'], function() {
    for (var key in paths) {
        if (paths.hasOwnProperty(key)) {
            gulp.watch(paths[key], [key]);
        }
    }

    gulp.watch(paths["styles"]);
});

gulp.task('serve', ['build'], function() {
    var server = new hapi.Server(8050);
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: buildDest
            }
        }
    });
    server.start();
});

gulp.task('deploy-meepo', ['build'], function() {
    return gulp.src('build/**/*')
        .pipe(sftp({
            host: 'meepo.tactel.se',
            user: 'meepo',
            pass: 'meepo',
            remotePath: '/home/meepo/www/polygon/admin/'
        }))
        // .pipe(slack('Latest build deployed to <http://meepo.tactel.se/|Meepo>'));
});

// The default task (called when you run 'gulp' from cli)
gulp.task('default', [
    'build',
    'watch',
    'serve'
]);