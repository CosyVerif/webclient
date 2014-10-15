#! /bin/bash

# ${suffix}: "" or ".min"
# ${root}: path to root of the webclient

if [ ! -d jquery-fullscreen ]
then
  git clone --depth 1 \
    https://github.com/kayahr/jquery-fullscreen-plugin.git \
    jquery-fullscreen
fi
cd jquery-fullscreen
git pull
if [ "${suffix}" = ".min" ]
then
  ln --force --symbolic \
    ${root}/deps/jquery-fullscreen/jquery.fullscreen-min.js \
    ${root}/js/jquery-fullscreen.js
else
  ln --force --symbolic \
    ${root}/deps/jquery-fullscreen/jquery.fullscreen.js \
    ${root}/js/jquery-fullscreen.js
fi
cd ..
