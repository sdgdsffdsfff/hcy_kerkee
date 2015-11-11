#!/bin/bash
#cp ./gulpfile.js ../
#cp ./sendInfo.py ../
#cp ./package.json ../
#cd ../

source ./config.sh
echo $project

perl -pi -e 's/config_basePath="[^"]*/config_basePath="'$basePath'/;
             s/config_devRootDir="[^"]*/config_devRootDir="'$devRootDir'/;' gulpfile.js


dev="/bin/dev_*.zip"
dest="/bin/html_*.zip"
ntfile="/bin/html_*.nt";
sohuKey_linux="SohuKeyDemo_android/tools/SohuKey_linux"
ip="10.0.119.81"

if [ $# -eq 1 ];then
   if [ "$1" = "node" ];then
        echo "start node server..."
        supervisor server.js

   elif [ "$1" = "tree" ];then
        tree "$project" -L 2

   elif [ "$1" = "size" ];then
        #stat -c "%n:%s" "$path"
        du -x ${project}${dest}
        du -x ${project}${dev}

   elif [ "$1" = "ent" ];then
        d=`date '+%m%d%H%M%S'`
        rm -rf ${project}/bin/html_*.nt
        ${sohuKey_linux} -i ${project}${dest} -o ${project}/bin/html_${d}.nt -k ${project} -e

   elif [ "$1" = "dnt" ];then
        d=`date '+%m%d%H%M%S'`
        ${sohuKey_linux} -i ${project}${ntfile} -o ${project}/bin/html_nt_${d}.zip -k ${project} -d

   elif [ "$1" = "adb" ];then
        adb connect ${ip}

   elif [ "$1" = "send" ];then
        python sendInfo.py

#   elif [ "$1" = "pub" ];then
#        du -x ${project}${dest}
#        du -x ${project}${dev}
#        echo copy going..................
#        cp /home/huangjian/workstation/bridge/shframeworkseed/html -vur /home/huangjian/workstation/smc-portal-wap/WebContent/active/33
#        cp /home/huangjian/workstation/bridge/shframeworkseed/bin -vur /home/huangjian/workstation/smc-portal-wap/WebContent/active/33
#        echo copy end..................

   else
        echo "tasking $1:"
        gulp $1 -debug
   fi
else
    echo "tasking default:"
    gulp -debug
fi