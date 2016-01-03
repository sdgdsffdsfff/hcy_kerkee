#!/bin/sh
#npm install requirejs -g
source ./config.sh

echo "rjs.sh":$(pwd)
cd ${basePath}/${devRootDir}/build
echo $(pwd)

if [ "$1" = "client" ];
then
	node r.js -o build.js
else
	node r.js -o webbuild.js
fi