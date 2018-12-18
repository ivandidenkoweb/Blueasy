var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var runSequence = require("run-sequence");
var server = require("browser-sync").create();

gulp.task("style", function () {
  gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
        autoprefixer()
    ]))

    .pipe(gulp.dest("source/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("source/css"))

    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("source/img/**/*.{png, jpg, svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpgtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 80}))
    .pipe(gulp.dest("source/img"));
});

gulp.task("sprite", function () { 
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
      // <div style="display:none">
      //  <include src="source/img/sprite.svg"></include>
      //  </div> 
    ]))
    .pipe(gulp.dest("source"));
});

// gulp.task("copy", function () {
//    return gulp.src([
//      "source/fonts/**/*.{woff,woff2,ttf}",
//      "source/img/**",
//      "source/js/**"
//      ], {
//      base: "source"
//      })
//      .pipe(gulp.dest("build"));
// });

// gulp.task("clean", function() {
//   return del("build/**");
// });

gulp.task("serve", function() {
  server.init({
    server: "source/"
    // notify: false,
    // open: true,
    // cors: true,
    // ui: false
  });

  gulp.watch("source/less/**/**/*.less", ["style"]);
  gulp.watch("source/less/**/**/*.less").on("change", server.reload);
  gulp.watch("source/*.html").on("change", server.reload);
  // gulp.watch("source/js/*.js", ["minjs"]);
});

gulp.task("build", function(done){
  runSequence(
    // "clean",
    // "copy",
    "style",
    "sprite",
    "html",
    done
    );
});

