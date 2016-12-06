local Config = require "lapis.config"

local common = {
  host        = "localhost",
  port        = 8080,
  num_workers = assert (tonumber (os.getenv "NUM_WORKERS")),
  code_cache  = "on",
  api_port    = assert (os.getenv "API_PORT"),
}

Config ({ "test", "development", "production" }, common)
