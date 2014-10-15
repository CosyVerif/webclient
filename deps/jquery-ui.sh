#! /bin/bash

# ${suffix}: "" or ".min"
# ${root}: path to root of the webclient

if [ ! -d jquery-ui ]
then
  git clone --depth 1 \
    https://github.com/jquery/jquery-ui.git
fi
cd jquery-ui
git pull
npm install
grunt concat
grunt uglify
ln --force --symbolic \
  ${root}/deps/jquery-ui/dist/jquery-ui${suffix}.js \
  ${root}/js/jquery-ui.js
ln --force --symbolic \
  ${root}/deps/jquery-ui/dist/i18n/jquery-ui-i18n${suffix}.js \
  ${root}/js/jquery-ui-i18n.js
ln --force --symbolic \
  ${root}/deps/jquery-ui/dist/jquery-ui.css \
  ${root}/css/jquery-ui.css
cd ..
