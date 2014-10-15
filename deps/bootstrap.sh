#! /bin/bash

# ${suffix}: "" or ".min"
# ${root}: path to root of the webclient

if [ ! -d bootstrap ]
then
  git clone --depth 1 \
    https://github.com/twbs/bootstrap.git
fi
cd bootstrap
git pull
ln --force --symbolic \
  ${root}/deps/bootstrap/dist/js/bootstrap${suffix}.js \
  ${root}/js/bootstrap.js
ln --force --symbolic \
  ${root}/deps/bootstrap/dist/css/bootstrap${suffix}.css \
  ${root}/css/bootstrap.css
ln --force --symbolic \
  ${root}/deps/bootstrap/dist/css/bootstrap-theme${suffix}.css \
  ${root}/css/bootstrap-theme.css
ln --force --symbolic \
  ${root}/deps/bootstrap/dist/fonts/glyphicons-halflings-regular.eot \
  ${root}/fonts/glyphicons-halflings-regular.eot
ln --force --symbolic \
  ${root}/deps/bootstrap/dist/fonts/glyphicons-halflings-regular.svg \
  ${root}/fonts/glyphicons-halflings-regular.svg
ln --force --symbolic \
  ${root}/deps/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf \
  ${root}/fonts/glyphicons-halflings-regular.ttf
ln --force --symbolic \
  ${root}/deps/bootstrap/dist/fonts/glyphicons-halflings-regular.woff \
  ${root}/fonts/glyphicons-halflings-regular.woff
cd ..
