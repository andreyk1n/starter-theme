// === ІМПОРТ ПЛАГІНІВ ===
const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');

// === ШЛЯХИ ДО ФАЙЛІВ ===
const paths = {
  html: {
    src: 'src/pages/*.html',
    dest: 'dist/'
  },
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    app: 'src/js/app.js',
    appDest: 'dist/js/',
    functions: 'src/js/functions/**/*.js',
    functionsDest: 'dist/js/functions/'
  }
};

// === ОБРОБКА HTML З FILE INCLUDE ===
function html() {
  console.log('\x1b[36m%s\x1b[0m', '📄 HTML обробляється...');
  return gulp.src(paths.html.src)
    .pipe(fileInclude({
      prefix: '@@',
      basepath: 'src/partials/'
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// === ОБРОБКА SCSS У СТИЛІ ===
function styles() {
  console.log('\x1b[35m%s\x1b[0m', '🎨 SCSS компілюється...');
  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// === КОПІЮВАННЯ app.js БЕЗ МІНІМІЗАЦІЇ ===
function jsApp() {
  console.log('\x1b[33m%s\x1b[0m', '🧩 jsApp копіюється без мінімізації...');
  return gulp.src(paths.scripts.app)
    .pipe(gulp.dest(paths.scripts.appDest))
    .pipe(browserSync.stream());
}

// === МІНІМІЗАЦІЯ functions/*.js ===
function jsFunctions() {
  console.log('\x1b[32m%s\x1b[0m', '⚙️ jsFunctions мінімізується...');
  return gulp.src(paths.scripts.functions)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.functionsDest))
    .pipe(browserSync.stream());
}

// === СПОСТЕРЕЖЕННЯ ЗА ЗМІНАМИ + BROWSERSYNC ===
function watch() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch(paths.html.src, html);
  gulp.watch('src/partials/*.html', html);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.app, jsApp);
  gulp.watch(paths.scripts.functions, jsFunctions);
  console.log('\x1b[44m%s\x1b[0m', '👀 Gulp слідкує за файлами...');
}

// === ЕКСПОРТ ЗАДАЧ ===
exports.default = gulp.series(
  gulp.parallel(html, styles, jsApp, jsFunctions),
  watch
);
