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
