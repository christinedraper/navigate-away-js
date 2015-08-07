/*
 * Common class for all editable models
 */
MyModel = Backbone.Model.extend({
	hasEdits: false
});

/*
 * Common class for view managers,
 */
ViewManager = Backbone.View.extend({
	events: {
		'change input' : 'onEdit',
		'click .save-button' : 'onSave'
	},
	
	initialize: function(){
		
		// on a navigate away attempt, communicate if there are unsaved edits
		this.listenTo(Backbone, "myapp:navigate", function(status){
			  if (this.unsavedEdits()){
			    status.unsavedEdits = true;
			    status.msg = "There are unsaved edits to " + this.model.get("name") + 
			    ". Continuing will discard these edits.";
			  }
			});		
	},

	onEdit: function(event){
		this.model.hasEdits = true;
		this.$('.message').text('There are unsaved edits in ' + this.model.get("name"));
	},
	
	onSave: function(event){
		this.$('.message').text('Saved ' + this.model.get("name"));
		this.model.hasEdits = false;
	},
	
	unsavedEdits: function(){
		return this.model.hasEdits;
	}
});

/*
 * Main application code
 */
$(document).ready(function(){
	
	// create the models
	var modelA = new MyModel({ name: "Model A"});
	var modelB = new MyModel({ name: "Model B"});
	
	// create the tabbed UI
	var view1 = new ViewManager({ model: modelA, el: $('#view1')  });
	var view2 = new ViewManager({ model: modelB, el: $('#view2') });
   $( "#tabs" ).tabs();
   $( "button" ).button();
   
   // listen for attempt to navigate away
   $(window).bind('beforeunload', function(){
	   var status = {
	     unsavedEdits: false
	   };
	  
	   Backbone.trigger('myapp:navigate', status);
	   if (status.unsavedEdits) {
	     return status.msg || "There are unsaved edits. Continuing will discard these edits.";
	   }
	 });
}); 