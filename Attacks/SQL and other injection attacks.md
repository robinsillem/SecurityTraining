Security training #2 - SQL and other injection attacks
=====

Level: 

What is this attack?
-----

Many (most?) real-world websites interact with other back-end systems by sending them commands to do things - this can be databases, the OS, the file system, external services, actual physical hardware including large real-world machinery, whatever. This is a normal part of their operations, and is part of the design of the system.

Many (most?) real-world websites also accept input from users. This generally comes from front-end clients, but it can also come from other back end systems (including the databases used by the site). The web application has no control over what input is presented to it - it is *untrusted*. This is a normal part of their operations, and is part of the design of the system.

Many (most?) real-world websites use this input in the construction of the commands to external systems. This is a normal part of their operations, and is part of the design of the system.

Injection attacks occur when the web application passes maliciously crafted input data into an external system in a form which can damage that system. This may or may not damage the website itself (in the narrow sense), but it's certainly doing to damage something or someone somehow. Note that I said 'the web application passes...', not 'an attacker presents...'. As an application developer *it is your fault* if this happens - you must expect input data to be malicious.

Note also, that I haven't mentioned SQL anywhere there. SQL injection has been known about for many years (and is still the #1 vulnerability), but injection attacks apply to all kinds of back end systems. Having said that, SQL databases are very common targets, and they tend to be powerful things that can open up other systems to attack. Obviously, the various databases and back end systems each have their own very specific command language or dialect, so the input used for injection attacks tend to be very carefully crafted to suit specific target. You can assume that a serious attacker may know more about the obscure corners of the target and its command language than you do - your focus is on getting it to do what you want, not how to break it. You may also assume that any unskilled attacker has access to tools written by someone who knows all that stuff.


Real-world examples
-----

Scared yet? You should be. 

Talk-talk. DDoS distraction followed by SQL injection. [https://itsecuritything.com/talktalk-breach-comedy-of-security-errors/](https://itsecuritything.com/talktalk-breach-comedy-of-security-errors/)

VTech. [http://www.troyhunt.com/2015/11/when-children-are-breached-inside.html](http://www.troyhunt.com/2015/11/when-children-are-breached-inside.html)

Many (but not all) of the big data breaches, the list goes on and on.

Stuxnet. A complex attack using SQL injection as one link is a chain of attack, resulting in physical damage to centrifuges at a uranium enrichment plant. [http://www.langner.com/en/2011/06/07/enumerating-stuxnet%E2%80%99s-exploits/](http://www.langner.com/en/2011/06/07/enumerating-stuxnet%E2%80%99s-exploits/)

And no discussion of SQLi would be complete without the classic piggy-backed query in [https://xkcd.com/327/](https://xkcd.com/327/)


Exercise 0. Moving on from a previous module
-----

If you're moving on from a different module in this course you may want to clean up your system somewhat:

* Kill the sample app VMs with vagrant destroy.
* Make sure you're using the right commit for this module - a variety of new features and vulnerabilities have been added to support it. The commit ID is <commit ID here>, tagged SQL_injection_presentation.
* Reset the Fiddler rules - delete the customrules.js file inside your \Documents\Fiddler2\Scripts folder.
* Recreate the sample apps (and new databases) with vagrant up. 


Exercise 1. Defeating the login page
-----

MySQL workbench / command line [http://dev.mysql.com/doc/refman/5.7/en/mysql.html](http://dev.mysql.com/doc/refman/5.7/en/mysql.html), mongo client [https://docs.mongodb.org/manual/reference/mongo-shell/](https://docs.mongodb.org/manual/reference/mongo-shell/) 

[https://docs.mongodb.org/manual/core/crud-introduction/](https://docs.mongodb.org/manual/core/crud-introduction/)

A walkthrough:

Login as other user - union based

' and 1=0 union select 1, '', 'Robin', '' from users ;-- in the login page. Do this in the knowledge of the code

';update <some table> set etc... or any other data manipulation. bobby'; drop table... or create login...

[http://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html](http://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html)

Hack passwords out of MEAN_stack with Postman [https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en): {"email": "rsillem", "password": {"$gte": ""}}. Multiple weakness combine here - it wouldn't be possible if the passwords were stored hashed. See also $where (significantly hardened after V2.4). See also $where. Fix by getting rid of qs, or by manually sanitizing what we got from the API - must be a string, not an object.

Demonstrate each vector - union, piggy-back, error-based, blind


Exercise 2. Review your data/command flows
-----

Architecture. Where does data come in? What does valid input look like? What external systems are there?

 
Exercise 3. Automating injection risk discovery
-----

sql-inject-me [https://addons.mozilla.org/en-GB/firefox/addon/sql-inject-me/](https://addons.mozilla.org/en-GB/firefox/addon/sql-inject-me/) (firefox add-on) rudimentary fuzz testing

Proxy through ZAProxy [https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project). Spidering.

Extract the DB schema with sqlmap [http://sqlmap.org/](http://sqlmap.org/). Command line based, so suitable for automated tests.

What can these attacks do - use sqlmap command line as illustration

The complexity lies in running the attacks rather than the defence.

You really need a good grip of SQL queries and the behaviour of your DB to run these attacks. The specific attacks depend on the syntax used by the specific RDBMS you are using. See [http://troels.arvin.dk/db/rdbms/](http://troels.arvin.dk/db/rdbms/)

Execute OS commands with a UDF  [http://dogox.net/index.php/2015/08/01/udf-privesc/](http://dogox.net/index.php/2015/08/01/udf-privesc/) (easier in MSSQL with xp_cmdshell, if the server allows it - off by default in modern versions, assuming the attacker can't turn it on :-/ ). N.B. You're behind the firewall now!

Find db user rights

Find other DBs on same machine

 

Exercise 4. Reviewing for vulnerabilities in code
-----

Understanding attack vectors

common/specific

casing, termination, comment syntax

What part of the SQL query comes from untrusted data?

Exception handling

Cause errors

Expose data - union-based. First select determines columns, subsequent selects must match

Blind injection - boolean / time-based - you just need to make the system behave differently somehow


Exercise 5. Mitigate by displaying appropriate error messages
-----

Various fixes best done on separate branches because of defense in depth.

Fix by displaying appropriate error messages - not exceptions.  


Exercise 6. Mitigate by parametrizing queries
-----

Reset to insecure version before Ex 5

Fix by parametrizing queries - never string concatenation. Tech specific, (kind of done for you in mongo, but see above). This is escaping data as it leaves your system on its way to the DB, by leveraging features of the DB and the libraries you drive it with.
Fix by using stored procedures. As above - parameters are implicit, but make sure you use them, don't concatenate inside the SP, FFS. SPs also allow parameter validation within the SP.
See also ORMs. Does the ORM you are using enforce the parametrization between its API and the DB? You should expect so, but check - EF does, Django does, etc. However, they may let you do raw SQL, and then it's up to you to Do The Right Thing. Code review. They're also harder to use with SPs.

Understand the security features your components provide. See [https://docs.mongodb.org/v3.0/administration/security-checklist/](https://docs.mongodb.org/v3.0/administration/security-checklist/). See also keeping components updated, as security vulnerabilities are patched. This implies keeping up to date on what's going on, and having a very slick build/deploy cycle.


Exercise 7. Mitigate by input sanitization
-----

Reset to insecure version before Ex 5

Fix by input sanitization. Construct the known good patterns for each input field - whitelisting, not blacklisting. How to reject. Regex. Judgement re security vs usability. This is cleaning data as it comes in to your system. There are many many ways of avoiding blacklists - splitting, white space, hex, comments etc. etc.


Exercise 8. Mitigate by least privilege
-----

Reset to insecure version before Ex 5

sudo gulp dev

Fix by least privilege for the DB user - whitelist. Develop with least privilege from the start, to avoid (not) finding a load of bugs when you switch. Permissions, SPs. Specific read/write permissions on tables/columns. Better still apply permissions to SPs. Maybe also use multiple SQL logins for different application user roles.

Other mitigations
-----

This is single server deployment, but...

See also network segmentation architecture (firewall rules etc.) - maybe not part of the application but you need to understand it and assure yourself of what your app needs and that it has only that. Maybe a service-based architecture will help to isolate web app from data, if you have one -  security is not necessarily a sufficient reason.

Consider *additional (not instead of)* intrusion detection system or web application firewalls (e.g. [http://www.iis.net/downloads/microsoft/urlscan](http://www.iis.net/downloads/microsoft/urlscan) or Barracuda [https://www.barracuda.com/](https://www.barracuda.com/) or even Cloudflare [https://www.cloudflare.com/](https://www.cloudflare.com/). These are (possibly heuristic) blacklisting systems. See also logging - post facto. 

Extensions to existing apps
-----

More sensitive data in user table - registration

**Search functionality - text in posts. Using URL query parameter**

My account page, accessible via

Make it not actually crash when you cause an exception by adding a bad post

Give db user god rights


Further reading
-----

[https://www.owasp.org/index.php/SQL_Injection_Prevention_Cheat_Sheet](https://www.owasp.org/index.php/SQL_Injection_Prevention_Cheat_Sheet)

[http://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html](http://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html)

[http://blog.websecurify.com/2014/08/attacks-nodejs-and-mongodb-part-to.html](http://blog.websecurify.com/2014/08/attacks-nodejs-and-mongodb-part-to.html)




