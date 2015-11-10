var gulp = require('gulp'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    globule = require('globule'),
    stylish = require('jshint-stylish'),
    imagemin = require('gulp-imagemin'),
    htmlReplace = require('gulp-html-replace'),
    templateCache = require('gulp-angular-templatecache'),
    gulpNgConfig = require('gulp-ng-config'),
    embedTemplates = require('gulp-angular-embed-templates');

var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

var config = require('./config.json');

gulp.task('clean:JS', function(cb){
    del([config.build_dir + '/js', config.build_dir + '/vendor'], function(){
        return cb();
    });
});

gulp.task('clean:CSS', function(cb){
    del([config.build_dir + '/css'], function(){
        return cb();
    });
});

gulp.task('clean:HTML', function(cb){
    del([config.build_dir + '/**/*.html'], function(){
        return cb();
    });
});

gulp.task('clean:Fonts', function(cb){
    del([config.build_dir + '/fonts'], function(){
        return cb();
    });
});

gulp.task('clean:IMG', function(cb){
    del([config.build_dir + '/img'], function(){
        return cb();
    });
});

gulp.task('copyStaticCSS', ['clean:CSS'], function(){
    return gulp.src(config.dependencies.css)
        .pipe(gulp.dest(config.build_dir + '/css/'));
});

gulp.task('copyFonts', ['clean:Fonts'], function(){
    return gulp.src(['./src/fonts/**/*'])
        .pipe(gulp.dest(config.build_dir + '/fonts/'));
});

gulp.task('copyStaticFiles', ['clean:IMG', 'copyFonts'], function(cb){
    return gulp.src(['./src/img/**/*'])
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(config.build_dir + '/img/'));
});

gulp.task('reConfig', function(cb){
    delete require.cache[require.resolve('./config.json')];
    config = require('./config.json');
    return cb();
});

gulp.task('lint', ['clean:JS'], function() {
    return gulp.src(['./src/js/**/*.js', '!src/js/vendor/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('configureLocal',['clean:JS'], function () {
    gulp.src('environments.json')
        .pipe(gulpNgConfig('anoniWeb', {environment: 'local', createModule: false}))
        .pipe(gulp.dest(config.build_dir + '/js'));
});

gulp.task('cacheTemplates',['clean:JS'], function () {
    return gulp.src('./src/js/shared/templates/**/*.html')
        .pipe(templateCache('templates.js', {standalone: true}))
        .pipe(gulp.dest(config.build_dir + '/js'));
});

gulp.task('deploy:jsDebug', ['lint', 'reConfig'], function(cb){
    var done = 0;

    //copying dependencies
    gulp.src(config.dependencies.vendor)
        .pipe(gulp.dest(config.build_dir + '/js/vendor'))
        .on('finish', function(){
            if(done === 1){
                return cb();
            }
            done++;
        });

    //copying src js files
    gulp.src(['./**/*.js','!vendor/**/*.js'], {cwd:'src/js'})
        .pipe(embedTemplates())
        .pipe(gulp.dest(config.build_dir + '/js'))
        .on('finish', function(){
            if(done === 1){
                return cb();
            }
            done++;
        });
});

var deploy = function(cb){
    gulp.src('index.html')
        .pipe(htmlReplace({
            appJs: globule.find(['js/**/*.js', '!js/vendor/**/*.js'], {srcBase: "src"}).concat( globule.find(['js/templates.js', 'js/environments.js'],{srcBase:'build'})),
            vendor: config.dependencies.vendor.map(function(path){ return 'js/vendor/' + path.substr(path.lastIndexOf('/') + 1);}),
            css: globule.find(['css/**/*.css', '!css/app.css'], {srcBase: config.build_dir}),
            translations: globule.find(['translations/**/*.js'], {srcBase: config.build_dir})
        }))
        .pipe(gulp.dest(config.build_dir, {overwrite: true}))
        .on('finish', function(){
            return cb();
        });
};

gulp.task('package:Local', ['configureLocal', 'cacheTemplates', 'deploy:jsDebug', 'clean:HTML', 'copyStaticFiles', 'copyStaticCSS'], function(cb){
    deploy(cb);
});

gulp.task('debug', ['package:Local'], function() {

    browserSync.init({
        server: {
            baseDir: "./"+config.build_dir
        }
    });

    gulp.watch(["./src/*.html", "./src/**/*.html", "./src/**/*.js", './config.json','./index.html', './src/**/*.css'], ['package:Local', reload]);
});
