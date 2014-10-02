local Data = require "cosy.data"
local model = cosy ["my_model"]

model.place_type = {}
model.place_type [tostring (model.place_type)] = true

model.transition_type = {}
model.transition_type [tostring (model.transition_type)] = true

model.arc_type = {}
model.arc_type [tostring (model.arc_type)] = true

model.p1 = model.place_type * {
  name  = "p1",
  token = 0,
  [Tag.POSITION   ] = "100:45",
  [Tag.SELECTED   ] = false,
  [Tag.HIGHLIGHTED] = false,
  [Tag.INSTANCE   ] = true,
}

model.a1 = model.arc_type * {
  source = model.p1,
  target = model.p1,
  [Tag.INSTANCE] = true,
}

Data.clear (model.a1)
Data.clear (model.p1)
