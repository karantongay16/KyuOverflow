
$(document).ready(function(){
	var todoItems = new askquestion();
	todoItems.fetch();

	var todoItemsView = new quesView({ model: todoItems });
	$("body").append(todoItemsView.render().$el);
});