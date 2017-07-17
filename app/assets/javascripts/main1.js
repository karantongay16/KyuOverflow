
// Create a modal view class
var Modal = Backbone.Modal.extend({
  template: '#modal-template',
  cancelEl: '.bbm-button',
});
function modalOpen(){
  // Render an instance of your modal
  var modalView = new Modal();
  $('.app').html(modalView.render().el);
}


// Globals //

var loginemail = "";

function onFollow(ele){
	console.log(ele.id);
}

var Question = Backbone.Model.extend({

	idAttribute: "reg",

	urlRoot: "/api/questions", //->

	validate: function(attrs){
		if (!attrs.title)
			return "Question is not valid.";
	},

	start: function(){
		console.log("Question started.");
	}
});

var Questions = Backbone.Collection.extend({
	Model: Question
});

var QuesDesc = Backbone.Model.extend({

idAttribute: "id",

urlRoot: '/questions'

});


var AnsModel = Backbone.Model.extend({

	//urlRoot: '/api/app/answers',
	defaults: {
	poster: "this is Title",
	contents: "contents go here",
	answeredby: "test@test.com",
	}

});


var newQuesModel = Backbone.Model.extend({

	urlRoot: '/api/questions/',
	defaults: {
	title: "this is Title",
	contents: "contents go here",
	askedby: "test@test.com",
	}

});


var QuesCollection = Backbone.Collection.extend({
    id: '',
    model: QuesDesc,  
    url: function () {
        return '/app/#qview/' + this.id;
    }
});


var Car = Question.extend({
	start: function(){
		
	}
});

/* Creating View */

var QuestionView = Backbone.View.extend({
	tagName: "tr",

	className: "question", //->

	events: {
		"click .delete": "onDelete",
		"click .view" : "onView"
	},

	render: function() {
		var source = $("#questionTemplate").html(); //->
		var template = _.template(source);

		this.$el.html(template(this.model.toJSON()));
		this.$el.attr("data-color", this.model.get("color"));

		this.$el.append("<td>" + this.model.get("title") +"</td>");
		this.$el.append("<td>" + this.model.get("askedby") +"</td>");
		this.$el.append("<td><button class='view btn btn-success' id=" + this.model.get("id") + ">View</button></td>");

		return this;
	},

	onDelete: function(){
		this.remove();
	},

	onView: function(){
		//routing.router.flash({id: this.model.get("id")}).navigate('qview', {trigger: true});
		//router.navigate("/qview/" + this.model.get("id"),true);
		window.location = "/app/#qview/" + this.model.get("id");
	},
	
});

var quesid = 0;
var QuesDescView = Backbone.View.extend({

// Contents for displaying the question description goes here

events: {
"click #delete_question" : "deleteQues",
"click #submitanswer" : "submitAns",
"click .deleteAns" : "deleteAnswer"
},

submitAns: function(){

	nqm = new AnsModel({poster: $("#email").val(), contents: $("#anscontents").val(), answeredby: "" + $("#email").val()});
		console.log(nqm);	
		console.log("Attempting to save");
		nqm.save({},
			{
			url: "/questions/" + quesid + "/answers"
			},
			{
				dataType: 'text'
			},
			{
				success: function()
				{
					console.log("Model Saved");
				},
				error: function(model,xhr,options)
				{
					console.log("Somthing Went Wrong");
				}
			});
		//router.viewQuesDesc(new QuesDescView({id: quesid}));
		//router.navigate("#qview/" + quesid,true);
		//router.viewQuesDesc(quesid);
		router.loadView(new QuesDescView({quesid}));
		//console.log("refreshed");
		
        	// this.QuesDescView().remove();
        
		
		//$("#cont").html(viewQuesDesc().show().$el);
		//this.show();

},

deleteAnswer: function(e){

	console.log("Deleting");
	var ele = $(e.currentTarget);
	//console.log(ele.attr('id'));
	ques = new AnsModel({id: ele.attr('id')});
	$(".bbm-modal__title").html("Alert");
	ques.destroy({
		url: "/questions/" + quesid + "/answers" + "/" + ele.attr('id'),
		success: function () {
		    console.log("success");
		    modalOpen();
		  	$(".bbm-modal__title").html("Success!");

		  	$(".bbm-modal__section").html("Your answer deleted successfully!");

		  },
		  error: function(e){
		  	//alert("You cannot delete someone else's answer!");

		  	modalOpen();
		  	$(".bbm-modal__title").html("Information");

		  	$(".bbm-modal__section").html("You cannot delete the answer submitted by another User!");

		  	//$('.open').click();
		  }});

	if (this._currentView) {
			this._currentView.remove();
		}
	router.loadView(new QuesDescView({quesid}));

},

initialize: function (options) {
		
        this.ques = new QuesCollection();
        this.ques.id = options.quesid;
        this.ques.fetch();
        quesid = this.ques.id;	

        this.show();
    },

deleteQues: function()
{
	console.log("Deleting");
	ques = new QuesDesc({id: quesid});
	//_.invoke(this.ques, 'destroy');
	//q = new QuesDesc();
	ques.destroy({
		url: "/questions/" + quesid,
		dataType: 'json',
		success: function () {
		   
		   alert("Your Question deleted successfully!");
		   //  modalOpen();
		  	// $(".bbm-modal__title").html("Success!");

		  	// $(".bbm-modal__section").html("Your Question deleted successfully!");

		    router.navigate("#qfeed");
			//Backbone.history.loadUrl();
			window.location.reload();
		  },
		  error: function(e){
		  	//alert("You cannot delete someone else's question!")
		  	modalOpen();
		  	$(".bbm-modal__title").html("Information");

		  	$(".bbm-modal__section").html("You cannot delete the Question submitted by another User!");

		  }});
	//router.navigate("#qfeed",true);
	
	//this.remove();
	//return false;
},

show: function(){
	$(".viewheader").html("View Question");
	this.ques = new QuesCollection();
	var q = new Question();
		var item1 = [];
		$.ajax({
		  url: '/questions/' + quesid,
		  dataType: 'json',
		  async: false,
		  success: function (data) {
		    //questions = new Question.Collections.Questions(data[0]);
		    //var m = new Question(data, {parse: true});
		    for (var i=0; i<data.length; i++)
		    {
		    	item1 = data[i];
		    	//console.log(item1.askedby);
		    		
		    }
		  } });

		//this.$el.html(template(this.model.toJSON()));
		this.$el.append("<h2 class='h2'>Question: " + item1.title + "</h2>");
		this.$el.append("<h4 class='h4'>Asked By: " + item1.askedby + "</h4>");

		this.$el.append("" +
			"<div class='desc' style='background-color: lightblue; height:150px; border-radius:25px; padding: 25px;'>");

		this.$(".desc").append("Description: " + item1.contents +"");
		
		this.$el.append("<div id='formbtn'></div>");

		//this.$("#formbtn").append("<br><a class='btn btn-warning' id='edit_question' rel='nofollow'>Edit This Question</a>");

		this.$("#formbtn").append("<br><a class='btn btn-danger' id='delete_question' rel='nofollow'>Delete This Question</a>");

		this.$el.append("<br><div class='answer' style='background-color:lightblue; height:320px; padding:25px; border-radius:25px;'>");

		$.ajax({
		  url: '/api/questions/senduser',
		  dataType: 'json',
		  async: false,
		  success: function (data) {
		    useremail = data;
		    
		  },
		  error: function(e){
		  	console.log("Error");
		  } });


		this.$(".answer").append("<label>Poster</label><br>" +
			"<input type='text' value=" + useremail + " id='email' class='form-control' readonly='true'><br>" + 
			"<label>Your Answer</label><br>" +
			"<textarea class='form-control' id='anscontents'></textarea><br>" +
			"<button class='btn btn-success' id='submitanswer'>Submit Answer</button>");


		var answers = [];
		var answeredby = [];
		var answereddate = [];
		var answerid = [];

		$.ajax({
		  url: '/questions/' + quesid +'/answers',
		  dataType: 'json',
		  async: false,
		  success: function (data) {
		  	//console.log(data[0]);
		    for(var i=0;i<data[0].length;i++)
		    {
		    	answers[i] = data[0][i].contents;
		    	answeredby[i] = data[0][i].answeredby;
		    	answereddate[i] = data[0][i].created_at;
		    	answerid[i] = data[0][i].id;
		    }
		    
		  },
		  error: function(e){
		  	console.log("Error");
		  } });


		for(var i=0;i<answers.length;i++)
		{
		 this.$el.append("<br><br>" +
		    	"<div class='answer' style='background-color:lightblue; height:220px; padding:20px; border-radius:25px;'>" +
  				   "<p>" +
				    "<strong>Answer: </strong>" +
				    "" + answers[i] +
				  "</p>" +
				  "<br><br>" +
				  "<p>" +
				    "<strong>Poster: </strong>" +
				    "" + answeredby[i] +" | <strong>Answered: </strong>" + answereddate[i] +
				  "</p>" +
				 
				  "<p>" +
				  "<br>" +
				  "<button class='btn btn-danger deleteAns' id='" + answerid[i] + "'>Delete Answer</button>" +
				"</p>" +
				"</div>" + 
		    	"");
		}

		return this;
	}

});

var useremail = "";

var newQues = Backbone.View.extend({

	model: newQuesModel,

	events: {
		"click .delete": "onDelete",
		"click .Show" : "onSubmit"
	},

	render: function(){
		$(".search-results").empty();
		$(".viewheader").html("Ask New Question");
		this.$el.append("<label>Title</label><br>" + 
			"<input type='text' id='title' placeholder='Minimum 5 Characters' class='form-control'><br>" +
			"<label>Description</label>" + 
			"<textarea class='form-control' id='desc' placeholder='Please enter the description'></textarea><br><button class='Show btn btn-success'>Submit Question</button>");
		
		$.ajax({
		  url: '/api/questions/senduser',
		  dataType: 'json',
		  async: false,
		  success: function (data) {
		    useremail = data;
		    
		  },
		  error: function(e){
		  	console.log("Error");
		  } });


		return this;
	},

	onSubmit: function()
	{
		console.log(useremail);
		nqm = new newQuesModel({title: $("#title").val(), contents: $("#desc").val(), askedby: "" + useremail});
		console.log(nqm);	
		console.log("Attempting to save");
		nqm.save({},{
			success: function(model, response, options)
			{
				//modalOpen();
				//$(".bbm-modal__title").html("Success!");

				//$(".bbm-modal__section").html("Your Question Submitted Successfully!");

				
				router.navigate("#qfeed");
				window.location.reload();
				Backbone.history.loadUrl();
				
			},
			error: function(model,xhr,options)
			{
				console.log("Somthing Went Wrong");
				modalOpen();
				$(".bbm-modal__title").html("Information: Something went wrong!");

				$(".bbm-modal__section").html("<p>Please check the following:</p>" +
					"<li>The Title should have more than 5 characters!</li>" +
					"<li>The Description should not be empty and should consist of at the least 5 characters!</li>");
			}
		});

		//console.log($("#title").val());
	},

	insert: function(){
		
	}

});


var QuestionsView = Backbone.View.extend({
	id: "Questions",

	tagName: "table",

	className: "table table-bordered table-hover",

	initialize: function(){
		$(".search-results").empty();
		$(".viewheader").html("Question Feed");
		this.$el.append("<tr><td>Title</td><td>Asked By</td><td>View Question</td></tr>");
		bus.on("newQuestion", this.onNewQuestion, this);
	},

	render: function(){
		this.collection.each(function(question){
			var questionView = new QuestionView({ model: question });
			//->
			this.$el.append(questionView.render().$el);
		}, this);
	     

		return this;
	},

});

var HomeView = Backbone.View.extend({
	render: function(){
		this.$el.html("" +
			"<table class='table'><td>Hi</td></table>" +
			"");
		return this;
	},

});

var viewProfile = Backbone.View.extend({
	initialize: function()
	{
		var quesasked = "";
		var answers = "";
		var followers = [];
		var following = [];
		var myquestions = [];
		var myanswers = [];

		info = {};
		$.ajax({
		  url: '/profiles/',
		  dataType: 'json',
		  async: false,
		  success: function (data) {
		    info = data;
		    
		  },
		  error: function(e){
		  	console.log("Error");
		  } });

		$.ajax({
		  url: '/api/app/senduser',
		  dataType: 'json',
		  async: false,
		  success: function (data) {
		    loginemail = data[0];
		    quesasked = data[1];
		    answers = data[2];
		    //console.log(data);
		  },
		  error: function(e){
		  	console.log("Error");
		  } });

		$.ajax({
		  url: '/api/app/sendfollows',
		  dataType: 'json',
		  async: false,
		  success: function (data) {

		  	for(var i=0;i<data[0].length;i++)
		  	{
		  		followers.push(data[0][i].email);
		  		followers.push("<br>");
		  	}
		  	
		  	for(var i=0;i<data[1].length;i++)
		  	{
		  		following.push(data[1][i].email);
		  		following.push("<br>");
		  	}
		    
		  },
		  error: function(e){
		  	console.log(e);
		  } });


		$.ajax({
		  url: '/api/app/sendquestions',
		  dataType: 'json',
		  async: false,
		  success: function (data) {
		    for(var i=0;i<data[0].length;i++)
		  	{
		  		myquestions.push(data[0][i].title);
		  		myquestions.push("<br>");
		  	}
		  	
		    
		  },
		  error: function(e){
		  	console.log("Error");
		  } });

		$.ajax({
		  url: '/api/app/sendanswers',
		  dataType: 'json',
		  async: false,
		  success: function (data) {
		    for(var i=0;i<data.length;i++)
		  	{
		  		for(var j=0;j<data[i].length;j++)
		  		{
		  		myanswers.push(data[i][j].title);
		  		myanswers.push("<br>");
		  		}
		  	}
		  },

		  error: function(e){
		  	console.log("Error");
		  } });



		this.show(info,loginemail,quesasked,answers,followers,following,myquestions,myanswers);
	},

	show: function(info,loginemail,quesasked,answers,followers,following,myquestions,myanswers){
		$(".viewheader").html("My Profile");
		this.$el.append("" +
			"<div class='col-md-4 content-right' style='float: left;''>" +
					"<div class='cntnt-img'>" +
					"</div>" +
					"<div class='bnr-img'>" +
						"<img src='../assets/profile-img.png' width=165px height=165px alt=''/>" +
					"</div>" +
					"<div class='bnr-text'>" +
						"<h1>Quick Stats</h1>" +
						
					"</div>" +
					"<div class='btm-num'>" +
						"<ul>" +
							"<li>" +
								"<h4>" + info[0] +"</h4>" +
								"<h5>Following</h5>" +
							"</li>" +
							"<li>" +
								"<h4>" + info[1] +"</h4>" +
								"<h5>Followers</h5>" +
							"</li>" +
							"<li>" +
								"<h4>" + info[2] +"</h4>" +
								"<h5>Answers</h5>" +
							"</li>" +
						"</ul>" +
					"</div>" +				
				"</div>" +
				"</center>");

		//console.log(loginemail);
		this.$el.append("" +
			"<div class='col-md-4' style='position:relative; float:left; background-color: lightgreen; padding-top:10px; width: 450px;height: 385px;'>" +
				"<div class='bnr-num'>" +
					"<center><img src='../assets/details-img.png' width=160px height=160px alt=''/>" +
					"<br><br>" +
					"Details</center>" +
					"</div>" +
					"<table class='table'>" +
					"<tr>" +
					"<td>" +
					"Registered Email: " +
					"</td>" +
					"<td>" +
					""+ loginemail +
					"</td>" +
					"</tr>" +
					"<tr>" +
					"<td>" +
					"No of Questions asked: " +
					"</td>" +
					"<td>" +
					"" + quesasked +
					"</td>" +
					"</tr>" +
					"<tr>" +
					"<td>" +
					"No of Questions Answered: " +
					"</td>" +
					"<td>" +
					"" + answers +
					"</td>" +
					"</tr>" +
					"<br>" +
					"</table>" +
					"</div>" +
			"");


		this.$el.append("" +
			"<div class='col-md-2' style='position:relative; float:left; background-color: #b3f2fd; padding-top:10px; width: 310px;height: 200px;'>" +
			"Followers:" +
			"<br><br>" +
			"" + followers.join("") +
			"<br><br><br><br><br><br>" +
			"</div>" +
			"<div class='col-md-2' style='position:relative; border:thin yellow; overflow:auto; float:left; background-color: #b3f2fd; padding-top:10px; width: 310px; height: 185px;'>" +
			"Following:" +
			"<br><br>" +
			"" + following.join("") +
			"</div>" +
			"<div class='clearfix'> </div>" +
			"<br><br>");

		this.$el.append("" +
			"<h3 class='h3'>My Questions</h3>" +
			"<br>" +
			"" + myquestions.join("") +
			"<br><br>" +
			"<h3 class='h3'>My Answers</h3>" +
			"<br>" +
			"" + myanswers.join("") +
			"<br><br>");

		return this;
	}
});


var viewUsers = Backbone.View.extend({

events: {
		"click .onfollow": "onFollow",
	},

initialize: function(){

	var users = [];
	var follows = [];
	var ids = [];
	//var arr = [];
	$.ajax({
		  url: '/api/app/listofusers',
		  dataType: 'json',
		  async: false,
		  success: function (data) {
		  	var arr = data[0].toString().split(',');
		  	var arrid = data[1].toString().split(',');
		    for(var i=0;i<arr.length;i++)
		  	{
		  		users[i] = arr[i];
		  		ids[i] = arrid[i];
		  	}
		    
		  },
		  error: function(e){
		  	console.log("Error");
		  } });

	$.ajax({
		  url: '/api/app/followunfollow',
		  dataType: 'json',
		  async: false,
		  success: function (data) {
		  	var arr = data.toString().split(',');
		    for(var i=0;i<arr.length;i++)
		  	{
		  		follows[i] = arr[i];
		  	}
		    
		  },
		  error: function(e){
		  	console.log("Error");
		  } });


this.showusers(users,ids,follows);
},

showusers: function(users,ids,follows){
	$(".viewheader").html("All Users");
	this.$el.append("" +
	"<table class='table table-fixed' id='userstable'>" +
		"<tr>" +
		"<td>User</td>" +
		"<td>Follow / Unfollow</td>" +
		"</tr>");
	for (var i=0;i<users.length;i++)
	{
	this.$("#userstable").append("" +
		"<tr>" +
		"<td>" +
		  "" + users[i] +
		"</td>" +
		"<td>" +
		"<button class='btn btn-success onfollow' username=" + users[i] +" id='" + ids[i] + "' status=" + follows[i] + ">" + follows[i] + "</button>" +
		"</td></tr>");
	}
	this.$el.append("</table>");
	
	return this;
},
	onFollow: function(e){
		var ele = $(e.currentTarget);
		console.log(ele.attr('id'));
		console.log(ele.attr('status'));
		if (ele.attr('status') === "Follow")
		{
		$.ajax({
		  url: '/users/' + ele.attr('id') + '/follow',
		  dataType: 'json',
		  async: false,
		  success: function (data) {
		  	console.log(data);
		  	console.log("Followed");
		  	modalOpen();
				$(".bbm-modal__title").html("Great!");

				$(".bbm-modal__section").html("You are now following " + ele.attr('username'));
		    
		  },
		  error: function(e){
		  	console.log(e);
		  } });

		router.viewUsers();

		}
		if (ele.attr('status') === "Unfollow")
		{
		$.ajax({
		  url: '/users/' + ele.attr('id') + '/unfollow',
		  dataType: 'json',
		  async: false,
		  success: function (data) {
		  	console.log("Unfollowed");
		  	modalOpen();
				$(".bbm-modal__title").html("Information!");

				$(".bbm-modal__section").html("You are now unfollowing " + ele.attr('username'));
		    
		    
		  },
		  error: function(e){
		  	console.log(e);
		  } });

		router.viewUsers();

		}

	}

});


var AppRouter = Backbone.Router.extend({
	routes: {
		"": "viewFeed",
		"qfeed": "viewFeed",
		"newq": "newQues",
		"qview/:id": "viewQuesDesc",
		"profile": "viewProfile",
		"users": "viewUsers",
		//"*other": "defaultRoute"
	},

	viewUsers: function(){
		this.loadView(new viewUsers());
	},

	viewProfile: function(){
		this.loadView(new viewProfile());
	},

	viewQuesDesc: function(id){
		this.loadView(new QuesDescView({quesid: id}));
	},

	newQues: function(){
		this.loadView(new newQues());
	},

	viewFeed: function(){
			var ques = [];

		$.ajax({
		  url: '/questions',
		  dataType: 'json',
		  async: false,
		  success: function (data) {
		    //questions = new Question.Collections.Questions(data[0]);
		    var m = new Question(data, {parse: true});
		    for (var i=0; i<data.length; i++)
		    {
		    	var items = data[i];
		    		for (var j=0;j<items.length;j++)
		    		{
		    			item = items[j];
		    			//console.log(item.title);
		    			//console.log(item.askedby);
		    			var c = new Car({title: item.title, askedby: item.askedby, id: item.id});
		    			ques.push(c);
		    			//console.log(item);

		    		}
		    }
		  } });
		
		var questions = new Questions(ques);
		

		this.loadView(new QuestionsView({ collection: questions }));
	},

	viewHome: function(){
		this.loadView(new HomeView());
	},

	loadView: function(view){
		// If the currentView is set, remove it explicitly.
		if (this._currentView) {
			this._currentView.remove();
		}

		$("#cont").html(view.render().$el);
		
		this._currentView = view;
	},

	defaultRoute: function(){

	}
});






var bus = _.extend({}, Backbone.Events);

var router = new AppRouter();

Backbone.history.start();

var NavView = Backbone.View.extend({
	events: {
		"click": "onClick"
	},

	onClick: function(e){
		var $li = $(e.target);
		router.navigate($li.attr("data-url"), { trigger: true });
	}
});




var navView = new NavView({ el: "#nav" });