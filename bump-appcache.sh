#!/bin/sh
######
# Adapted from vojtajina's angularjs.org pre-commit hook
# https://github.com/vojtajina/angularjs.org/blob/5181ee776af77f7e107e74201976b3c2d9a949ca/dev/appcache/build-manifest.sh
#
# Shell script for generating manifest.appcache from manifest.appcache.tpl
# To be used as git pre-commit hook
#
# To install as git pre-commit hook:
# >> cp build-manifest.sh .git/hooks/pre-commit
#
# Or create a symlink
# >> ln -s ../../build-manifest.sh .git/hooks/pre-commit

# new line which works both on Mac and Linux
NL="\\
"

# replace timestamp and file list and output to appcache.manifest
TIMESTAMP=`date -u`
sed "s;%TIMESTAMP%;$TIMESTAMP;" manifest.appcache.tpl > manifest.appcache

# stage the changes so that they are part of the commit
git stage manifest.appcache
