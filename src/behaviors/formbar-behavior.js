/** FORM BAR BEHAVIOR **/
vBar.behaviors.formbar = {
    init: function( cfg ){

       //Form Html node containing the form we want observe
       this.formNode = document.querySelector( cfg.formNode ) || document.body;

       this._formElements = [];

       //Event handler
       this.handleEvent = function(ev){
					if ( vBar.util.allowedField( ev.target ) ) {
        		this._update();
    			}
			 };        
				
       //Initialize attach events
       this.formNode.addEventListener( "input", this );

       //Get the input elements to control
       var elems = this.formNode.querySelectorAll("input, textarea, select");

       for (var j = 0; j < elems.length; j++) {
         
           if ( vBar.util.allowedField( elems[j] ) ) {
               this._formElements.push( elems[j] );
           }
       }
    },
    destroy: function(){
        this.formNode.removeEventListener( "input", this );
        delete this._formElements;
        delete this.handleEvent;
    },
    percentage: function(){
        var Filled = 0;    
        for (var i = 0; i < this._formElements.length; i++) {
            if (this._formElements[i].value.length) Filled++;
        }

        return Filled / this._formElements.length; 
    }
};

