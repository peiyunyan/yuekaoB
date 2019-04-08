var express = require('express');
var router = express.Router();
var Mongo = require('Mongodb-curd');
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

router.get('/api/list', function(req, res, next) {
	let {
		page,
		pageSize
	} = req.query;
	pageSize = pageSize * 1;
	page = (page - 1) * pageSize;
	Mongo.find('user', "ybB", function(rs) {
		let total = Math.ceil(rs.length / pageSize);
		Mongo.find('user', "ybB", function(result) {
			if (!result) {
				res.send({
					code: 0,
					mes: "error"
				})
			} else {
				res.send({
					code: 1,
					mes: "success",
					data: result,
					total :total
				})
			}
		}, {
			skip: page,
			limit: pageSize,
			sort : {time : -1}
		})
	})
});

router.post('/api/addList', function(req, res, next) {
	let {
		name,
		price,
		type
	} = req.body;
	if (!name || !price || !type) {
		res.send({
			code: 3,
			msg: '参数不完整'
		})
	}
	console.log(req.body);
	req.body.time = new Date()
	console.log(req.body);
	Mongo.insert('user', 'ybB', req.body, function(result) {
		if (!result) {
			res.send({
				code: 0,
				msg: 'error'
			})
		} else {
			res.send({
				code: 1,
				data: result
			})
		}
	})


});


module.exports = router;
