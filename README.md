# SecurityTraining
======

Code and other resources for internal security training
======


Dev environment setup
-----

The sample vulnerable apps and other utilities run in VMs on your local machine, set up with Vagrant
See https://docs.vagrantup.com/v2/getting-started/index.html if you haven't used Vagrant before.

We use a bunch of boxes, set up with:

    vagrant box add hashicorp/precise32

To run any of the samples, you navigate to the project folder. There will be a vagrantfile there, and you can start the VM with:

	vagrant up

and halt it with:

	vagrant halt
	
or take it down completely with:

	vagrant destroy
	
