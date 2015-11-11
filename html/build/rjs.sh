#!/bin/sh
#npm install requirejs -g
source ./config.sh

echo "rjs.sh":$(pwd)
cd ${basePath}/${devRootDir}/build
echo $(pwd)
node r.js -o build.js
