// === ІМПОРТ ПЛАГІНІВ ===
const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const path = require('path');
const fs = require('fs');

// === ШЛЯХИ ДО ФАЙЛІВ ===
const paths = {
  html: {
    src: 'src/html/pages/*.html',
    watch: 'src/html/**/*.html',
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
  },
  images: {
    src: 'src/images/**/*.*',
    dest: 'dist/images/'
  }
};

// === HTML ===
function html() {
  console.log('\x1b[36m%s\x1b[0m', '📄 HTML обробляється...');
  return gulp.src(paths.html.src)
    .pipe(fileInclude({
      prefix: '@@',
      basepath: 'src/html/'
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// === SCSS ===
function styles() {
  console.log('\x1b[35m%s\x1b[0m', '🎨 SCSS компілюється...');
  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// === JS app.js ===
function jsApp() {
  console.log('\x1b[33m%s\x1b[0m', '🧩 jsApp копіюється без мінімізації...');
  return gulp.src(paths.scripts.app)
    .pipe(gulp.dest(paths.scripts.appDest))
    .pipe(browserSync.stream());
}

// === JS functions (мінімізація) ===
function jsFunctions() {
  console.log('\x1b[32m%s\x1b[0m', '⚙️ jsFunctions мінімізується...');
  return gulp.src(paths.scripts.functions)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.functionsDest))
    .pipe(browserSync.stream());
}

// === ЗОБРАЖЕННЯ (копіювання) ===
function images() {
  console.log('\x1b[34m%s\x1b[0m', '🖼️ Зображення копіюються...');
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

// === ВИДАЛЕННЯ ЗОБРАЖЕНЬ ІЗ DIST, ЯКЩО ЇХ ВИДАЛЕНО В SRC ===
function watchImages() {
  const watcher = gulp.watch(paths.images.src, images);

  watcher.on('unlink', async function (filePath) {
    const del = (await import('del')).deleteSync;

    const srcFull = path.resolve(filePath);
    const distFull = srcFull.replace(
      path.resolve('src/images'),
      path.resolve('dist/images')
    );

    if (fs.existsSync(distFull)) {
      del(distFull, { force: true });
      console.log('\x1b[31m%s\x1b[0m', `🗑️ Видалено: ${distFull}`);
    }
  });
}

// === СПОСТЕРЕЖЕННЯ ЗА ВСІМ ===
function watch() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch(paths.html.watch, html);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.app, jsApp);
  gulp.watch(paths.scripts.functions, jsFunctions);
  watchImages(); // окремий виклик
  console.log('\x1b[44m%s\x1b[0m', '👀 Gulp слідкує за файлами...');
}

// === ЕКСПОРТИ ===
exports.default = gulp.series(
  gulp.parallel(html, styles, jsApp, jsFunctions, images),
  watch
);
