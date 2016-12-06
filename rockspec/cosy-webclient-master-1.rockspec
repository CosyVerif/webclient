package = "cosy-webclient"
version = "master-1"
source  = {
  url    = "git+https://github.com/cosyverif/webclient.git",
  branch = "master",
}

description = {
  summary    = "CosyVerif: webclient",
  detailed   = [[
    Web client of the CosyVerif platform.
  ]],
  homepage   = "http://www.cosyverif.org/",
  license    = "MIT/X11",
  maintainer = "Alban Linard <alban@linard.fr>",
}

dependencies = {
  "lua >= 5.1",
  "cosy-client",
  "dkjson",
  "lapis",
}

build = {
  type    = "builtin",
  modules = {
    ["config"                ] = "config.lua",
    ["cosy.webclient.adapter"] = "src/cosy/webclient/adapter.lua",
    ["cosy.webclient.test"   ] = "src/cosy/webclient/test.lua",
  },
}
