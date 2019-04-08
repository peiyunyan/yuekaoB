define([], function () {
  'use strict';
  /*利用promise封装的ajax函数*/

  // 格式化post参数的函数    // name=3&age=1
  function formate(data) {
    var str = '';
    for (var key in data) {
      str += key + '=' + data[key] + '&'
    };
    return str.replace(/&$/, '');
  }

  // data.forEach(val=>{
  //   if(!obj[val[type]]){
  //     obj[val[type]]=[];
  //   }
  //   obj[val[type]].push(val)
  // })

  function ajax(opt) {
    // 默认参数
    var defaults = {
      method: 'get',
      url: '',
      data: {},
      async: true
    }
    // 传入参数进行合并
    var opts = Object.assign({}, defaults, opt);

    // 请求数据主体
    var xml = new XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")
    return new Promise(function (resolve, reject) {
      xml.onreadystatechange = function () {
        if (xml.readyState === 4) {
          if (xml.status === 200) {
            resolve(JSON.parse(xml.response));
          } else {
            reject(xml.status);
          }
        }
      };


      // 请求方式区分
      if (opts.method === "get") {
        xml.open("get", opts.url + "?" + formate(opts.data), opts.async);
        xml.send(null);
      } else if (opts.method === "post") {
        xml.open("post", opts.url, opts.async);
        xml.responseType = "json";
        xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xml.send(formate(opts.data));
      }
    });
  };

  return ajax

  	// 		let text = price.innerHTML;
	// 		let num = this.innerHTML;
  // 		let target = e.target;
  
	// 			price.innerHTML = text.slice(0, -1);
	// 			if (price.innerHTML === '') {
	// 				price.innerHTML = '0.00';
	// 			}


	// 			if (text == '0.00') {
	// 				price.innerHTML = '';
	// 			}
	// 			if (num === '.') {
	// 				if (!text.includes('.')) {
	// 					price.innerHTML += num;
	// 				}
	// 			} else {
	// 				let newText = price.innerHTML
	// 				let idx = newText.indexOf('.');
	// 				if (idx > -1 && newText.slice(newText.indexOf('.') + 1).length >= 2) {
	// 					return;
	// 				}
	// 				price.innerHTML += num;
	// 			}
	// 		}
	// 	})

  
  //  var url='https://denterpriseapi.coolcollege.cn/course/queryCourseByPage'
  //  //开始调用接口
  //  ajax('get',url,obj).then(function(data){
  //    console.log(data)
  //  }).catch(function(err){
  //    console.log(err)
  //  })

});