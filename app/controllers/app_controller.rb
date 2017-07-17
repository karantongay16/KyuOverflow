class AppController < ApplicationController

before_action :authenticate_user!

def index

end

# Controllers for Profiles View #

def senduser
		@question = Question.where(askedby: current_user.email)
		@answer = Answer.where(answeredby: current_user.email)
		respond_to do |format|
  		    format.html # index.html.erb
  		    format.json { render :json => [current_user.email, @question.count, @answer.count] }
  		  end
end

def sendfollows
	
	@followers1 = current_user.followers
	@following1 = current_user.all_following
	respond_to do |format|
  		    format.html # index.html.erb
  		    format.json { render :json => [@followers1, @following1] }
  		  end
end

def sendquestions

	@question = Question.where(askedby: current_user.email)
	respond_to do |format|
  		    format.html # index.html.erb
  		    format.json { render :json => [@question] }
  		  end

end

def sendanswers

	ans = []
	@answer = Answer.where(answeredby: current_user.email)
	@answer.each do |a|
		ans.push(Question.find(a.question_id))
	end
	respond_to do |format|
  		    format.html # index.html.erb
  		    format.json { render :json => [ans] }
  		  end

end


# End of Controllers for Profiles View #



# Controllers for Users View #

def listofusers

	usersemail = []
	usersid = []
	@users = User.all
	@users.each do |user|

		if user.email != current_user.email
			usersemail.push(user.email)
			usersid.push(user.id)
		end

	end

	respond_to do |format|
  		    format.html # index.html.erb
  		    format.json { render :json => [usersemail, usersid] }
  		  end

end

def followunfollow

	users = []
	@users = User.all
	@users.each do |user|
	if user.email != current_user.email
		if current_user.following?(user)
			users.push("Unfollow");
		else
			users.push("Follow");
		end
	end
	end

	respond_to do |format|
  		    format.html # index.html.erb
  		    format.json { render :json => [users] }
  		  end

end


end