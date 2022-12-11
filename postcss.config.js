var fs = require('fs');
var postcss = require('postcss');
var sprites = require('postcss-sprites');

var css = fs.readFileSync('./css/style.css', 'utf8');
var opts = {
	stylesheetPath: './dist',
	spritePath: './dist/images/'
};

postcss([sprites(opts)])
	.process(css, {
		from: './css/style.css',
		to: './dist/style.css'
	})
	.then(function(result) {
		fs.writeFileSync('./dist/style.css', result.css);
	});


// module.exports = {
//   plugins: {
//     'postcss-sprites': {
//       // stylesheetPath: './public/style',
//       spritePath: './dist/images',
//       verbose: true,
//       basePath: './',
//       spritesmith: { padding: 2 },
//       svgsprite: {
//         shape: {
//           spacing: {
//             padding: 2,
//             box: 'padding',
//           },
//         },
//       },
//       // image的路径或者名字中含有sprite关键词的进行合并，否则不合并
//       filterBy (image) {
//         if (/\.gif$/i.test(image.originalUrl)) {
//           return Promise.reject()
//         }
//         if (/images\./.test(image.url)) {
//           return Promise.resolve()
//         }
//         // eslint-disable-next-line prefer-promise-reject-errors
//         return Promise.reject()
//       },

//       // 雪碧图分组，当图片较多的时候使用，通过判断路径和名字中的关键词，resolve不同的名字，reject的为默认名字
//       groupBy (image) {
//         console.log(image.url)
//         if (/images/.test(image.url)) {
//           return Promise.resolve('images')
//         }
//         if (/-page2/.test(image.url)) {
//           return Promise.resolve('page2')
//         }
//         // eslint-disable-next-line prefer-promise-reject-errors
//         return Promise.reject()
//       }
//     },
//     'postcss-px-to-viewport': {
//       viewportWidth: 1660,
//       unitPrecision: 3,
//       selectorBlackList: ['van']
//     }
//   }
// }
