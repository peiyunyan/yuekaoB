define(["mui","BScroll"],function(mui,BS) {
	let page = 1,pageSize = 10,total;
	const list = [...document.querySelectorAll('.list')];
	const pull = document.querySelector('#pull')
	const addBill = document.querySelector('#addBill');
	// 初始化
	function init() {
		mui.init();
		getData(page)
	}
	
	// 点击条页面
	addBill.addEventListener('tap',function() {
		window.location.href = "../../html/addBill.html";
	})
	
	let bs = new BS('.scroll',{
		probeType : 2,
		scrollY : true
	})
	bs.on('scroll',function() {
		if(this.y < this.maxScrollY - 40) {
			pull.classList.add('addData');
			pull.innerHTML = '加载中。。。'
		} else {
			pull.innerHTML = '上拉加载'
		}
	})
	
	bs.on('scrollEnd',function() {
		if(pull.classList.contains('addData')) {
			pull.classList.remove('addData');
			addData()
		}
	})
	
	function addData() {
		console.log(page,total);
		if(page < total) {
			page ++
			getData(page)
		} else {
			mui.alert('数据加载完成')
		}
	}
	
	//获取数据
	function getData(page) {
		mui.ajax('/api/list',{
			data:{
				page : page,
				pageSize : pageSize
			},
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log(data);
				format(data.data)
				total = data.total;
			},
		});
	}
	// 处理数据
	function format(data) {
		let arr = []
		arr[0] = []
		arr[1]= []
		data.map((item,ind) => {
			if(arr[0].length == 0) {
				arr[0].push(item)
				return
			} else if(arr[1].length == 0){
				arr[1].push(item)
				return
			}
			
			if(arr[0].reduce((v,l) => v + l.height * 1,0) < arr[1].reduce((v,l) => v + l.height * 1,0)) {
				arr[0].push(item)
			} else {
				arr[1].push(item)
			}
			return arr;
		}).join('')
		console.log(arr);
		render(arr);
	}
	// 渲染数据
	function render(data) {
		list.forEach((item,val) => {
			item.innerHTML += data[val].map((i,v) => {
				return `
					<div class="mui-card">
						<!--内容区-->
						<div class="mui-card-content">
							<img src="image/pic4.png" alt="" style="height : ${i.height}px">
						</div>
						<!--页脚，放置补充信息或支持的操作-->
						<div class="mui-card-footer">
							<span>${i.name}</span>
							<span class="${i.type == '供应' ? "red" : "yell"}">${i.type}</span>
						</div>
					</div>
				`
			}).join('')
		})
		bs.refresh()
	}
	init()
})