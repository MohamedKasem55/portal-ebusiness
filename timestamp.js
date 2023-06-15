const headerComment = require('gulp-header-comment');
const gulp = require('gulp');
const d = new Date();
const package1 = require("./package.json");
const buildVersion = package1.version;
/* const info = require('svn-info').sync(); 
const revisionVersion = info.revision;*/
console.log(`Generated version: ${buildVersion}-${d} `);
/* Inject into build */
gulp.src('./dist/*.js')
.pipe(headerComment(`Generated version: v${buildVersion}
Generated on: 	${d}`))
.pipe(gulp.dest('./dist'));

