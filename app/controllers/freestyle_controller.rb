class FreestyleController < ApplicationController

  # GET /freestyle
  def show
    @spell_data_str   = Spell.data
    @mention_data_str = Mention.data
  end

  # POST /freestyle/validatebbabe
  def validate
  end

end
