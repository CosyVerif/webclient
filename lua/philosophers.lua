local Cosy = require "cosy.helper"

local function think_position (x)
  local i = x.i ()
  local n = (x / 2).number ()
  local angle = 360 / (n+1)
  Cosy.set_position (x, "40:${angle}" % { angle = angle * i })
end

local function wait_position (x)
  local i = x.i ()
  local n = (x / 2).number ()
  local angle = 360 / (n+1)
  Cosy.set_position (x, "20:${angle}" % { angle = angle * i })
end

local function eat_position (x)
  local i = x.i ()
  local n = (x / 2).number ()
  local angle = 360 / (n+1)
  Cosy.set_position (x, "10:${angle}" % { angle = angle * i })
end

local function fork_position (x)
  local i = x.i ()
  local n = (x / 2).number ()
  local angle = 360 / (n+1)
  Cosy.set_position (x, "30:${angle}" % { angle = angle * i + angle / 2 })
end

local function left_position (x)
  local i = x.i ()
  local n = (x / 2).number ()
  local angle = 360 / (n+1)
  Cosy.set_position (x, "35:${angle}" % { angle = angle * i })
end

local function right_position (x)
  local i = x.i ()
  local n = (x / 2).number ()
  local angle = 360 / (n+1)
  Cosy.set_position (x, "15:${angle}" % { angle = angle * i })
end

local function release_position (x)
  local i = x.i ()
  local n = (x / 2).number ()
  local angle = 360 / (n+1)
  Cosy.set_position (x, "05:${angle}" % { angle = angle * i })
end

local function add (model)
  model.number = model.number () + 1
  local number = model.number ()
  print ("Adding philosopher ${number}." % {
    number = number
  })
  local name      = "#${n}" % { n = number }
  local next_name = "#${n}" % { n = 1      }
  -- Update all positions:
  for _, x in pairs (model) do
    if Cosy.is_instance (x) then
      if Cosy.is (x, model.think_type) then
        think_position (x)
      elseif Cosy.is (x, model.wait_type) then
        wait_position (x)
      elseif Cosy.is (x, model.eat_type) then
        eat_position (x)
      elseif Cosy.is (x, model.fork_type) then
        fork_position (x)
      elseif Cosy.is (x, model.left_type) then
        left_position (x)
      elseif Cosy.is (x, model.right_type) then
        right_position (x)
      elseif Cosy.is (x, model.release_type) then
        release_position (x)
      end
    end
  end
  -- Compute useful things:
  local wait_next
  local fork_next
  for _, place in pairs (model) do
    if Cosy.is (place, model.wait_type)
    and place.i () == 1 then
      wait_next = place
    elseif Cosy.is (place, model.fork_type)
    and place.i () == 1 then
      fork_next = place
    end
  end
  -- Places:
  local think = Cosy.instantiate (model, model.think_type, {
    name    = name .. " is thinking",
    marking = true,
    i       = number,
  })
  think_position (think)
  local wait = Cosy.instantiate (model, model.wait_type, {
    name    = name .. " is waiting",
    marking = false,
    i       = number,
  })
  wait_position (wait)
  local eat = Cosy.instantiate (model, model.eat_type, {
    name    = name .. " is eating",
    marking = false,
    i       = number,
  })
  eat_position (eat)
  local fork = Cosy.instantiate (model, model.fork_type, {
    name    = name .. "'s fork",
    marking = true,
    i       = number,
  })
  fork_position (fork)
  -- Transitions:
  local left = Cosy.instantiate (model, model.left_type, {
    name = name .. " takes his fork",
    i    = number,
  })
  left_position (left)
  Cosy.instantiate (model, model.arc_type, {
    source = think,
    target = left,
  })
  Cosy.instantiate (model, model.arc_type, {
    source = fork,
    target = left,
  })
  Cosy.instantiate (model, model.arc_type, {
    source = left,
    target = wait,
  })
  local right = Cosy.instantiate (model, model.right_type, {
    name = name .. " takes " .. next_name .. "'s fork",
    i    = number,
  })
  right_position (right)
  Cosy.instantiate (model, model.arc_type, {
    source = wait,
    target = right,
  })
  Cosy.instantiate (model, model.arc_type, {
    source = wait_next,
    target = right,
  })
  Cosy.instantiate (model, model.arc_type, {
    source = right,
    target = eat,
  })
  local release = Cosy.instantiate (model, model.release_type, {
    name = name .. " releases forks",
    i    = number,
  })
  release_position (release)
  Cosy.instantiate (model, model.arc_type, {
    source = eat,
    target = release,
  })
  Cosy.instantiate (model, model.arc_type, {
    source = release,
    target = think,
  })
  Cosy.instantiate (model, model.arc_type, {
    source = release,
    target = fork,
  })
  Cosy.instantiate (model, model.arc_type, {
    source = release,
    target = fork_next,
  })
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

local model = Cosy.resource ("cosyverif.io/philosophers")
model.number = 0

-- Create types:
model.place_type = {}
model.transition_type = {}
model.arc_type = {}

model.think_type   = model.place_type * {}
model.wait_type    = model.place_type * {}
model.eat_type     = model.place_type * {}
model.fork_type    = model.place_type * {}
model.left_type    = model.transition_type * {}
model.right_type   = model.transition_type * {}
model.release_type = model.transition_type * {}

-- Add two philosophers:
add (model)
add (model)

model.insert = Cosy.instantiate (model, model.transition_type, {
  name = "+1"
})
model.stop   = Cosy.instantiate (model, model.transition_type, {
  name = "stop"
})

Data.on_write.philosophers = function (target)
  if model.insert <= target and Cosy.is_selected (model.insert) then
    Cosy.deselect (model.insert)
    add (model)
  elseif model.stop <= target and Cosy.is_selected (model.stop) then
    Cosy.remove (model.insert)
    Cosy.remove (model.stop)
    Cosy.stop ()
  end
end

