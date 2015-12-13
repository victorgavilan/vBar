function vBar(a){if(this.node=document.querySelector(a.node),!this.node)return void console.log("Can't find the bar's container node. Are you sure it exist?");switch(this.nextStep=function(){this.currentStep++},this.prevStep=function(){this.currentStep--},this.onComplete=a.onComplete,this.onChange=a.onChange,this.colors=a.colors||["#44F"],this.striped=a.striped||!1,this.totalSteps=a.totalSteps||1,this.currentStep=a.currentStep||1,this.borderColor=a.borderColor||"#bbb",this.showBorder=a.showBorder||!1,this.borderRadius=a.borderRadius||5,this.barHeight=a.barHeight||"4",this.showText=a.showText||!1,this.textPosition=a.textPosition||vBar.TEXTPOS_MIDDLE_CENTER,this.textPadding=a.textPadding||2,this.textPendingPercentage=a.textPendingPercentage||!1,this.beforeText=a.beforeText||"",this.afterText=a.afterText||"",this.textColors=a.textColors||["black","white"],this.textSize=a.textSize||"1em","number"==typeof this.textSize&&(this.textSize+="px"),this.textPosition){case vBar.TEXTPOS_TOP_LEFT:this._textPosition="padding: "+this.textPadding+"px 0px; text-align: left; bottom:"+this.barHeight+"px";break;case vBar.TEXTPOS_TOP_CENTER:this._textPosition="padding: "+this.textPadding+"px 0px; text-align: center; bottom:"+this.barHeight+"px";break;case vBar.TEXTPOS_TOP_RIGHT:this._textPosition="padding: "+this.textPadding+"px 0px; text-align: right; bottom:"+this.barHeight+"px";break;case vBar.TEXTPOS_MIDDLE_LEFT:this._textPosition="padding: "+this.textPadding+"px 0px; text-align: left; top: 0px";break;case vBar.TEXTPOS_MIDDLE_CENTER:this._textPosition="padding: "+this.textPadding+"px 0px; text-align: center; top: 0px";break;case vBar.TEXTPOS_MIDDLE_RIGHT:this._textPosition="padding: "+this.textPadding+"px 0px; text-align: right; top: 0px";break;case vBar.TEXTPOS_BOTTOM_LEFT:this._textPosition="padding: "+this.textPadding+"px 0px; text-align: left; top:"+this.barHeight+"px";break;case vBar.TEXTPOS_BOTTOM_CENTER:this._textPosition="padding: "+this.textPadding+"px 0px; text-align: center; top:"+this.barHeight+"px";break;case vBar.TEXTPOS_BOTTOM_RIGHT:this._textPosition="padding: "+this.textPadding+"px 0px; text-align: right; top:"+this.barHeight+"px"}this.node.style.background=a.background||"transparent",this._barNode=null,this._currentPercentage=null,this._currentTextColor=this.textColors[0];var b=a.behavior||"progressbar";this.setBehavior(b),this.initBehavior(a);var c=a.plugin||"solid";this.setPlugin(c)}vBar.prototype.destroy=function(){this.destroyPlugin(),this.destroyBehavior(),this.node.removeChild(this.node.querySelector(".vbar-wrapper"))},vBar.prototype.getBar=function(){return this._barNode||(this._barNode=this.node.querySelector(".vbar-content")),this._barNode},vBar.prototype.getPercentage=function(){var a=this.getPercentageBehavior();if(this.totalSteps<=1)return Math.round(100*a);var b=1/this.totalSteps,c=a*b,d=(this.currentStep-1)*b;return Math.round(d+100*c)},vBar.prototype.setPlugin=function(a){if(a=a.toLowerCase(),!(a in vBar.plugins))throw new Error('There is not any "'+a+'" plugin registered');this.destroyPlugin(),this.contentPlugin=vBar.plugins[a].content?vBar.plugins[a].content:null,this.initPlugin=vBar.plugins[a].init?vBar.plugins[a].init:vBar.plugins.solid.init,vBar.plugins[a].update&&(this.updatePlugin=vBar.plugins[a].update),this.destroyPlugin=vBar.plugins[a].destroy?vBar.plugins[a].destroy:vBar.util.noop},vBar.prototype.setBehavior=function(a){if(a=a.toLowerCase(),!(a in vBar.behaviors))throw new Error('There is not any "'+a+'" behavior registered');this.initBehavior=vBar.behaviors[a].init?vBar.behaviors[a].init:vBar.util.noop,this.destroyBehavior=vBar.behaviors[a].destroy?vBar.behaviors[a].destroy:vBar.util.noop,this.getPercentageBehavior=vBar.behaviors[a].percentage?vBar.behaviors[a].percentage:vBar.util.noop},vBar.prototype._update=function(){var a=this.getBar(),b=this.getPercentage();if(b!==this._currentPercentage&&(this._currentPercentage=b,this.onChange&&"function"==typeof this.onChange&&this.onChange(b),b>=100&&this.onComplete&&"function"==typeof this.onComplete&&this.onComplete(),this.updatePlugin({bar:a,percentage:b}),this.showText)){var c=this.node.querySelector("span.text"),d=this.textPendingPercentage?100-b:b;d=" "+d+"% ",c.textContent=this.beforeText+d+this.afterText,b>50?this._currentTextColor!=this.textColors[1]&&(c.style.color=this.textColors[1],this._currentTextColor=this.textColors[1]):this._currentTextColor!=this.textColors[0]&&(c.style.color=this.textColors[0],this._currentTextColor=this.textColors[0])}},vBar.prototype.render=function(){var a,b,c,d,e,f="",g=this.showBorder?"border: 1px solid "+this.borderColor+"; border-radius:"+this.borderRadius+"px;":"";b='<div class="vbar-wrapper" style="position: relative; height: '+this.barHeight+'px;">',a='<div class="vbar" style="position: relative; height: 100%; width:100%; overflow: hidden; '+g+'">',c='<div class="vbar-content" style="height: 100%; overflow: hidden;transition: all 0.5s;">',d=this.showText?'<span class="text" style="position: absolute; transition: color 0.5s; '+this._textPosition+"; font-weight: bold; display:block; left: 0px; width:"+this.node.offsetWidth+"px; font-size: "+this.textSize+"; color: "+this._currentTextColor+'"></span>':"",this.contentPlugin&&(f="function"==typeof this.contentPlugin?this.contentPlugin():this.contentPlugin),e=b+a+c+f+"</div></div>"+d+"</div>",this.node.innerHTML=e,this.initPlugin(),this._update(),this.render=function(){console.log("Render can only be called once")}},vBar.util={},vBar.util.hasClass=function(a,b){for(var c=a.className.replace(/\s+/g," ").split(" "),d=0;d<c.length;d++)if(c[d]===b)return!0;return!1},vBar.util.allowedField=function(a){var b=a.type;return"button"!=b&&"submit"!=b&&"checkbox"!=b&&"hidden"!=b&&!vBar.util.hasClass(a,"ignore")},vBar.util.noop=function(){},vBar.plugins={},vBar.behaviors={},vBar.TEXTPOS_TOP_RIGHT=10,vBar.TEXTPOS_TOP_CENTER=11,vBar.TEXTPOS_TOP_LEFT=12,vBar.TEXTPOS_MIDDLE_RIGHT=0,vBar.TEXTPOS_MIDDLE_CENTER=1,vBar.TEXTPOS_MIDDLE_LEFT=2,vBar.TEXTPOS_BOTTOM_RIGHT=-1,vBar.TEXTPOS_BOTTOM_CENTER=-2,vBar.TEXTPOS_BOTTOM_LEFT=-3,vBar.prototype.destroyPlugin=vBar.util.noop,vBar.prototype.initPlugin=vBar.util.noop,vBar.prototype.contentPlugin=null,vBar.prototype.updatePlugin=function(a){a.bar.style.width=a.percentage+"%"},vBar.prototype.initBehavior=vBar.util.noop,vBar.prototype.destroyBehavior=vBar.util.noop,vBar.prototype.getPercentageBehavior=vBar.util.noop;;vBar.plugins.merge={content:'<div class="mask"></div>',init:function(){var a=this.getBar(),b=a.querySelector("div.mask");a.style.background=this.colors[0],this.striped&&(a.style.backgroundImage="repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0.30) 10px, transparent 10px, transparent 20px, rgba(0, 0, 0, 0.20) 20px)"),a.style.textAlign="center",a.style.width="100%",b.style.background=this.colors[1],b.style.width="100%",b.style.height=this.barHeight+"px",b.style.margin="auto",b.style.transition="width 1s"},update:function(){var a=this.getBar(),b=a.querySelector("div.mask"),c=this.getPercentage();b.style.width=100-c+"%"}};;vBar.behaviors.formbar={init:function(a){this.formNode=document.querySelector(a.formNode)||document.body,this._formElements=[],this.handleEvent=function(a){vBar.util.allowedField(a.target)&&this._update()},this.formNode.addEventListener("input",this);for(var b=this.formNode.querySelectorAll("input, textarea, select"),c=0;c<b.length;c++)vBar.util.allowedField(b[c])&&this._formElements.push(b[c])},destroy:function(){this.formNode.removeEventListener("input",this),delete this._formElements,delete this.handleEvent},percentage:function(){for(var a=0,b=0;b<this._formElements.length;b++)this._formElements[b].value.length&&a++;return a/this._formElements.length}};