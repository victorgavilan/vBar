function FormBar(a){if(this.node=document.querySelector(a.node),!this.node)return void console.log("Can't find the bar's container node. Are you sure it exist?");this.nextStep=function(){this.currentStep++},this.prevStep=function(){this.currentStep--},this.onComplete=a.onComplete,this.onChange=a.onChange,this.colors=a.colors||["#44F"],this.totalSteps=a.totalSteps||1,this.currentStep=a.currentStep||1,this.borderColor=a.borderColor||"#bbb",this.showBorder=a.showBorder||!1,this.showText=a.showText||!1,this.textPendingPercentage=a.textPendingPercentage||!1,this.beforeText=a.beforeText||"",this.afterText=a.afterText||"",this.textColors=a.textColors||["black","white"],this.textSize=a.textSize||"1em","number"==typeof this.textSize&&(this.textSize+="px"),this.textTop=a.textTop||"5px","number"==typeof this.textTop&&(this.textTop+="px"),a.barHeight&&"number"==typeof a.barHeight&&(a.barHeight+="px"),this.barHeight=a.barHeight||"4px",this.node.style.background=a.background||"transparent",this._barNode=null,this._currentPercentage=null,this._currentTextColor=this.textColors[0];var b=a.behavior||"progressbar";this.setBehavior(b),this.initBehavior(a);var c=a.plugin||"solid";this.setPlugin(c)}FormBar.prototype.destroy=function(){this.destroyPlugin(),this.destroyBehavior(),this.node.removeChild(this.getBar())},FormBar.prototype.getBar=function(){return this._barNode||(this._barNode=this.node.querySelector(".fpbar")),this._barNode},FormBar.prototype.getPercentage=function(){var a=this.getPercentageBehavior();if(this.totalSteps<=1)return Math.round(100*a);var b=1/this.totalSteps,c=a*b,d=(this.currentStep-1)*b;return Math.round(d+100*c)},FormBar.prototype.setPlugin=function(a){if(a=a.toLowerCase(),!(a in FormBar.plugins))throw new Error('There is not any "'+a+'" plugin registered');this.destroyPlugin(),this.contentPlugin=FormBar.plugins[a].content?FormBar.plugins[a].content:null,this.initPlugin=FormBar.plugins[a].init?FormBar.plugins[a].init:FormBar.plugins.solid.init,this.updatePlugin=FormBar.plugins[a].update?FormBar.plugins[a].update:FormBar.plugins.solid.update,this.destroyPlugin=FormBar.plugins[a].destroy?FormBar.plugins[a].destroy:FormBar.util.noop},FormBar.prototype.setBehavior=function(a){if(a=a.toLowerCase(),!(a in FormBar.behaviors))throw new Error('There is not any "'+a+'" behavior registered');this.initBehavior=FormBar.behaviors[a].init?FormBar.behaviors[a].init:FormBar.util.noop,this.destroyBehavior=FormBar.behaviors[a].destroy?FormBar.behaviors[a].destroy:FormBar.util.noop,this.getPercentageBehavior=FormBar.behaviors[a].percentage?FormBar.behaviors[a].percentage:FormBar.util.noop},FormBar.prototype._update=function(){var a=this.getBar(),b=this.getPercentage();if(b!==this._currentPercentage&&(this._currentPercentage=b,this.onChange&&"function"==typeof this.onChange&&this.onChange(b),b>=100&&this.onComplete&&"function"==typeof this.onComplete&&this.onComplete(),this.updatePlugin({bar:a,percentage:b}),this.showText)){var c=this.node.querySelector("span.text"),d=this.textPendingPercentage?100-b:b;d=" "+d+"% ",c.textContent=this.beforeText+d+this.afterText,b>50?this._currentTextColor!=this.textColors[1]&&(c.style.color=this.textColors[1],this._currentTextColor=this.textColors[1]):this._currentTextColor!=this.textColors[0]&&(c.style.color=this.textColors[0],this._currentTextColor=this.textColors[0])}},FormBar.prototype.render=function(){var a,b="",c=this.showText?'<span class="text" style="position: absolute; transition: color 0.5s; top:'+this.textTop+"; font-weight: bold; display:block; left: 0px; text-align: center; width:"+this.node.offsetWidth+"px; font-size: "+this.textSize+"; color: "+this._currentTextColor+'"></span>':"";this.contentPlugin&&(b="function"==typeof this.content?this.contentPlugin():this.contentPlugin),a='<div class="fpbar" style="position: relative; height:'+this.barHeight+'; transition: all 1s; width: 0px; overflow: hidden">'+b+"</div>"+c,this.node.style.position="relative",this.showBorder&&(this.node.style.border="1px solid "+this.borderColor),this.node.innerHTML=a,this.initPlugin(),this._update(),this.render=function(){console.log("Render can only be called once")}},FormBar.util={},FormBar.util.hasClass=function(a,b){for(var c=a.className.replace(/\s+/g," ").split(" "),d=0;d<c.length;d++)if(c[d]===b)return!0;return!1},FormBar.util.allowedField=function(a){var b=a.type;return"button"!=b&&"submit"!=b&&"checkbox"!=b&&"hidden"!=b&&!FormBar.util.hasClass(a,"ignore")},FormBar.util.noop=function(){},FormBar.plugins={},FormBar.plugins.solid={init:function(){var a=this.getBar();a.style.background=this.colors[0]},update:function(a){a.bar.style.width=a.percentage+"%"}},FormBar.behaviors={},FormBar.behaviors.progressbar={init:function(){this.value=this.value||0,this.setValue=function(a){this.value=a/100,this._update()}},destroy:function(){delete this.setValue,delete this.value},percentage:function(){return this.value}},FormBar.prototype.destroyPlugin=FormBar.util.noop,FormBar.prototype.initPlugin=FormBar.plugins.solid.init,FormBar.prototype.contentPlugin=null,FormBar.prototype.updatePlugin=FormBar.plugins.solid.update,FormBar.prototype.initBehavior=FormBar.util.noop,FormBar.prototype.destroyBehavior=FormBar.util.noop,FormBar.prototype.getPercentageBehavior=FormBar.util.noop;;FormBar.plugins.chameleon={init:function(){var a=this.getBar();a.style.background=this.colors[0],this.chameleon_currentColor=null},update:function(a){var b=a.bar,c=this.chameleon_currentColor,d=a.percentage,e=0===d?0:Math.round(d/100*this.colors.length-1);b.style.width=d+"%",c!=e&&(this.chameleon_currentColor=e,b.style.background=this.colors[e])}};;FormBar.plugins.dashed={init:function(){var a=this.getBar();a.style.borderColor=this.colors[0]+" transparent transparent transparent",a.style.borderWidth=this.barHeight+" 0px 0px 0px",a.style.borderStyle="dashed",a.style.height=0}};;FormBar.plugins.dotted={init:function(){var a=this.getBar();a.style.borderColor=this.colors[0]+" transparent transparent transparent",a.style.borderWidth=this.barHeight+" 0px 0px 0px",a.style.borderStyle="dotted",a.style.height=0}};;FormBar.plugins.gradient={init:function(){var a=this.getBar(),b="linear-gradient( to right, "+this.colors[0]+", "+this.colors[1]+")";a.style.background=b}};;FormBar.plugins.merge={content:'<div class="mask"></div>',init:function(){var a=this.getBar(),b=a.querySelector("div.mask");a.style.background=this.colors[0],a.style.textAlign="center",a.style.width="100%",b.style.background=this.colors[1],b.style.width="100%",b.style.height=this.barHeight,b.style.margin="auto",b.style.transition="width 1s"},update:function(){var a=this.getBar(),b=a.querySelector("div.mask"),c=this.getPercentage();b.style.width=100-c+"%"}};;FormBar.plugins.sections={content:function(){for(var a=this.node.offsetWidth/this.colors.length,b='<div style="position: relative">',c=0;c<this.colors.length;++c)b+='<span style="display: inline-block; position: absolute; top: 0; left: '+a*c+"px; background: "+this.colors[c]+"; height: "+this.barHeight+"; width: "+a+'px"></span>';return b+="</div>"}};;FormBar.behaviors.formbar={init:function(a){this.formNode=document.querySelector(a.formNode)||document.body,this._formElements=[],this.handleEvent=function(a){FormBar.util.allowedField(a.target)&&this._update()},this.formNode.addEventListener("input",this);for(var b=this.formNode.querySelectorAll("input, textarea, select"),c=0;c<b.length;c++)FormBar.util.allowedField(b[c])&&this._formElements.push(b[c])},destroy:function(){this.formNode.removeEventListener("input",this),delete this._formElements,delete this.handleEvent},percentage:function(){for(var a=0,b=0;b<this._formElements.length;b++)this._formElements[b].value.length&&a++;return a/this._formElements.length}};;FormBar.behaviors.timerbar={init:function(a){this._timerBehaviorTimerId=null,this._timerBehaviorTimerMax=1e3*(a.maxTime||30),this._timerBehaviorTimerCurrent=0,this._timerBehaviorTimerRunning=!1,this._timerBehaviorInterval=a.timerInterval||500,this.reset=function(a){this._timerBehaviorTimerCurrent=1e3*(a||0)},this.start=function(a){a&&(a>this._timerBehaviorTimerMax&&(a=this._timerBehaviorTimerMax),this._timerBehaviorTimerCurrent=1e3*a),this._timerBehaviorTimerId=setInterval(function(){return(this._timerBehaviorTimerCurrent+=this._timerBehaviorInterval)>=this._timerBehaviorTimerMax?(this.stop(),void this._update()):(this._timerBehaviorTimerRunning=!0,void this._update())}.bind(this),this._timerBehaviorInterval)},this.stop=function(){this._timerBehaviorTimerRunning=!1,clearInterval(this._timerBehaviorTimerId)}},destroy:function(){this._timerBehaviorTimerRunning&&this.stop(),delete this._timerBehaviorTimerCurrent,delete this._timerBehaviorTimerMax,delete this._timerBehaviorTimerId},percentage:function(){return this._timerBehaviorTimerCurrent/this._timerBehaviorTimerMax}};