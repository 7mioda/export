const { src, dest } = require('gulp');
const babel = require('gulp-babel');

function build() {
  return src('src/*.js')
    .pipe(babel({
      presets: ['@babel/env'],
    }))
    .pipe(dest('dist'));
}

module.exports = {
  build,
};
