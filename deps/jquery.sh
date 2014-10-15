#! /bin/bash

# ${suffix}: "" or ".min"
# ${root}: path to root of the webclient

if [ ! -d jquery ]
then
  git clone --depth 1 \
    https://github.com/jquery/jquery
fi
cd jquery
git pull
npm install
grunt build
grunt uglify
ln --force --symbolic \
  ${root}/deps/jquery/dist/jquery${suffix}.js \
  ${root}/js/jquery.js
cd ..
