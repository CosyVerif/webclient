#! /bin/bash

# ${suffix}: "" or ".min"
# ${root}: path to root of the webclient

if [ ! -d handlebars ]
then
  git clone --depth 1 \
    https://github.com/wycats/handlebars.js.git \
    handlebars
fi
cd handlebars
git pull
npm install
grunt build
grunt uglify
ln --force --symbolic \
  ${root}/deps/handlebars/dist/handlebars${suffix}.js \
  ${root}/js/handlebars.js
cd ..
