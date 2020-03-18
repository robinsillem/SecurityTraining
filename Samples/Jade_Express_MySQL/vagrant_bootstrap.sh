#!/bin/sh

sudo apt-get update
sudo apt-get install -y nodejs
sudo apt-get install -y npm

# MySQL install and DB creation
sudo DEBIAN_FRONTEND=noninteractive apt-get -y install mysql-server
mysqladmin -u root password sec_training
mysql -u root -psec_training -e "CREATE database sec_training"
mysql -u root -psec_training -e "CREATE database some_other_database"
mysql -u root -psec_training sec_training < /vagrant/db/create.sql
mysql -u root -psec_training some_other_database < /vagrant/db/create.sql
mysql -u root -psec_training -e "GRANT ALL PRIVILEGES ON sec_training.* To 'sec_train_web'@'localhost' IDENTIFIED BY 'web_pass'"

rm -rf /vagrant/node_modules
cd /vagrant
sudo npm install

sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo npm install -g gulp

cp /vagrant/Jade_Express_MySQL.conf /etc/init

# And start the server
gulp dev
