var app,
    changed     = require('gulp-changed'),
    clean       = require('gulp-clean'),
    es          = require('event-stream'),
    embedlr     = require('gulp-embedlr'),
    express     = require('express'),
    gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    gulputil    = require('gulp-util'),
    isdev       = gulp.env.out !== true,
    jade        = require('gulp-jade'),
    livereload  = require('gulp-livereload'),
    lr          = require('tiny-lr'),
    path        = require('path'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    server      = lr(),
    staticServer,
    uglify      = require('gulp-uglify'),
    less        = require('gulp-less');

//at the moment either less or sass
var preprocessor = 'less';


// move static assets
gulp.task('assets', function() {
    return es.concat(
        gulp.src('src/js/vendor/*.js')
            .pipe(gulp.dest('dist/js/vendor')),
        gulp.src('src/img/**')
            .pipe(gulp.dest('dist/img'))
    );
});


// clear all .html, .css and .js files before build
gulp.task('clean', function() {
    gulp.src(['dist/*.html','dist/js/*.js','dist/css/*.css'], {'read': false})
        .pipe(clean());
});


// jade to html
gulp.task('jade', function() {
    gulp.src('src/jade/**/*.jade')
        .pipe(jade({'pretty':true}))
        .pipe(livereload(server))
        .pipe(gulpif(isdev, embedlr()))
        .pipe(gulp.dest('dist'));
});


// compile css using preprocessors
gulp.task('css', function() {
    switch(preprocessor){
        case 'less':
            gulp.src('src/less/**/*.less')
                .pipe(less())
                .pipe(rename('style.css'))
                .pipe(livereload(server))
                .pipe(gulp.dest('dist/css'));
            break;
        case 'sass':
        case 'scss':
            gulp.src('src/scss/*.scss')
                .pipe(changed('dist/css'))
                .pipe(rename('style.css'))
                .pipe(sass({'outputStyle':'compressed'}))
                .pipe(livereload(server))
                .pipe(gulp.dest('./dist/css'));
            break;
        default:
            console.log(' ============================================== ');
            console.log(' = you need to define your preprocessor first = ');
            console.log(' ============================================== ');
    }
});


// compress javascript
gulp.task('uglify', function() {
    gulp.src('src/js/*.js')
        .pipe(changed('dist/js'))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/js'));
});


// static server listening on port 8888
staticServer = function(port) {
    app = express();
    app.use(express.static(path.resolve('dist')));
    app.listen(port, function() {
        gulputil.log('Listening on http://localhost:'+port);
    });
    return {
        app: app
    };
};
staticServer(8888);


// run the default task
gulp.task('default', function() {
    // livereload server, listening on port 35729
    server.listen(35729, function (err) {
        if (err) {
            return console.log(err)
        };
        // run all tasks on first run
        gulp.run('clean', 'css', 'jade', 'assets', 'uglify');

        // start watching src files
        gulp.watch('src/scss/*.scss', function(event){
            gulp.run('css');
        });
        gulp.watch('src/less/*.less', function(event){
            gulp.run('css');
        });

        gulp.watch('src/js/*.js', function(event){
            gulp.run('uglify');
        });
        gulp.watch('src/jade/**/*.jade', function(event){
            gulp.run('jade');
        });

    });
});