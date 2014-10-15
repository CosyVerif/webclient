#! /bin/bash

# ${suffix}: "" or ".min"
# ${root}: path to root of the webclient

if [ ! -d lua ]
then
  git clone --depth 1 \
    https://github.com/daurnimator/lua.vm.js.git \
    lua
fi
cd lua
git pull
ln --force --symbolic \
  ${root}/deps/lua/dist/lua.vm.js \
  ${root}/js/lua.vm.js
cd ..
