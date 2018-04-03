class CounterController < ApplicationController

  #number of questions
  @@question_numb = 10

  #passing grade threshold
  @@min_pass=7

  def equal_up_to(arr,dex)
    i=0
    while i<dex
      if arr[i]==arr[dex]
        return false
      else
        i=i+1
      end
    end
    return true
  end

  def unique_spells
    arr=Array.new(@@question_numb)
    for i in (0..(@@question_numb-1))
      arr[i]=Spell.random
      while not equal_up_to(arr,i)
        arr[i]=Spell.random
      end
    end
    return arr
  end


  def q_options(spells)
    arr=[]
    spells.each{|spell| arr.append(QuizBuilder.counter_options(spell))}
    return arr
  end
  # GET /counter
  def show

    @spells = unique_spells
    @options = q_options(@spells)
  end

  # POST /counter/validate
  def validate
    #correct=0
    #params.each do |k,v|
      #if QuizBuilder.
    if QuizBuilder.counter_success?(params[:answer].to_i, params[:spell_mention_count].to_i)
      render 'shared/success'
    else
      render 'shared/fail'
    end
  end

end
