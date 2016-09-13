/**********************************************************************/
/*************************functions************************************/




//按照id获取docObject 或docObjectQuery
function O(id)
{

   if (typeof id == 'object') return id
   else
   {
		if(document.querySelector){return document.querySelector('#'+id);}
			else{
				return document.getElementById(id);
			}
   }
}


//获取界面长宽
function GetWindowWidth()
{
   var de = document.documentElement

   if (!document.all)
   {
      var barwidth = de.scrollHeight > de.clientHeight ? 17 : 0
      return window.innerWidth - barwidth
   }

   return de.clientWidth || document.body.clientWidth
}

function GetWindowHeight()
{
   var de = document.documentElement

   if (!document.all)
   {
      var barwidth = de.scrollWidth > de.clientWidth ? 17 : 0
      return window.innerHeight - barwidth
   }

   return de.clientHeight || document.body.clientHeight;
}

//增加css规则
function insertRule(sheet,selectorText,cssText,position){
	if(sheet.insertRule){
		sheet.insertRule(selectorText+"{"+cssText+"}",position);
	}else if(sheet.addRule){
		sheet.addRule(selectiorText,cssText,position);
	}
}
//绑定function, 以context的环境运行fn
function bind(fn,context){
	return function(){
		return fn.apply(context,arguments);
		};
}

//正序或反序查找element
function searchI(s,p,index,converse){
	var length = s.length;
	if(converse==true){
		for(index;index>=0;index--){
			if(s[index] == p){
				return index;
			}
		}
	}else{
		for(index;index<length;index++){
			if(s[index] == p){
				return index;
			}
		}
	}	
}

//提供将serverString变成objectString方法
//字符串例子：（空格不能省） var obstacles="<div class=obs style=visibility:hidden></div>"
function objConstructer(objString){
	this.string = objString;
	this.constructer = function(n){
		var obj = new Object;
		obj.children = new Array;
		var guard = null;
		var i = this.string.indexOf('></');
		var i1 = i, i2=i;
		while(i1 > n){
			/*if( i == -1){
				var t = new Object;
				t = obj.children[obj.children.length-1];
				obj.children[obj.children.length-1]=null;
				for( var j=t.children.length ; j>=0; ){
					t.children[j] = t.children[--j];
				}
				t.children[0] = obj;
				obj = t;
				t = null;
				break;
			}*/
			i = this.string.indexOf('></');
			i1 = searchI(this.string,'<',i,true);
			i2 = searchI(this.string,'>',i+3,false);
			if(guard == null){
				obj.children[obj.children.length]=this.string.substring(i1,i2+1);
				this.string = this.string.slice(0,i1) + this.string.slice(i2+1);
			}
			else if(guard == i1){
				if(obj.text){
					var t= new Object;
					t.children = new Array;
					t.children[t.children.length]=obj;
					obj = t;
					t = null;
				}
				obj.children[obj.children.length]=this.string.substring(i1,i2+1);
				this.string = this.string.slice(0,i1) + this.string.slice(i2+1);
			}
			else if(guard >i1){
				if(obj.text){
					var t= new Object;
					t.children = new Array;
					t.children[t.children.length]=obj;
					obj = t;
					t = null;
				}
				obj.text = this.string.substring(i1,i2+1);
				this.string = this.string.slice(0,i1) + this.string.slice(i2+1);
			}
			else {
				if(obj.text)
				{
					var t = new Object;
					t.children = new Array;
					t.children[t.children.length] = obj;
					obj = t;
					t = null;
				}
				obj.children[obj.children.length] = this.constructer(guard);
				continue;
			}
			guard = i1;
		}//while
		return obj;
	}
	return this.constructer(0);
}
//输入objConstructor返回的object，并转化为domobject
//usage: var obstacleObject = DomCreater(objConstructer(obstacles));
function DomCreater(t){
		var o = new Object;
		if(t.text){
			o=createElement(t.text);
		}
		if(t.children){
			for( var i=0; i<t.children.length; i++){
				if(typeof(t.children[i]) =='string'){
					try{
						o.appendChild(createElement(t.children[i]));
					}catch(e){
						o = createElement(t.children[i]);
					}
				}else if(t.children[i]!=null){
					o.appendChild(DomCreater(t.children[i]));
				}
			}
		}
		return o;
}

//返回构造单个DomElement的字符串或类型使其能在各种浏览器下有兼容性
function createElement(str){
        if (document.all){
			user_agent = navigator.userAgent.toLowerCase();
			if((user_agent.indexOf("msie 8.0")>-1)||(user_agent.indexOf("msie 7.0")>-1)||(user_agent.indexOf("msie 6.0")>-1)) {
                return document.createElement(str);
            }
			
		}
		var sub = str.slice(1,str.indexOf(' '));
		var o = document.createElement(sub);
		str = str.slice(str.indexOf(' ')+1,str.indexOf('>'));
		if(str.indexOf(' ') == -1){
			var item = str.split('=');
			if(item[1]){
				o.setAttribute(item[0],item[1]);
			}
			return o;
		}
		str = str.split(' ');
		for(var i in str){
			var item = str[i].split('=');
			if(item.length==2){o.setAttribute(item[0],item[1]);}
		}
		return o;
}

//将构造好的domObject加入Document,并返回node节点
//usage addObject(obstacleObject)
function addObject(domObj){
	var o = domObj.cloneNode(true);
	document.body.appendChild(o);
	return o;
}

//从php脚本获取的DomString
function getDom(s){
	var queryXhr = new XMLHttpRequest();
	var url = "http://gantz.me/"+s+".php";
	try{
		queryXhr.open('get',url,false);
		queryXhr.send(null);
		return queryXhr.responseText;
	}catch(e){
		return false;
	}
}

//通过string来构造脚本，已达到保密效果，并用callback触发之后进程
function require(s,callback){
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = s;
	var head = document.getElementsByTagName('head').item(0);
	head.appendChild (script);
	if (script.readyState)
	{
		script.onreadystatechange = function()
		{
			if (script.readyState == 'loaded' || script.readyState == 'complete')
			{
				script.onreadystatechange = null;
				if(callback){
					callback();
				}
			}
		}
	}else{
		script.onload = function(){
			script.onload=null;
			if(callback){callback();}
		}
	}
}

/***************************end of function****************************/
/**********************************************************************/

/*funciton may not using in the script
//取得DocObject的子Object/element
function toSub(obj,d){
	for(var i=0; i<d; i++){
		if(obj.children.length!=0){
			obj= obj.children;
		}else{return false;}
	}
	return obj;
}

//查找css中的style element
function getElementStyle(el){
	var sList = document.styleSheets[0];
	var rule = sList.cssRules||sList.rules;
	for(var i in rule){
		if(rule[i].selectorText == 'div.'+el.className){
			return rule[i].style;
		}
	}
}

//定时器
function throttle(method,context){
	clearTimeout(method.pid);
	method.pid=setTimeout(function(){
		method.call(context);
		},900);
}

//获取docObject坐标x，y
function X(obj)
{
   var offset = obj.style.left;
   

   return parseFloat(offset);
}

function Y(obj)
{
   var offset = obj.style.top; 
   //obj.offsetTop

   //if (obj.offsetParent)
      //while(obj = obj.offsetParent)
         //offset += obj.offsetTop
   return parseFloat(offset);
}

//docObject移动
function GoTo(obj, cos, sin,speed)
{
   var x=parseFloat(obj.style.left);
   var y=parseFloat(obj.style.top);
   x += cos*speed;
   y += sin*speed;
   if(x>=0 && x<=90){
		if(y>0 && y<=70){
			obj.style.left = x+'%';
			obj.style.top= y+'%';
		}
	}
}

//docObject显隐
function show(obj,n,v)
{
	obj.children[n].children[0].style.visibility=v;
}
function trans(obj,n,c)
{
	try{
		obj.children[n].children[0].filters.alpha.opacity=c;
		obj.children[n].children[0].style.opacity=c/100;
	}catch
	(e){}
}

//docObject动态显隐
function switchTo(obj,ori,swi)
{
	obj.children[ori].children[0].style.visibility="hidden";
	obj.children[swi].children[0].style.visibility="visible";
}


//判断是否在攻击者攻击范围中（dom实现)
 function inAtkRange(atker,batker) {
	var ax=atker.Offset.x+parseFloat(atker.style.left);
	var ax1= ax+atker.atkRange.x;
	var ay=atker.Offset.y+parseFloat(atker.style.top);
	var ay1= ay+atker.atkRange.y;
	var bx=batker.Offset.x+parseFloat(batker.style.left);
	var bx1=bx+batker.bAtkRange.x;
	var by=batker.Offset.y+parseFloat(batker.style.top);
	var by1=by+batker.bAtkRange.y;
    if(bx<= ax){
		ax= bx1-ax;
		}else{
		ax= ax1-bx;
		}
	if(by<= ay){
		ay= by1-ay;
		}else{
		ay= ay1-by;
		}
	if(ax>0 && ay>0)
	{
		return (ax*ay)/(batker.bAtkRange.x*batker.bAtkRange.y);
	}
	return -1;
}  

//判断是否在直线运动的位置上（dom判断)
function inShooterLine(atker,batker,lineLoca){
	var x=atker.atkRange.x/2+parseFloat(atker.obj.style.left);
	var y=atker.atkRange.y/2+parseFloat(atker.obj.style.top);
	var x1,y1,x2,y2,coa,cob,coc;
	if(x < parseFloat(batker.obj.style.left))
	{
		if(lineLoca.x<x){
			return false;
		}
		x1=parseFloat(bakter.obj.style.left);
		y1=parseFloat(batker.obj.style.top);
		x2=x1+batker.atkRange.x;
		y2=y1+bakter.atkRange.y;
		coa=(y1-y)/(x1-x);
		cob=(lineLoca.y-y)/(lineLoca.x-x);
		cac=(y2-y)/(x2-x);
		if(coa<=cob && cob<=coc)
		{
			return true;
		}
	}else{
		if(lineLoca.x>x){
			return false;
		}
		x1=parseFloat(bakter.obj.style.left);
		y1=parseFloat(batker.obj.style.top);
		x2=x1+batker.atkRange.x;
		y2=y1+bakter.atkRange.y;
		coa=(y1-y)/(x1-x);
		cob=(lineLoca.y-y)/(lineLoca.x-x);
		cac=(y2-y)/(x2-x);
		if(coa<=cob && cob<=coc)
		{
			return true;
		}
	}
	return true;
}

//改变子object的宽度
function changeChildrenSize(obj,t,d){
	var a=toSub(obj,d);
	var b=1;
	if(!a){return ;}
	for(var i=0; i< a.length; i++){
		a[i].style.width=t;
	}
}

//返回构造单个DomElement的字符串或类型使其能在各种浏览器下有兼容性
//字符串例子：（空格不能省） var obstacles="<div class=obs style=visibility:hidden></div>"
function createElement(str){
        if (document.all) return document.createElement(str);
		var sub = str.slice(1,str.indexOf(' '));
		var o = document.createElement(sub);
		str = str.slice(str.indexOf(' ')+1,str.indexOf('>'));
		if(str.indexOf(' ') == -1){
			var item = str.split('=');
			if(item[1]){
				o.setAttribute(item[0],item[1]);
			}
			return o;
		}
		str = str.split(' ');
		for(var i in str){
			var item = str[i].split('=');
			if(item.length==2){o.setAttribute(item[0],item[1]);}
		}
		return o;
}


*/

