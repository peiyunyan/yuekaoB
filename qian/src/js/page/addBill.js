define(['mui'], function(mui) {
	let type = ""
	const yes = document.querySelector('#yes');
	const list = document.querySelector('.mui-table-view.mui-table-view-radio');
	function init() {
		mui.init();
		list.addEventListener('selected', function(e) {
			type = e.detail.el.innerText
		})
	}
	
	// 获取所有数据
	yes.addEventListener('tap', function() {
		let parmes = {}
		parmes.name = document.querySelector('.name').value;
		parmes.price = document.querySelector('.price').value;
		parmes.num = document.querySelector('.num').value;
		parmes.zhong = document.querySelector('.zhong').value;
		parmes.color = document.querySelector('.color').value;
		parmes.type = type
		parmes.height = (Math.random()*(200-100+1) +100).toFixed(2)
		console.log(parmes);
		addData(parmes)
	})
	// ajax添加数据到后台
	function addData(parmes) {
		mui.ajax('/api/addList', {
			data: parmes,
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				console.log(data);
			},
		});
	}
	init()

})
