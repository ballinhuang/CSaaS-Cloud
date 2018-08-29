#!/bin/bash

chmod 700 ./Server/Cluster/Daemons/*
chmod 700 ./Server/Process/Command/*

rm ./Server/Utils.js
touch ./Server/Utils.js
echo "import process from 'process'\nmodule.exports = () => {\n  global.BaseDir = process.cwd()\n  global.HostIP = '$1'\n  global.DBPort = '6000'\n}" >> ./Server/Utils.js

