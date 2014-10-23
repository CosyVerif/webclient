local Cosy = require "cosy"

--[[
Cosy.configure_server ("cosyverif.io", {
  www       = "www.cosyverif.io",
  rest      = "rest.cosyverif.io",
  websocket = "ws.cosyverif.io",
  username  = "alban",
  password  = "toto",
})
--]]

local model = Cosy.resource ("cosyverif.io/philosophers")
model.number = 0

-- Graph types:
model.vertex_type     = Cosy.new_type ()
model.link_type       = Cosy.new_type ()
Cosy.hide (model.vertex_type)
Cosy.hide (model.link_type)

-- Petri net types:
model.place_type      = Cosy.new_type (model.vertex_type)
model.transition_type = Cosy.new_type (model.vertex_type)
model.arc_type        = Cosy.new_type (model.link_type)
Cosy.hide (model.place_type)
Cosy.hide (model.transition_type)

function Cosy.is_place (x)
  return model.place_type < x
end

function Cosy.is_transition (x)
  return model.transition_type < x
end

function Cosy.is_arc (x)
  return model.arc_type < x
end

-- Philosophers types:
model.think_type = Cosy.new_type (model.place_type)
Cosy.set_position (model.think_type, function (x)
  local n = model.number ()
  local i = x.i ()
  return i and "${angle}:${distance}" % {
    angle    = 360 / n * i,
    distance = 300,
  }
end)
model.wait_type = Cosy.new_type (model.place_type)
Cosy.set_position (model.wait_type, function (x)
  local n = model.number ()
  local i = x.i ()
  return i and "${angle}:${distance}" % {
    angle    = 360 / n * i,
    distance = 200,
  }
end)
model.eat_type = Cosy.new_type (model.place_type)
Cosy.set_position (model.eat_type, function (x)
  local n = model.number ()
  local i = x.i ()
  return i and "${angle}:${distance}" % {
    angle    = 360 / n * i,
    distance = 100,
  }
end)
model.fork_type = Cosy.new_type (model.place_type)
Cosy.set_position (model.fork_type, function (x)
  local n = model.number ()
  local i = x.i ()
  return i and "${angle}:${distance}" % {
    angle    = 360 / n * i * 1.5,
    distance = 250,
  }
end)
model.left_type = Cosy.new_type (model.transition_type)
Cosy.set_position (model.left_type, function (x)
  local n = model.number ()
  local i = x.i ()
  return i and "${angle}:${distance}" % {
    angle    = 360 / n * i,
    distance = 250,
  }
end)
model.right_type = Cosy.new_type (model.transition_type)
Cosy.set_position (model.right_type, function (x)
  local n = model.number ()
  local i = x.i ()
  return i and "${angle}:${distance}" % {
    angle    = 360 / n * i,
    distance = 150,
  }
end)
model.release_type = Cosy.new_type (model.transition_type)
Cosy.set_position (model.release_type, function (x)
  local n = model.number ()
  local i = x.i ()
  return i and "${angle}:${distance}" % {
    angle    = 360 / n * i,
    distance =  50,
  }
end)

function Cosy.create (source, link_type, target_type, data)
  ignore (link_type, target_type)
  local place_type      = model.place_type
  local transition_type = model.transition_type
  local arc_type        = model.arc_type
  if place_type < source then
    model [#model + 1] = Cosy.new_instance (transition_type, data)
  elseif transition_type < source then
    model [#model + 1] = Cosy.new_instance (place_type, data)
  else
    assert (false)
  end
  model [#model + 1] = Cosy.new_instance (arc_type, {
    source = source,
    target = target,
  })
  return model [#model - 1]
end

local function add (model)
  model.number = model.number () + 1
  local number = model.number ()
  print ("Adding philosopher ${number}." % {
    number = number
  })
  local name      = "#${n}" % { n = number }
  local next_name = "#${n}" % { n = 1      }
  -- Compute useful things:
  local wait_next
  local fork_next
  for _, place in pairs (model) do
    if model.wait_type < place
    and place.i () == 1 then
      wait_next = place
    elseif model.fork_type < place
    and place.i () == 1 then
      fork_next = place
    end
  end
  -- Places:
  local think = Cosy.insert (model, Cosy.new_instance (model.think_type, {
    name    = name .. " is thinking",
    marking = true,
    i       = number,
  }))
  local wait = Cosy.insert (model, Cosy.new_instance (model.wait_type, {
    name    = name .. " is waiting",
    marking = false,
    i       = number,
  }))
  local eat = Cosy.insert (model, Cosy.new_instance (model.eat_type, {
    name    = name .. " is eating",
    marking = false,
    i       = number,
  }))
  local fork = Cosy.insert (model, Cosy.new_instance (model.fork_type, {
    name    = name .. "'s fork",
    marking = true,
    i       = number,
  }))
  -- Transitions:
  local left = Cosy.insert (model, Cosy.new_instance (model.left_type, {
    name = name .. " takes his fork",
    i    = number,
  }))
  Cosy.insert (model, Cosy.new_instance (model.arc_type, {
    source = think,
    target = left,
  }))
  Cosy.insert (model, Cosy.new_instance (model.arc_type, {
    source = fork,
    target = left,
  }))
  Cosy.insert (model, Cosy.new_instance (model.arc_type, {
    source = left,
    target = wait,
  }))
  local right = Cosy.insert (model, Cosy.new_instance (model.right_type, {
    name = name .. " takes " .. next_name .. "'s fork",
    i    = number,
  }))
  Cosy.insert (model, Cosy.new_instance (model.arc_type, {
    source = wait,
    target = right,
  }))
  Cosy.new_instance (model.arc_type, {
    source = wait_next,
    target = right,
  })
  Cosy.insert (model, Cosy.new_instance (model.arc_type, {
    source = right,
    target = eat,
  }))
  local release = Cosy.insert (model, Cosy.new_instance (model.release_type, {
    name = name .. " releases forks",
    i    = number,
  }))
  Cosy.insert (model, Cosy.new_instance (model.arc_type, {
    source = eat,
    target = release,
  }))
  Cosy.insert (model, Cosy.new_instance (model.arc_type, {
    source = release,
    target = think,
  }))
  Cosy.insert (model, Cosy.new_instance (model.arc_type, {
    source = release,
    target = fork,
  }))
  Cosy.insert (model, Cosy.new_instance (model.arc_type, {
    source = release,
    target = fork_next,
  }))
  -- Arcs that pointed to the first philosophers must also
  -- be updated:
  for _, arc in pairs (model) do
    if Cosy.is_arc (arc)
    and Cosy.is (Cosy.source (arc), model.release_type)
    and Cosy.is (Cosy.target (arc), model.fork_type)
    and Cosy.source (arc).i == number - 1
    and Cosy.target (arc).i == 1 then
      arc.target = fork
    elseif Cosy.is_arc (arc)
    and Cosy.is (Cosy.source (arc), model.wait_type)
    and Cosy.is (Cosy.target (arc), model.right_type)
    and Cosy.source (arc).i == 1
    and Cosy.target (arc).i == number - 1 then
      arc.source = wait
    end
  end
end

model.button_type = Cosy.new_type (model.transition_type)
model.insert = Cosy.new_instance (model.button_type, {
  name = "+1"
})
model.stop   = Cosy.new_instance (model.button_type, {
  name = "stop"
})

-- Add two philosophers:
add (model)
add (model)

Cosy.on_write( function (target)
  if model.insert <= target and Cosy.is_selected (model.insert) then
    Cosy.deselect (model.insert)
    add (model)
  elseif model.stop <= target and Cosy.is_selected (model.stop) then
    Cosy.remove (model.insert)
    Cosy.remove (model.stop)
    Cosy.stop ()
  end
end)
