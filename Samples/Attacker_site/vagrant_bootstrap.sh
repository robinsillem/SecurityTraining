#!/bin/sh

# Required for mongodb install
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list

sudo apt-get update
sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo apt-get install -y mongodb-org

sudo service mongod start

rm -rf /vagrant/node_modules
cd /vagrant
sudo npm install

sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo npm install -g gulp

cp /vagrant/Attacker_site.conf /etc/init

# And start the server
gulp dev
