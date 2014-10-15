#! /bin/bash

# ${suffix}: "" or ".min"
# ${root}: path to root of the webclient

if [ ! -d d3 ]
then
  git clone --depth 1 \
    https://github.com/mbostock/d3.git
fi
cd d3
git pull
ln --force --symbolic \
  ${root}/deps/d3/d3${suffix}.js \
  ${root}/js/d3.js
cd ..
