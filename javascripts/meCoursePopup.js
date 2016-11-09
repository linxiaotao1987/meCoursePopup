(function(){
	if(!document.querySelector('html').style['fontSize']){
		setRem(window, window['lib'] || (window['lib'] = {}));
	}
	addCss();
})();


/*设置根元素字体大小*/
function setRem(win, lib) {
	var doc = win.document;
	var docEl = doc.documentElement;
	var metaEl = doc.querySelector('meta[name="viewport"]');
	var flexibleEl = doc.querySelector('meta[name="flexible"]');
	var dpr = 0;
	var scale = 0;
	var tid;
	var flexible = lib.flexible || (lib.flexible = {});

	if (metaEl) {
		console.warn('将根据已有的meta标签来设置缩放比例');
		var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
		if (match) {
			scale = parseFloat(match[1]);
			dpr = parseInt(1 / scale);
		}
	} else if (flexibleEl) {
		var content = flexibleEl.getAttribute('content');
		if (content) {
			var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
			var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
			if (initialDpr) {
				dpr = parseFloat(initialDpr[1]);
				scale = parseFloat((1 / dpr).toFixed(2));
			}
			if (maximumDpr) {
				dpr = parseFloat(maximumDpr[1]);
				scale = parseFloat((1 / dpr).toFixed(2));
			}
		}
	}

	if (!dpr && !scale) {
		//var isIPhone = win.navigator.appVersion.match(/iphone/gi);
		//TODO 紧急修复ios9.3的bug
		var isIOS9_3 =   win.navigator.appVersion.match(/os 9_1/gi);
		var devicePixelRatio = win.devicePixelRatio;

		if(isIOS9_3){
			dpr = 1;
		}else{
			if (devicePixelRatio >= 4 && (!dpr || dpr >= 4)) {
				dpr = 4;
			}
			else if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
				dpr = 3;
			} else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
				dpr = 2;
			} else {
				dpr = 1;
			}
		}
		scale = 1 / dpr;
	}

	docEl.setAttribute('data-dpr', dpr);
	if (!metaEl) {
		metaEl = doc.createElement('meta');
		metaEl.setAttribute('name', 'viewport');
		metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no,width=device-width');
		if (docEl.firstElementChild) {
			docEl.firstElementChild.appendChild(metaEl);
		} else {
			var wrap = doc.createElement('div');
			wrap.appendChild(metaEl);
			doc.write(wrap.innerHTML);
		}
	}

	function refreshRem(){
		var width = docEl.getBoundingClientRect().width;
		if (width / dpr > 540) {
			width = 540 * dpr;
		}
		var rem = width / 10;
		docEl.style.fontSize = rem + 'px';
		flexible.rem = win.rem = rem;
	}

	win.addEventListener('resize', function() {
		clearTimeout(tid);
		tid = setTimeout(refreshRem, 300);
	}, false);
	win.addEventListener('pageshow', function(e) {
		if (e.persisted) {
			clearTimeout(tid);
			tid = setTimeout(refreshRem, 300);
		}
	}, false);

	if (doc.readyState === 'complete') {
		doc.body.style.fontSize = 12 * dpr + 'px';
	} else {
		doc.addEventListener('DOMContentLoaded', function(e) {
			doc.body.style.fontSize = 12 * dpr + 'px';
		}, false);
	}


	refreshRem();

	flexible.dpr = win.dpr = dpr;
	flexible.refreshRem = refreshRem;

	// 给js调用的，某一dpr下rem和px之间的转换函数
	win.rem2px = function (d) {
		var val = parseFloat(d/2) * this.rem;
		if (typeof d === 'string' && d.match(/rem$/)) {
			val += 'px';
		}
		return val;
	};
	win.px2rem = function (d) {
		var val = parseFloat(d/2) / this.rem;
		if (typeof d === 'string' && d.match(/px$/)) {
			val += 'rem';
		}
		return val;
	};

}
/*end*/

/*插入css*/
function addCss() {
	var cssContent = '.cp-course-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}html,body,h1,h2,p{padding:0;margin:0}a{text-decoration:none}body{font:0 "微软雅黑", helvetica, arial}.cp-course-box{position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.95)}.cp-course-name{padding:0 0.4rem;padding-top:0.66667rem;font-size:0.4rem;color:#fff;text-align:center}.cp-popupMainbox{position:relative;margin:0 auto;height:11.14667rem;width:10rem;background:url(\'img/popupbg.png?1478674156\') center no-repeat;background-size:100% auto}.cp-popupMainbox>.starBox{position:absolute;top:5.6rem;left:50%;-webkit-transform:translate(-50%, 0)}.cp-popupMainbox>.starBox>.star{width:1.2rem}.cp-popupMainbox>.cont{position:absolute;top:8.4rem;width:100%;font-size:0.48rem;color:#fabc43;text-align:center}.cp-popupMainbox>.cont+.cont{top:9.06667rem}.cp-buttonbox{display:-webkit-box;-webkit-box-align:center;padding:0 1.33333rem;text-align:center}.cp-buttonbox>.button{display:block;width:0;height:1.37333rem;border:0.04rem solid #4fc68a;-webkit-box-flex:1;background:#31b06c;color:#fff;text-align:center;border-radius:1.37333rem;line-height:1.37333rem;font-size:0.48rem}.cp-buttonbox>.button:not(:last-child){margin-right:0.26667rem}.cp-buttonbox>.button.lection{padding-right:0.4rem;background:url(\'img/page_arrowright.png?1478244282\') no-repeat #31b06c;background-size:0.36rem auto;background-position:-webkit-calc(100% - 10px) 50%}.cp-buttonbox>.button.share{padding-right:0.4rem;background:url(\'img/share-icon.png?1478675755\') no-repeat #31b06c;background-size:0.66667rem auto;background-position:-webkit-calc(100% - 10px) 50%}',
	style = document.createElement('style');
	style.innerHTML = cssContent;
	document.head.appendChild(style);

}
/*end*/

window.meCoursePopup = function(info){
	var _self = this;
	_self.trigger = info.trigger;
	_self.shownow = info.shownow;


	setPopup();

	function setPopup(){
		console.log(_self.trigger);
		if(_self.trigger){
			var trigger = document.querySelector(_self.trigger);
			if(!trigger){
				console.log('未找到对应节点');
				return;
			}
			trigger.addEventListener('click',function(){
				createPopup(info);
			});
		}
		if(_self.shownow) {
			createPopup(info);
		}
	}

	function createPopup(info){
		var popup,courseName,star,cont,button;

		_self.courseName = info.courseName;
		_self.star = info.starAmount;
		_self.cont = info.cont;
		_self.button = info.button;

		if(_self.popup){
			popup = _self.popup;
			popup.style.display = 'block';
		} else {
			popup = createOutbox();
		}


		courseName = createCourseName(_self.courseName);
		star = createStar(_self.star);
		cont = createCont(_self.cont);
		button = createButton(_self.button);


		popup.innerHTML = courseName +
			'<div class="cp-popupMainbox">' +
				'<div class="starBox">' +
					star +
				'</div>' +
					cont +
			'</div>' +
			'<div class="cp-buttonbox">' +
				button +
			'</div>';

		if(!popup.exist) {
			document.querySelector('body').appendChild(popup);
		}
		_self.popup = popup;
		popup.onclick = function(){
			entrust(event);
		}
	}
	function createOutbox(){
		var popup;
		if(document.querySelector('.js-coursePopup')){
			popup = document.querySelector('.js-coursePopup');
			popup.exist = true;
		} else {
			popup = document.createElement('div');
			popup.className = 'cp-course-box js-coursePopup';
			popup.exist = false;
		}
		return popup;
	}
	function createCourseName(courseName){
		var p;
		if(courseName){
			p = '<p class="cp-course-name">' + courseName + '</p>';
			return p;
		} else {
			return '';
		}
	}
	function createStar(starAmout){
		var i = 0,starHtml = '';
		starAmout = parseInt(starAmout);
		for(; i < 3; i++) {
			if(i < starAmout) {
				starHtml += '<img src="img/star.png" class="star"/>';
			} else {
				starHtml += '<img src="img/star_empty.png" class="star"/>';
			}
		}
		return starHtml;
	}
	function createCont(contArr){
		var i = 0,len,contHtml = '';

		if(!contArr){
			return '';
		}

		for(len = contArr.length;i<len;i++){
			contHtml += '<p class="cont">' + contArr[i] + '</p>';
		}

		return contHtml;

	}
	function createButton(buttonArr){
		var buttonHtml = '',item,href='',className = '',callback = '',buttonInfo = '';
		if(!buttonArr) {
			return '';
		}
		for(item in buttonArr) {
			href = className = callback = buttonInfo = '';
			buttonInfo = buttonArr[item];
			if(buttonInfo.link){
				href += 'href="' + buttonInfo.link + '"';
			}
			if(buttonInfo.type){
				className += buttonInfo.type;
			}
			if(buttonInfo.callback){
				callback = 'data-callback="' + item + '"';
			}
			buttonHtml += '<a ' + href + callback +' class="button '+ className + '">' + buttonInfo.value + '</a>';
		}
		return buttonHtml;
	}
	function entrust(event){
		if(event.target.dataset.callback){
			var callbackNumber = parseInt(event.target.dataset.callback);
			_self.button[callbackNumber].callback();
		}
		if(event.target.classList.contains('button')){
			_self.popup.style.display = 'none';
		}
	}
}










