class ReverseController < ApplicationController

  #number of questions
  @@question_numb = 10

  #passing grade threshold
  @@min_pass=7

  def equal_up_to(arr,dex)
    i=0
    while i<dex
      if arr[i][0]==arr[dex][0]
        return false
      else
        i=i+1
      end
    end
    return true
  end

  def reverse_options_arr
    arr=Array.new(@@question_numb)
    for i in (0..(@@question_numb-1))
      arr[i]=[Spell.random.reverse_name,nil,nil,nil]
      while not equal_up_to(arr,i)
        arr[i][0]=Spell.random.reverse_name
      end
    end
    arr.each{|el|
      el[1]=Faker::Pokemon.name.downcase.reverse
      el[2]=Faker::Lorem.word.downcase.reverse
      el[3]=Faker::LordOfTheRings.character.downcase.reverse
      el.shuffle!
      }
    return arr
  end

  # GET /reverse
  def show
    @options=reverse_options_arr

  end

  # POST /reverse/validate
  def validate
    correct = 0
    params.each do |k, v|
      if QuizBuilder.reverse_success?(v)
         correct = correct+1
      end
    end

    if correct>=@@min_pass
      render 'shared/success'
    else
      render 'shared/fail'
    end
  end

end
