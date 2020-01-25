const gulp = require('gulp');

gulp.task('default', () => {
  return gulp.src(
    ['./src/**/*.html', './src/**/*.template', './src/**/*.css',
      './src/**/*.js'],
    {base: 'src'}
  )
  .pipe(gulp.dest('./out'));
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.html', gulp.task('default'));
  gulp.watch('./src/**/*.template', gulp.task('default'));
  gulp.watch('./src/**/*.css', gulp.task('default'));
  gulp.watch('./src/**/*.js', gulp.task('default'));
});
