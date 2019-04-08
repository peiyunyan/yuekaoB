var gulp = require('gulp');
var server = require('gulp-webserver');

gulp.task('server',function() {
	return gulp.src('./src')
	.pipe(server({
		port : 8585,
		open : true,
		proxies : [
			{source : '/api/list' , target : "http://localhost:3000/api/list"},
			{source : '/api/addList' , target : "http://localhost:3000/api/addList"}
		]
	}))
})