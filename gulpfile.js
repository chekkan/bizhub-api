const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

gulp.task('swagger', () => {
    gulp.src('./api/swagger/swagger.yaml')
        .pipe(gulp.dest('./public'));
});

const jsFiles = ['*.js', 'app/**/*.js'];
const swaggerFiles = ['./api/swagger/swagger.yaml'];

gulp.task('lint', () =>
    gulp.src(jsFiles)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
);

gulp.task('serve', ['swagger', 'lint'], (cb) => {
    let started = false;
    const options = {
        script: 'app.js',
        delayTime: 1,
        env: {
            PORT: 5000
        },
        watch: [jsFiles, swaggerFiles],
        tasks: ['swagger', 'lint']
    };
    return nodemon(options)
        .on('start', () => {
            // to avoid nodemon being started multiple times
            // thanks @matthisk
            if (!started) {
                cb();
                started = true;
            }
        });
});
