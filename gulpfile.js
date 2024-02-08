
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
// Manejo de errores
function errorHandler(err) {
    console.error(err.toString());
    this.emit('end');
}
// Tarea para compilar Sass
function css() {
    return src('src/scss/app.scss')
        .pipe( sourcemaps.init() )
        .pipe( sass().on('error', errorHandler) )
        // .pipe( postcss([autoprefixer(),cssnano()]) )
        .pipe( postcss([autoprefixer()]) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/css') );
}
// Tarea para optimizar imágenes
function imagenes() {
    return src('src/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3 }))
        .pipe(dest('build/img'));
}
// Tarea para generar versiones WebP de las imágenes
function versionWebp() {
    const opciones = {
        quality: 50
    };
    return src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'));
}
// Tarea para generar versiones AVIF de las imágenes
function versionAvif() {
    const opciones = {
        quality: 50
    };
    return src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));
}
function html() {
    return src('src/*.html') // Cambia el patrón según tu estructura de carpetas
      .pipe(dest('build'));
  };

  function js() {
    return src('src/js/*.js') // Cambia el patrón según tu estructura de carpetas
      .pipe(dest('build/js'));
  };

// Tarea para observar cambios durante el desarrollo
function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes);
    watch('src/*.html', html);
    watch('src/*.js', js);
}
exports.css = css;
exports.dev = dev;
exports.html = html;
exports.js = js;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
// Tarea predeterminada que se ejecuta al llamar a "gulp" desde la línea de comandos
exports.default = series(imagenes, versionWebp, versionAvif,js,html, css, dev);
