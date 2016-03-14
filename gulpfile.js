var gulp = require('gulp'),
  browserify = require('browserify'),
  gulp_util = require('gulp-util'),
  source = require('vinyl-source-stream'),
  Server = require('karma').Server,
  jade = require('gulp-jade'),
  nodemon = require('gulp-nodemon'),
  jshint = require('gulp-jshint'),
  buffer = require('vinyl-buffer'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  ccss = require('gulp-clean-css'),
  rename = require('gulp-rename');

var files = {
  to_uglify: ['./app/js/materialize.js'],
  sass: ['./app/style/style.scss']
};

gulp.task('browserify', function() {
  return browserify('./app/app.js')
    .bundle()
    .on('error', function(err) {
      gulp_util(err);
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('app/dist/js'));
});

/**
 * Run test once and exit
 */
gulp.task('test', function(done) {
  new Server({
    configFile: __dirname + '/tests/f-end/unit-tests/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('jade', function() {
  return gulp.src('./views/partials/*.jade')
    .pipe(jade({
      // locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./app/views'))
});

gulp.task('lint', function() {
  return gulp.src(['./app/*.js', './app/js/*.js'])
    .pipe(jshint())
});

gulp.task('start', function() {
  return nodemon({
      script: 'bin/www',
      ext: 'js'
    })
    .on('restart', function() {
      console.log('restarted.')
    });
});

gulp.task('uglify', function() {
  gulp.src(files.to_uglify)
    .pipe(uglify())
    .pipe(rename('dist.js'))
    .pipe(gulp.dest('app/dist/js'));
});

gulp.task('sass', function() {
  gulp.src(files.sass)
    .pipe(sass()
      .on('error', function(error) {
        console.log(error);
      }))
    .pipe(ccss())
    .pipe(gulp.dest('app/dist/css'))
});

gulp.task('sass:watch', function () {
  gulp.watch(files.sass, ['sass']);
});

gulp.task('default', ['start']);
