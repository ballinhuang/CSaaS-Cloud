#!/bin/bash

redis-server --daemonize yes
npm run startdb
npm run creatuser
npm run serve

exit 1