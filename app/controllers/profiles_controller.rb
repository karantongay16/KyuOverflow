class ProfilesController < ApplicationController

def index
	@question = Question.where(askedby: current_user.email)
	@followers = current_user.followers
  @following = current_user.all_following
	@answer = Answer.where(answeredby: current_user.email)
	#@questiont = Question.where(title: @question.title)
  respond_to do |format|
          format.html # index.html.erb
          format.json { render :json => [@following.count, @followers.count, @answer.count] }
        end
end

def create
	@profile = Profile.new(profile_params)
  		if @question.save
  			redirect_to @profile
  		else
  			render 'new'
  		end
end

def show
  @user = User.find(params[:id])
  @question1 = Question.where(askedby: @user.email)
  @followers1 = @user.followers
  @following1 = current_user.all_following
  @answer1 = Answer.where(answeredby: @user.email)
  
end

def sendfollowingcount
  @cnt = current_user.all_following.count
  respond_to do |format|
          format.html # index.html.erb
          format.json { render :json => [@cnt] }
        end
end

private
    def profile_params
      params.require(:profile).permit(:first_name, :last_name)
    end
end