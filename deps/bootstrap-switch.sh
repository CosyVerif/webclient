#! /bin/bash

# ${suffix}: "" or ".min"
# ${root}: path to root of the webclient

if [ ! -d bootstrap-switch ]
then
  git clone --depth 1 \
    https://github.com/nostalgiaz/bootstrap-switch.git
fi
cd bootstrap-switch
git pull
ln --force --symbolic \
  ${root}/deps/bootstrap-switch/dist/js/bootstrap-switch${suffix}.js \
  ${root}/js/bootstrap-switch.js
ln --force --symbolic \
  ${root}/deps/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch${suffix}.css \
  ${root}/css/bootstrap-switch.css
cd ..
