#! /bin/bash

# ${suffix}: "" or ".min"
# ${root}: path to root of the webclient

if [ ! -d cosy ]
then
  git clone --depth 1 \
    https://github.com/CosyVerif/library.git \
    cosy
fi
cd cosy
git pull
ln --force --symbolic \
  ${root}/deps/cosy/src/cosy.lua \
  ${root}/lua/cosy.lua
ln --force --symbolic \
  ${root}/deps/cosy/src/cosy \
  ${root}/lua/cosy
cd ..

if [ ! -d dkjson ]
then
  git clone --depth 1 \
    https://github.com/LuaDist/dkjson.git
fi
cd dkjson
git pull
ln --force --symbolic \
  ${root}/deps/dkjson/dkjson.lua \
  ${root}/lua/dkjson.lua
  sed -i -e \
    's/always_try_using_lpeg = true/always_try_using_lpeg = false/' \
    ${root}/deps/dkjson/dkjson.lua
cd ..

if [ ! -d sha1 ]
then
  git clone --depth 1 \
    https://github.com/kikito/sha1.lua.git \
    sha1
fi
cd sha1
git pull
ln --force --symbolic \
  ${root}/deps/sha1/sha1.lua \
  ${root}/lua/sha1.lua
cd ..
