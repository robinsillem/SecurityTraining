# SecurityTraining
======

Course structure
-----

This is a self-training course on web application (including mobile) security, designed for use at Scott Logic. It's organised around the concept of quite specific attacks, presenting each attack as a single short module, so you can dip in and out, learning in bite-sized chunks.

The focus of the course is about security concerns when building web applications, which is what we do. It's not about penetration testing in general.

**Important**. In order to defend your apps against attacks you will need to learn how to run those attacks. Just because you can, does not mean you should go straight out and start hacking the world. Never do this stuff on live systems (including our own) or without the owner�s consent, and don�t inadvertently weaken the security of your own machine. 

The target audience for this course is:
* Testers
* Developers
* Architects 
* PMs and anyone else involved in web app development

Each attack is described in a Markdown file under the Attacks folder. It will consist of a description of the attack, how to run it by hand, links to automated tools, exercises and resources etc. The key to the training is DO THE EXERCISES. The concepts are not difficult here, it's the necessary attitude that is important in this area. You need to be thinking about people deliberately trying to break your app in very creative ways, and hands-on experience of doing it is a great way of getting into this mindset.

Some exercises invite developers (only) to fix the code. The course will not give coded solutions (hints, suggestions and hand-wavy how-tos for the given tech stack at best), and any fix on the sample code is going to be specific to the technology used on the sample app. So you can either take a local branch and fix on that (see below) or alternatively, build something yourself in the tech of your choice, and fiddle with that.

The vulnerable sample apps will be implementations of a simple (and not at all polished) social media app. The will all have the same UI and functionality, but will use different architecture. They are hosted in VMs (see below), but can be run from your desktop (see the individual samples for URLs). New features will be added to the samples to support new attack modules. The samples are *horribly* insecure and you will see many bad practices throughout. Try to concentrate on the specific attack under discussion. ;-) .

Currently we have two sample apps
* MEAN_stack. A modern-style SPA using Mongo / Express / Angular / Node
* Jade_Express_MySQL. A more traditional app with server-generated HTML and a SQL database

Currently we have one attack module (partially developed)
* Session hijacking via MITM

Dev/test environment setup
-----

The sample vulnerable apps and other utilities run in VMs on your local machine, set up with Vagrant.
So you'll need to install VirtualBox (you will need the latest version if you have windows 10) and Vagrant.
See https://docs.vagrantup.com/v2/getting-started/index.html if you haven't used Vagrant before.

The sample apps are node apps running on an ubuntu 14.04 VM. In these VMs the /vagrant directory is mapped to the project folder of the  The samples are run by a gulp task which watches the source files. Editing and saving source will trigger gulp task to build and restart the server, so no IDE build is required. So branching and modifying the code should also 'just work', fingers crossed. N.B. This isn't working yet. :-(

**Important.** When the vagrant file is created it installs (and where necessary builds) node packages on the (ubuntu) VM. If you run npm install on your local Windows machine it will almost certainly break your VM and you will need to recreate it. Attempting to run the samples on both the VM and locally will end in tears of rage and frustration - it's an interesting problem in itself, but has nothing to do with this course.


Running samples
-----

To run any of the samples, you navigate to the project folder. There will be a vagrantfile there, and you can start the VM with:

	vagrant up

N.B. This will take quite a while the first time you start a VM, especially the first time

When you're done (temporarily), halt it with:

	vagrant halt
	
Next time you start it will be faster to load. Or take it down completely with:

	vagrant destroy

(you may also need to remove it with Virtual box manager). 
And if you need to get medieval

	vagrant ssh


The social media samples start with an empty database. Navigate to Register, and create a new user. Then you can add posts. Currently it is not persisting sessions on the client side, so if you refresh, you'll need to log in again.

