# Attacker Site

This is a SPA using Mongo / Express / Angular / Node like the MEAN Site.

It simulates a simple attacker website in charge of collecting information sent to its logging API.
It also displays the receied information specifying the IP, type and value of the stolen information.

It was built in VS2015 with Node.js Tools installed, but should port to any other IDE.
The project build process uses gulp  

The vagrant file maps this project folder to /vagrant on the VM.
The application appears at http://10.10.10.11/ . The VM uses host-only networking - a network that is private to your host and the guest machines on that host.