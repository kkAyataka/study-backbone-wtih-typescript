const gulp = require('gulp');

gulp.task('default', () => {
  return gulp.src(
    ['./src/**/*.html', './src/**/*.template', './src/**/*.css',
      './src/**/*.js',],
    {base: 'src'}
  )
  .pipe(gulp.dest('./out'));
});
