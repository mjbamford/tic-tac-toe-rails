Rails.application.routes.draw do
  resource :game do
    get :draw, on: :collection
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
