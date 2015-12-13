function vBar(a){if(this.node=document.querySelector(a.node),!this.node)return void console.log("Can't find the bar's container node. Are you sure it exist?");this.nextStep=function(){this.currentStep++},this.prevStep=function(){this.currentStep--},this.onComplete=a.onComplete,this.onChange=a.onChange,this.colors=a.colors||["#44F"],this.totalSteps=a.totalSteps||1,this.currentStep=a.currentStep||1,this.borderColor=a.borderColor||"#bbb",this.showBorder=a.showBorder||!1,this.borderRadius=a.borderRadius||5,this.showText=a.showText||!1,this.textAlign=a.textAlign||"center",this.textPendingPercentage=a.textPendingPercentage||!1,this.beforeText=a.beforeText||"",this.afterText=a.afterText||"",this.textColors=a.textColors||["black","white"],this.textSize=a.textSize||"1em","number"==typeof this.textSize&&(this.textSize+="px"),this.textTop=a.textTop||"5px","number"==typeof this.textTop&&(this.textTop+="px"),a.barHeight&&"number"==typeof a.barHeight&&(a.barHeight+="px"),this.barHeight=a.barHeight||"4px",this.node.style.background=a.background||"transparent",this._barNode=null,this._currentPercentage=null,this._currentTextColor=this.textColors[0];var b=a.behavior||"progressbar";this.setBehavior(b),this.initBehavior(a);var c=a.plugin||"solid";this.setPlugin(c)}vBar.prototype.destroy=function(){this.destroyPlugin(),this.destroyBehavior(),this.node.removeChild(this.node.querySelector(".vbar-wrapper"))},vBar.prototype.getBar=function(){return this._barNode||(this._barNode=this.node.querySelector(".vbar-content")),this._barNode},vBar.prototype.getPercentage=function(){var a=this.getPercentageBehavior();if(this.totalSteps<=1)return Math.round(100*a);var b=1/this.totalSteps,c=a*b,d=(this.currentStep-1)*b;return Math.round(d+100*c)},vBar.prototype.setPlugin=function(a){if(a=a.toLowerCase(),!(a in vBar.plugins))throw new Error('There is not any "'+a+'" plugin registered');this.destroyPlugin(),this.contentPlugin=vBar.plugins[a].content?vBar.plugins[a].content:null,this.initPlugin=vBar.plugins[a].init?vBar.plugins[a].init:vBar.plugins.solid.init,vBar.plugins[a].update&&(this.updatePlugin=vBar.plugins[a].update),this.destroyPlugin=vBar.plugins[a].destroy?vBar.plugins[a].destroy:vBar.util.noop},vBar.prototype.setBehavior=function(a){if(a=a.toLowerCase(),!(a in vBar.behaviors))throw new Error('There is not any "'+a+'" behavior registered');this.initBehavior=vBar.behaviors[a].init?vBar.behaviors[a].init:vBar.util.noop,this.destroyBehavior=vBar.behaviors[a].destroy?vBar.behaviors[a].destroy:vBar.util.noop,this.getPercentageBehavior=vBar.behaviors[a].percentage?vBar.behaviors[a].percentage:vBar.util.noop},vBar.prototype._update=function(){var a=this.getBar(),b=this.getPercentage();if(b!==this._currentPercentage&&(this._currentPercentage=b,this.onChange&&"function"==typeof this.onChange&&this.onChange(b),b>=100&&this.onComplete&&"function"==typeof this.onComplete&&this.onComplete(),this.updatePlugin({bar:a,percentage:b}),this.showText)){var c=this.node.querySelector("span.text"),d=this.textPendingPercentage?100-b:b;d=" "+d+"% ",c.textContent=this.beforeText+d+this.afterText,b>50?this._currentTextColor!=this.textColors[1]&&(c.style.color=this.textColors[1],this._currentTextColor=this.textColors[1]):this._currentTextColor!=this.textColors[0]&&(c.style.color=this.textColors[0],this._currentTextColor=this.textColors[0])}},vBar.prototype.render=function(){var a,b,c,d,e,f="",g=this.showBorder?"border: 1px solid "+this.borderColor+"; border-radius:"+this.borderRadius+"px;":"";b='<div class="vbar-wrapper" style="position: relative; height: '+this.barHeight+';">',a='<div class="vbar" style="position: relative; height: 100%; width:100%; overflow: hidden; '+g+'">',c='<div class="vbar-content" style="height: 100%; overflow: hidden;transition: all 0.5s;">',d=this.showText?'<span class="text" style="position: absolute; transition: color 0.5s; top:'+this.textTop+"; font-weight: bold; display:block; left: 0px; text-align: "+this.textAlign+"; width:"+this.node.offsetWidth+"px; font-size: "+this.textSize+"; color: "+this._currentTextColor+'"></span>':"",this.contentPlugin&&(f="function"==typeof this.contentPlugin?this.contentPlugin():this.contentPlugin),e=b+a+c+f+"</div></div>"+d+"</div>",this.node.innerHTML=e,this.initPlugin(),this._update(),this.render=function(){console.log("Render can only be called once")}},vBar.util={},vBar.util.hasClass=function(a,b){for(var c=a.className.replace(/\s+/g," ").split(" "),d=0;d<c.length;d++)if(c[d]===b)return!0;return!1},vBar.util.allowedField=function(a){var b=a.type;return"button"!=b&&"submit"!=b&&"checkbox"!=b&&"hidden"!=b&&!vBar.util.hasClass(a,"ignore")},vBar.util.noop=function(){},vBar.plugins={},vBar.behaviors={},vBar.prototype.destroyPlugin=vBar.util.noop,vBar.prototype.initPlugin=vBar.util.noop,vBar.prototype.contentPlugin=null,vBar.prototype.updatePlugin=function(a){a.bar.style.width=a.percentage+"%"},vBar.prototype.initBehavior=vBar.util.noop,vBar.prototype.destroyBehavior=vBar.util.noop,vBar.prototype.getPercentageBehavior=vBar.util.noop;;vBar.plugins.dashed={init:function(){var a=this.getBar();a.style.borderColor=this.colors[0]+" transparent transparent transparent",a.style.borderWidth=this.barHeight+" 0px 0px 0px",a.style.borderStyle="dashed",a.style.height=0}};;vBar.behaviors.formbar={init:function(a){this.formNode=document.querySelector(a.formNode)||document.body,this._formElements=[],this.handleEvent=function(a){vBar.util.allowedField(a.target)&&this._update()},this.formNode.addEventListener("input",this);for(var b=this.formNode.querySelectorAll("input, textarea, select"),c=0;c<b.length;c++)vBar.util.allowedField(b[c])&&this._formElements.push(b[c])},destroy:function(){this.formNode.removeEventListener("input",this),delete this._formElements,delete this.handleEvent},percentage:function(){for(var a=0,b=0;b<this._formElements.length;b++)this._formElements[b].value.length&&a++;return a/this._formElements.length}};