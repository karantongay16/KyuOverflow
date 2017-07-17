class Komysql.Models.Askquestion extends Backbone.Model
  paramRoot: 'askquestion'

  defaults:
    title: null
    description: null

class Komysql.Collections.AskquestionsCollection extends Backbone.Collection
  model: Komysql.Models.Askquestion
  url: '/askquestions'
