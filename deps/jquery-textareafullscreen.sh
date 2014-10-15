#! /bin/bash

# ${suffix}: "" or ".min"
# ${root}: path to root of the webclient

if [ ! -d jquery-textareafullscreen ]
then
  git clone --depth 1 \
    https://github.com/CreoArt/jquery.textareafullscreen.git \
    jquery-textareafullscreen
fi
cd jquery-textareafullscreen
git pull
ln --force --symbolic \
  ${root}/deps/jquery-textareafullscreen/jquery.textareafullscreen.js \
  ${root}/js/jquery-textareafullscreen.js
ln --force --symbolic \
  ${root}/deps/jquery-textareafullscreen/textareafullscreen.css \
  ${root}/css/textareafullscreen.css
cd ..
