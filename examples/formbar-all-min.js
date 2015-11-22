function FormBar(a){if(this.node=document.querySelector(a.node),!this.node)return void console.log("Can't find the bar's container node. �Are you sure it exist?");this.nextStep=function(){this.currentStep+=1},this.onComplete=a.onComplete,this.onChange=a.onChange,this.formNode=document.querySelector(a.formNode)||document.body,this.colors=a.colors||["#44F"],this.totalSteps=a.totalSteps||1,this.currentStep=a.currentStep||1,this.borderColor=a.borderColor||"#bbb",this.showBorder=a.showBorder||!1,this.showText=a.showText||!1,this.textColors=a.textColors||["black","white"],this.textSize=a.textSize||"1em","number"==typeof this.textSize&&(this.textSize+="px"),this.textTop=a.textTop||"5px","number"==typeof this.textTop&&(this.textTop+="px"),a.barHeight&&"number"==typeof a.barHeight&&(a.barHeight+="px"),this.barHeight=a.barHeight||"4px",this.node.style.background=a.background||"transparent",this._barNode=null,this._currentPercentage=null,this._currentTextColor=this.textColors[0],this._formElements=[],this._formBar=a.formBar||!0;var b=a.plugin||"solid";if(this.setPlugin(b),this._formBar){this.formNode.addEventListener("input",this);for(var c=this.formNode.querySelectorAll("input, textarea, select"),d=0;d<c.length;d++)FormBar.util.allowedField(c[d])&&this._formElements.push(c[d])}}FormBar.prototype.destroy=function(){this._formBar&&this.formNode.removeEventListener("input",this),this.node.removeChild(this.node.firstChild)},FormBar.prototype.getBar=function(){return this._barNode||(this._barNode=this.node.querySelector(".fpbar")),this._barNode},FormBar.prototype.getCompletePercentage=function(){for(var a=0,b=0;b<this._formElements.length;b++)this._formElements[b].value.length&&a++;return a/this._formElements.length},FormBar.prototype.getPercentage=function(){var a=this.getCompletePercentage();if(this.totalSteps<=1)return Math.round(100*a);var b=1/this.totalSteps,c=a*b,d=(this.currentStep-1)*b;return Math.round(d+100*c)},FormBar.prototype.handleEvent=function(a){FormBar.util.allowedField(a.target)&&this._update()},FormBar.prototype.setPlugin=function(a){a=a.toLowerCase(),a in FormBar.plugins?(this.content=FormBar.plugins[a].content?FormBar.plugins[a].content:null,this.initPlugin=FormBar.plugins[a].init?FormBar.plugins[a].init:null,this.updatePlugin=FormBar.plugins[a].update?FormBar.plugins[a].update:null):console.log('There is not any "'+a+'"plugin registered')},FormBar.prototype._update=function(){var a=this.getBar(),b=this.getPercentage();if(b!==this._currentPercentage){if(this._currentPercentage=b,this.updatePlugin?this.updatePlugin():a.style.width=b+"%",this.showText){var c=this.node.querySelector("span.text");c.textContent=b+"%",b>50?this._currentTextColor!=this.textColors[1]&&(c.style.color=this.textColors[1],this._currentTextColor=this.textColors[1]):this._currentTextColor!=this.textColors[0]&&(c.style.color=this.textColors[0],this._currentTextColor=this.textColors[0])}this.onChange&&"function"==typeof this.onChange&&this.onChange(b),b>=100&&this.onComplete&&"function"==typeof this.onComplete&&this.onComplete()}},FormBar.prototype.render=function(){var a,b="",c=this.showText?'<span class="text" style="position: absolute; transition: color 0.5s; top:'+this.textTop+"; font-weight: bold; display:block; left: 0px; text-align: center; width:"+this.node.offsetWidth+"px; font-size: "+this.textSize+"; color: "+this._currentTextColor+'"></span>':"";this.content&&(b="function"==typeof this.content?this.content():this.content),a='<div class="fpbar" style="position: relative; height:'+this.barHeight+'; transition: all 1s; width: 0px; overflow: hidden">'+b+"</div>"+c,this.node.style.position="relative",this.showBorder&&(this.node.style.border="1px solid "+this.borderColor),this.node.innerHTML=a,this.initPlugin&&this.initPlugin(),this._update()},FormBar.util={},FormBar.util.hasClass=function(a,b){for(var c=a.className.replace(/\s+/g," ").split(" "),d=0;d<c.length;d++)if(c[d]===b)return!0;return!1},FormBar.util.allowedField=function(a){var b=a.type;return"button"!=b&&"submit"!=b&&"checkbox"!=b&&"hidden"!=b&&!FormBar.util.hasClass(a,"ignore")},FormBar.plugins=new Object,FormBar.plugins.solid={init:function(){var a=this.getBar();a.style.background=this.colors[0]}};;FormBar.plugins.chameleon={init:function(){var a=this.getBar();a.style.background=this.colors[0]},update:function a(){a._currentColor=null;var b=this.getBar(),c=this.getPercentage(),d=0===c?0:Math.round(c/100*this.colors.length-1);b.style.width=c+"%",a._currentColor!=d&&(a._currentColor=d,b.style.background=this.colors[bgColor])}};;FormBar.plugins.dashed={init:function(){var a=this.getBar();a.style.borderColor=this.colors[0]+" transparent transparent transparent",a.style.borderWidth=this.barHeight+" 0px 0px 0px",a.style.borderStyle="dashed",a.style.height=0}};;FormBar.plugins.dotted={init:function(){var a=this.getBar();a.style.borderColor=this.colors[0]+" transparent transparent transparent",a.style.borderWidth=this.barHeight+" 0px 0px 0px",a.style.borderStyle="dotted",a.style.height=0}};;FormBar.plugins.gradient={init:function(){var a=this.getBar(),b="linear-gradient( to right, "+this.colors[0]+", "+this.colors[1]+")";a.style.background=b}};;FormBar.plugins.merge={content:'<div class="mask"></div>',init:function(){var a=this.getBar(),b=a.querySelector("div.mask");a.style.background=this.colors[0],a.style.textAlign="center",a.style.width="100%",b.style.background=this.colors[1],b.style.width="100%",b.style.height=this.barHeight,b.style.margin="auto",b.style.transition="width 1s"},update:function(){var a=this.getBar(),b=a.querySelector("div.mask"),c=this.getPercentage();b.style.width=100-c+"%"}};;FormBar.plugins.sections={content:function(){for(var a=this.node.offsetWidth/this.colors.length,b='<div style="position: relative">',c=0;c<this.colors.length;++c)b+='<span style="display: inline-block; position: absolute; top: 0; left: '+a*c+"px; background: "+this.colors[c]+"; height: "+this.barHeight+"; width: "+a+'px"></span>';return b+="</div>"}};