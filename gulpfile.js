var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    minifyCss = require('gulp-minify-css'),
    base64 = require('gulp-base64'),
    jshint = require('gulp-jshint'),
    csslint = require('gulp-csslint'),
    scsslint = require('gulp-scss-lint'),
    rename = require('gulp-rename');

csslint.addFormatter('csslint-stylish');

var src = {
  output: 'css',
  input: 'sass/*.scss',
  srcjs: 'js'
};

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('sass', function () {
  return gulp
    .src(src.input)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(base64())
    .pipe(gulp.dest(src.output))
});

gulp.task('prod', function () {
  return gulp
    .src(src.input)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(minifyCss())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(base64())
    .pipe(gulp.dest(src.output))
});

gulp.task('sass-lint', function() {
  return gulp.src(src.input)
    .pipe(scsslint());
});

gulp.task('scripts', function () {
  return gulp.src('js/*.js')
    .pipe(gulp.dest(src.srcjs))
});

gulp.task('jshint', function() {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('csslint', function() {
  gulp.src('css/*.css')
    .pipe(csslint())
    .pipe(csslint.formatter(require('csslint-stylish')))
});

gulp.task('browser-sync', function() {
  browserSync.init(["css/*.css"], {
    server: {
      baseDir: "./"
    }
  });
});


gulp.task('default', ['sass', 'browser-sync', 'scripts', 'jshint', 'sass-lint', 'csslint'], function () {
  gulp.watch("sass/*.scss", ['sass']);
  gulp.watch('sass/*.scss', ['sass-lint']);
  gulp.watch("*.html").on("change", reload);
  gulp.watch('js/*.js', ['jshint']);
  gulp.watch('css/*.css', ['csslint']);
});


// Refrash js changes
// linter css
// linter js
