
function vBar( cfg ){

		//Save configuration object to be used by plugins and behaviors
    this.config = cfg;
    
    //container node
    this.node = document.querySelector(cfg.node);
    
    //Check if the node passed by the user exists
    if (!this.node) { 
        console.log("Can't find the bar's container node. Are you sure it exist?");
        return; 
    }

    //methods
    this.nextStep = function() { this.currentStep++; };
    this.prevStep =  function() { this.currentStep--; };

    //callbacks
    this.onComplete = cfg.onComplete;
    this.onChange = cfg.onChange;

    //Color array share by all plugins
    this.colors = cfg.colors || ['#44F'];
    this.striped = cfg.striped || false;

    //Multistep form configuration
    this.totalSteps = cfg.totalSteps || 1;
    this.currentStep = cfg.currentStep || 1;

    //Bar border configuration
    this.borderColor = cfg.borderColor || '#bbb'; 
    this.showBorder = cfg.showBorder || false;
    this.borderRadius = cfg.borderRadius || 5;

    //Bar height and color configuration
    this.barHeight = cfg.barHeight || '4';
    this.background = cfg.background || 'white';

    //Bar text configuration
    this.showText = cfg.showText || false;
    this.textPosition = cfg.textPosition || vBar.TEXTPOS_MIDDLE_CENTER;
    this.textPadding = cfg.textPadding || ( ( this.textPosition == vBar.TEXTPOS_MIDDLE_CENTER ) ||
    		 																					( this.textPosition == vBar.TEXTPOS_MIDDLE_LEFT ) ||
																					    		( this.textPosition == vBar.TEXTPOS_MIDDLE_RIGHT )) ?'2px 5px' : '5px 0px';
        
		this.textPaddingLeft = cfg.textPaddingLeft || 0;
    this.textPendingPercentage = cfg.textPendingPercentage || false;
    this.beforeText = cfg.beforeText || '';
    this.afterText = cfg.afterText ||'';
    this.textColors = cfg.textColors || ['black', 'white']; //-50% +50% colors
    this.textSize = cfg.textSize || '1em';
    if (typeof this.textSize == 'number') this.textSize += 'px';

    switch ( this.textPosition ){
    	case vBar.TEXTPOS_TOP_LEFT:
		    this._textPosition = 'padding: '+ this.textPadding +'; text-align: left; bottom:'+ this.barHeight +'px';    		
    		break;
    	case vBar.TEXTPOS_TOP_CENTER:
	    	this._textPosition = 'padding: '+ this.textPadding +'; text-align: center; bottom:'+ this.barHeight +'px';    		
    		break;
    	case vBar.TEXTPOS_TOP_RIGHT:
	    	this._textPosition = 'padding: '+ this.textPadding +'; text-align: right; bottom:'+ this.barHeight +'px; right: 0px;';    		
    		break;
     	case vBar.TEXTPOS_MIDDLE_LEFT:
		    this._textPosition = 'padding: '+ this.textPadding +'; text-align: left; top: 0px';    		
    		break;
    	case vBar.TEXTPOS_MIDDLE_CENTER:
	    	this._textPosition = 'padding: '+ this.textPadding +'; text-align: center; top: 0px';    		
    		break;
    	case vBar.TEXTPOS_MIDDLE_RIGHT:
	    	this._textPosition = 'padding: '+ this.textPadding +'; text-align: right; top: 0px; right: 0px;';    		
    		break;
    	case vBar.TEXTPOS_BOTTOM_LEFT:
		    this._textPosition = 'padding: '+ this.textPadding +'; text-align: left; top:'+ this.barHeight +'px';    		
    		break;
    	case vBar.TEXTPOS_BOTTOM_CENTER:
	    	this._textPosition = 'padding: '+ this.textPadding +'; text-align: center; top:'+ this.barHeight +'px';    		
    		break;
    	case vBar.TEXTPOS_BOTTOM_RIGHT:
	    	this._textPosition = 'padding: '+ this.textPadding +'; text-align: right; top:'+ this.barHeight +'px; right: 0px;';    		
    		break;
    }
        
    //Internal use variables
    this._barNode = null; //Bar html node reference
    this._currentPercentage = null;
    this._currentTextColor = this.textColors[0];
    
    //Set the behavior and init it
    var behavior = cfg.behavior || 'progressbar';
    this.setBehavior( behavior);
    this.initBehavior( cfg );

    //Set the bar plugin
    var plugin = cfg.plugin || 'solid';
    this.setPlugin( plugin );

    //Set the effects
    this.effects = cfg.effects || [];
}


/**
    Destroy the bar from the DOM and call behaviorDestroy method
    @method destroy
*/
vBar.prototype.destroy = function(){
		this.destroyPlugin();
    this.destroyBehavior();
    this.node.removeChild( this.node.querySelector('.vbar-wrapper') );    
};

/**
    Return the bar DOM node.
    @method getBar
    @return bar's DOM node
*/

vBar.prototype.getBar = function(){
  if ( !this._barNode ) this._barNode = this.node.querySelector(".vbar-content");
	return this._barNode;  
};


/**
    Return the percentage and transform it if is a multistep form
    @method getPercentage
    @return percentage adapted to multisteps forms.
*/

vBar.prototype.getPercentage = function(){

    var percentFilled = this.getPercentageBehavior();

    //If it isn't a multistep form return the completed percentage without transform it
    if (this.totalSteps <= 1) return Math.round( percentFilled  * 100 ); 

    var percentStep =   1 / this.totalSteps, //Step percentage
    adaptedPercentage = percentFilled * percentStep, //Actual form percentage adapted to global multistep percentage
    completeStepsPercentage = ( (this.currentStep - 1) * percentStep );
 
   return Math.round( completeStepsPercentage + adaptedPercentage  * 100 );   
};

/**
    Set the plugin to use to draw the bar
    @method setPlugin
    @throws {Error} Plugin does not exist.
*/
vBar.prototype.setPlugin = function (pluginName){
	
    pluginName = pluginName.toLowerCase();

    if ( pluginName in vBar.plugins ){
        //Destroy phase previous plugin
        if (this.destroyPlugin) this.destroyPlugin(); 

        //Load new plugin
        this.contentPlugin = (vBar.plugins[ pluginName ].content) ? vBar.plugins[ pluginName ].content : vBar.plugins.defaults.content;
        this.initPlugin = (vBar.plugins[ pluginName ].init) ? vBar.plugins[ pluginName ].init : vBar.plugins.defaults.init; //default init

        this.updatePlugin = (vBar.plugins[ pluginName ].update) ? vBar.plugins[ pluginName ].update : vBar.plugins.defaults.update; //default update
        this.destroyPlugin = (vBar.plugins[ pluginName ].destroy) ? vBar.plugins[ pluginName ].destroy : vBar.plugins.defaults.destroy;
    } else {
        throw new Error('There is not any \"'+ pluginName +'\" plugin registered');
    }
};



/**
    Set bar behavior
    @method setBehavior
    @throws {Error} Behavior does not exist.
*/
vBar.prototype.setBehavior = function (behaviorName){

    behaviorName = behaviorName.toLowerCase();

    if ( behaviorName in vBar.behaviors ){
        //Destroy previous behavior
		    if (this.destroyBehavior) this.destroyBehavior(); 
    
        this.initBehavior = (vBar.behaviors[ behaviorName ].init ) ? vBar.behaviors[ behaviorName ].init : vBar.behaviors.defaults.init;
        this.destroyBehavior = (vBar.behaviors[ behaviorName ].destroy) ? vBar.behaviors[ behaviorName ].destroy : vBar.behaviors.defaults.destroy;
        this.getPercentageBehavior = (vBar.behaviors[ behaviorName ].percentage) ? vBar.behaviors[ behaviorName ].percentage : vBar.behaviors.defaults.percentage;
    } else {
        throw new Error('There is not any \"'+ behaviorName +'\" behavior registered');
    }
};



/**
    Update the bar state. 
    @method update
*/
vBar.prototype._update = function( ) {
        
    var bar = this.getBar(),
        percentage = this.getPercentage();
        
    //If there is no change in the percentage value don't update the bar
    if (percentage === this._currentPercentage){
    	return;
    } else {
    	this._currentPercentage = percentage;
    }

    //Call the callback onChange every update
    if ( this.onChange && typeof this.onChange == "function"){
        this.onChange( percentage );
    }

    //If is 100% call the callback
    if ( percentage >= 100 && this.onComplete && typeof this.onComplete == "function"){
        this.onComplete();
    }
    
    this.updatePlugin( {bar: bar, percentage: percentage} );
    this.callEffectsMethod('update', {bar: bar, percentage: percentage});

    //Change text color if percentage > 50
    if (this.showText) {
        var textNode = this.node.querySelector('span.text'),
            percentageText = (this.textPendingPercentage) ? 100 - percentage : percentage;

        percentageText = " " + percentageText + "% ";

        textNode.textContent = this.beforeText + percentageText + this.afterText;
        if (percentage > 50) {
            if (this._currentTextColor != this.textColors[1]) {
                 textNode.style.color = this.textColors[1];
                 this._currentTextColor = this.textColors[1];
            }
        } else {
            if (this._currentTextColor != this.textColors[0]) {
                textNode.style.color = this.textColors[0];
                this._currentTextColor = this.textColors[0];
            }
        }
    }
};

/**
    Render the bar's initial state
    @method render
*/ 
vBar.prototype.render = function() {

    //Create the dom structure
    //Allow to pass a function or a string to generate the html content. 
    //The function must return an html string.
    var dbar,
        dwrapper,
        dcontent,
        dtext,
        content = '',
        html,
        htmlborder = (this.showBorder) ? 'border: 1px solid ' + this.borderColor +'; border-radius:'+ this.borderRadius + 'px;': '',
        htmlMiddleText = ( (this.textPosition == vBar.TEXTPOS_MIDDLE_CENTER) || 
                           (this.textPosition == vBar.TEXTPOS_MIDDLE_LEFT) || 
                           (this.textPosition == vBar.TEXTPOS_MIDDLE_RIGHT) ) ? 'height: 100%; line-height:'+ this.barHeight+'px;' : '';
        
        
        //html bar DOM structure
        dwrapper = '<div class="vbar-wrapper" style="position: relative; height: '+ this.barHeight + 'px;">';       
        dbar = '<div class="vbar" style="position: relative; height: 100%; width:100%; overflow: hidden; background-color:'+ this.background +'; '+ htmlborder + '">';
        dcontent = '<div class="vbar-content" style="height: 100%; overflow: hidden;transition: all 0.5s;">';     
        dtext = (this.showText) ? '<span class="text" style="position: absolute; transition: color 0.5s; '+ this._textPosition +'; font-weight: bold; display:block; width:'+ this.node.offsetWidth +'px; font-size: '+ this.textSize +'; color: '+ this._currentTextColor +'; '+ htmlMiddleText +'"></span>' : '';
        
 
    if (this.contentPlugin) {
        if (typeof this.contentPlugin === "function") {
            content = this.contentPlugin();
        } else {
            content = this.contentPlugin;       
        }
    }
    html = dwrapper + dbar + dcontent + content + '</div></div>' + dtext + '</div>';
    
          
    
    this.node.innerHTML = html;

    //Do de initialization
    this.initPlugin();

    //Init the effects
    this.callEffectsMethod('init');

    //Update the plugin state
    this._update();

    //Replace render behavior
    //Render will be call only once
    this.render = function(){
    	console.log('Render can only be called once');
    };
};

/*************
 ** EFFECTS **
 *************/
 vBar.effects = {};

//Function used to call a method of all instance applied effects
vBar.prototype.callEffectsMethod = function( method, extraData ){
	this.effects.forEach( function(fx){
		if ( vBar.effects[fx] && vBar.effects[fx][method] ) vBar.effects[fx][method].call( this, extraData );
	}, this);
};


/***************
 ** UTILITIES **
 ***************/
vBar.util = {};

/**
    Check if the element has the CSS class
    @method hasClass
    @param element An HTML element.
    @param className CSS class to check if it's in the element.
*/
vBar.util.hasClass = function( element, className ){
    var classes = element.className.replace(/\s+/g, ' ').split(' ');
   
    for (var i = 0; i < classes.length; i++) {
        if (classes[i] === className) {
            return true;
        }
    }

    return false;
};

/**
    Indicates if a field must be observed by the formBar
*/
vBar.util.allowedField = function( field ){
    var type = field.type;
    return ( type != "button" && type != "submit" && type != "checkbox" && type != "hidden" && (!vBar.util.hasClass(field, 'ignore')) );
};

// No operation
vBar.util.noop = function(){};


/*************
 ** PLUGINS **
 *************/
vBar.plugins = {};


/***************
 ** BEHAVIORS **
 ***************/
vBar.behaviors = {};

/****************
 ** CONSTANTES **
 ****************/
 vBar.TEXTPOS_TOP_RIGHT = 1;
 vBar.TEXTPOS_TOP_CENTER = 2;
 vBar.TEXTPOS_TOP_LEFT = 3;
 
 vBar.TEXTPOS_MIDDLE_RIGHT = 4;
 vBar.TEXTPOS_MIDDLE_CENTER = 5;
 vBar.TEXTPOS_MIDDLE_LEFT = 6;

 vBar.TEXTPOS_BOTTOM_RIGHT = 7;
 vBar.TEXTPOS_BOTTOM_CENTER = 8;
 vBar.TEXTPOS_BOTTOM_LEFT = 9;
 
/************************
 ** EXTENSIONS METHODS **
 ************************/

//Plugins handles
vBar.prototype.destroyPlugin = null;
vBar.prototype.initPlugin = null;
vBar.prototype.contentPlugin = null;
vBar.prototype.updatePlugin = null;

//Default plugin values
vBar.plugins.defaults = {
	content: null,
	init: function(){
		//Set color of bar as solid
		var bar = this.getBar();      
		bar.style.background = this.colors[0];        
	},
	update: function( ev ){
		ev.bar.style.width = ev.percentage + "%";
	},
	destroy: vBar.util.noop
};

//Behaviors handles
vBar.prototype.initBehavior = null;
vBar.prototype.destroyBehavior = null;
vBar.prototype.getPercentageBehavior = null;		

//Behaviors defaults
vBar.behaviors.defaults = {
	init: vBar.util.noop,
	percentage: vBar.util.noop,
	destroy: vBar.util.noop
};

