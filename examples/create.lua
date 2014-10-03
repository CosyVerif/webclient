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
  token = 1,
  [Tag.POSITION   ] = "0,0",
  [Tag.SELECTED   ] = false,
  [Tag.HIGHLIGHTED] = true,
  [Tag.INSTANCE   ] = true,
}

model.t1 = model.transition_type * {
  name  = "t1",
  [Tag.POSITION   ] = "100,100",
  [Tag.SELECTED   ] = false,
  [Tag.HIGHLIGHTED] = false,
  [Tag.INSTANCE   ] = true,
}

model.p2 = model.place_type * {
  name  = "p2",
  token = 1,
  [Tag.POSITION   ] = "100,150",
  [Tag.SELECTED   ] = false,
  [Tag.HIGHLIGHTED] = false,
  [Tag.INSTANCE   ] = true,
}

model.t2 = model.transition_type * {
  name  = "t2",
  [Tag.POSITION   ] = "-100,100",
  [Tag.SELECTED   ] = false,
  [Tag.HIGHLIGHTED] = false,
  [Tag.INSTANCE   ] = true,
}

model.p3 = model.place_type * {
  name  = "p3",
  token = 0,
  [Tag.POSITION   ] = "-100, 150",
  [Tag.SELECTED   ] = false,
  [Tag.HIGHLIGHTED] = false,
  [Tag.INSTANCE   ] = true,
}

model.a1 = model.arc_type * {
  source = model.p1,
  target = model.t1,
  [Tag.INSTANCE] = true,
}

model.a2 = model.arc_type * {
  source = model.t1,
  target = model.p2,
  [Tag.INSTANCE] = true,
}

model.a3 = model.arc_type * {
  source = model.p1,
  target = model.t2,
  [Tag.INSTANCE] = true,
}

model.a4 = model.arc_type * {
  source = model.t2,
  target = model.p3,
  [Tag.INSTANCE] = true,
}
