#! /bin/bash

# ${suffix}: "" or ".min"
# ${root}: path to root of the webclient

if [ ! -d bootstrap-typeahead ]
then
  git clone --depth 1 \
    https://github.com/bassjobsen/Bootstrap-3-Typeahead.git \
    bootstrap-typeahead
fi
cd bootstrap-typeahead
git pull
ln --force --symbolic \
  ${root}/deps/bootstrap-typeahead/bootstrap3-typeahead${suffix}.js \
  ${root}/js/bootstrap-typeahead.js
cd ..
