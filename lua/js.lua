-- Utilities to load Lua packages
-- ==============================

js.global:eval [[
  window.load = function (url) {
    try {
      var xhr = new XMLHttpRequest ();
      xhr.open ("GET", url, false);
      xhr.send (null);
      if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
        return xhr.responseText;
      } else {
        return undefined;
      }
    } catch (err) {
      return undefined;
    }
  }
]]

local function load_http (url)
  local code = js.global:load (url)
  if code then
    return loadstring (code, url)
  else
    error ("Unable to load: " .. url)
  end
end

package.path  = ""
package.cpath = ""

table.insert (package.searchers, 1, function (name)
  if not name:match ("^https?://") then
    local url = "lua/" .. name:gsub ("%.", "/") .. ".lua"
    return load_http (url)
  end
end)

table.insert (package.searchers, 1, function (name)
  if name:match ("^https?://") then
    return load_http (name)
  end
end)

do
  -- Create js.ipairs and js.pairs functions. attach as __pairs and __ipairs on JS userdata objects.
  local _PROXY_MT = debug.getregistry()._PROXY_MT

  -- Iterates from 0 to collection.length-1
  local function js_inext(collection, i)
    i = i + 1
    if i >= collection.length then return nil end
    return i, collection[i]
  end
  function js.ipairs(collection)
    return js_inext, collection, -1
  end
  _PROXY_MT.__ipairs = js.ipairs

  local function js_next(collection, last)
    if i >= collection.length then return nil end
    return i, collection[i]
  end
  function js.pairs(ob)
    local keys = js.global.Object:getOwnPropertyNames(ob) -- Should this be Object.keys?
    local i = 0
    return function(ob, last)
      local k = keys[i]
      i = i + 1;
      return k, ob[k]
    end, ob, nil
  end
  _PROXY_MT.__pairs = js.pairs
end

js.global:eval [[
Lua.executeScript = function(src) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", src, false);
  xhr.send(null);
  if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
    console.log("Downloaded Lua script: " + src);
    L.execute(xhr.responseText);
    console.log("Executed Lua script: " + src);
  } else {
    console.log("Unable to fetch Lua script: " + src);
  }
};
]]
