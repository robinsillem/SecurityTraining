#!/usr/bin/env bash

apt-get update
apt-get install -y nodejs

cd /MEAN_stack
node server.js &
