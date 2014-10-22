local profiler = false

if profiler then
  profiler = require "profiler"
  profiler:start()
end

local Cosy  = require "cosy.cosy"
local model = Cosy.root ["cosyverif.io/model"]
local max_i = 10
local max_j = 10
local max_k = 10
local max_l = 10
local schemes = {}
local scheme

schemes.nested_writes = function ()
  scheme = "nested writes"
  for i = 1, max_i do
    local di = model [i]
    for j = 1, max_j do
      local dj = di [j]
      for k = 1, max_k do
        local dk = dj [k]
        for l = 1, max_l do
          local dl = dk [l]
          dl.x = i + j + k + l
        end
      end
    end
  end
end

schemes.flat_writes = function ()
  scheme = "flat writes"
  for i = 1, max_i * max_j * max_k * max_l do
    model [i] = i
  end
end

schemes.flat_read_writes = function ()
  scheme = "flat read / write"
  model [0] = 1
  for i = 1, max_i * max_j * max_k * max_l do
    model [i] = model [i-1] ()
  end
end

local arg = arg or {}

local scheme_key = arg [1]
if not scheme_key then
  scheme_key = "flat_read_writes"
end
print ("scheme: " .. scheme_key)
local f = schemes [scheme_key]
if not f then
  print ("Unknown scheme.")
  print ("Available schemes:")
  for k in pairs (schemes) do
    print ("  " .. k)
  end
  os.exit (2)
end

local start = os.time ()
f ()
local finish = os.time ()

if profiler then
  profiler:stop()
  profiler:writeReport("profiler.txt")
end
collectgarbage ()

print ("Scheme         : " .. scheme .. ".")
local duration = finish - start
print ("Time           : " .. tostring (duration) .. " seconds.")
local memory = math.ceil (collectgarbage ("count")/1024)
print ("Memory         : " .. tostring (memory) .. " Mbytes.")
local count  = max_i * max_j * max_k * max_l
print ("Performed      : " .. tostring (count) .. " writes.")
local average_time = math.floor (count / duration)
print ("Average time   : " .. tostring (average_time) .. " writes / second.")
local average_memory = math.floor (memory*1024*1024 / count)
print ("Average memory : " .. tostring (average_memory) .. " bytes / object.")
