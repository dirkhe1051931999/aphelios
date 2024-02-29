const gulp = require('gulp');
const ts = require('gulp-typescript');
const copy = require('gulp-copy');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('dist'));
});

gulp.task('copy', () => {
  return gulp.src(['src/templates/**/*'])
    .pipe(copy('dist', { prefix: 1 }));
});

gulp.task('default', gulp.series('scripts', 'copy'));
