#! /bin/bash

# ${suffix}: "" or ".min"
# ${root}: path to root of the webclient

if [ ! -d awesome ]
then
  git clone --depth 1 \
    https://github.com/FortAwesome/Font-Awesome.git \
    awesome
fi
cd awesome
git pull
ln --force --symbolic \
  ${root}/deps/awesome/css/font-awesome${suffix}.css \
  ${root}/css/font-awesome.css
ln --force --symbolic \
  ${root}/deps/awesome/fonts/FontAwesome.otf \
  ${root}/fonts/FontAwesome.otf
ln --force --symbolic \
  ${root}/deps/awesome/fonts/fontawesome-webfont.eot \
  ${root}/fonts/fontawesome-webfont.eot
ln --force --symbolic \
  ${root}/deps/awesome/fonts/fontawesome-webfont.svg \
  ${root}/fonts/fontawesome-webfont.svg
ln --force --symbolic \
  ${root}/deps/awesome/fonts/fontawesome-webfont.ttf \
  ${root}/fonts/fontawesome-webfont.ttf
ln --force --symbolic \
  ${root}/deps/awesome/fonts/fontawesome-webfont.woff \
  ${root}/fonts/fontawesome-webfont.woff
cd ..
