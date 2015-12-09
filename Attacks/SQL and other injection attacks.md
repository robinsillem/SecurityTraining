Security training #2 - SQL and other injection attacks
=====

Level: 

What is this attack?
-----

Many (most?) real-world websites interact with other back-end systems by sending them commands to do things - this can be databases, the OS, the file system, external services, actual physical hardware including large real-world machinery, whatever. This is a normal part of their operations, and is part of the design of the system.

Many (most?) real-world websites also accept input from users. This generally comes from front-end clients, but it can also come from other back end systems (including the databases used by the site). The web application has no control over what input is presented to it - it is **untrusted**. This is a normal part of their operations, and is part of the design of the system.

Many (most?) real-world websites use this input in the construction of the commands to external systems. This is a normal part of their operations, and is part of the design of the system.

Injection attacks occur when the web application passes maliciously crafted input data into an external system in a form which can damage that system. This may or may not damage the website itself (in the narrow sense), but it's certainly doing to damage something or someone somehow. Note that I said 'the web application passes...', not 'an attacker presents...'. As an application developer **it is your fault** if this happens - you must expect input data to be malicious.

Note also, that I haven't mentioned SQL anywhere there. SQL injection has been known about for many years (and is still the #1 vulnerability), but injection attacks apply to all kinds of back end systems. Having said that, SQL databases are very common targets, and they tend to be powerful things that can open up other systems to attack. Obviously, the various databases and back end systems each have their own very specific command language or dialect, so the input used for injection attacks tend to be very carefully crafted to suit specific target. You can assume that a serious attacker may know more about the obscure corners of the target and its command language than you do - your focus is on getting it to do what you want, not how to break it. You may also assume that any unskilled attacker has access to tools written by someone who knows all that stuff.


Real-world examples
-----

Scared yet? You should be. Injection is #1 in the OWASP top 10 vulnerabilities list, because it is easy to do and the impact can be severe.

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

So without further ado, let's walk through an injection attack on the 2 sample apps. The object of the attack is to gain access to a user's account without presenting a password. 

You will find it easier to see what's going on if you have 2 ssh sessions (vagrant ssh) going for each app - one to run the app (kill the running node process, then sudo gulp dev) and one to run a command line prompt for mysql [http://dev.mysql.com/doc/refman/5.7/en/mysql.html](http://dev.mysql.com/doc/refman/5.7/en/mysql.html) or mongo [https://docs.mongodb.org/manual/reference/mongo-shell/](https://docs.mongodb.org/manual/reference/mongo-shell/) (see also [https://docs.mongodb.org/manual/core/crud-introduction/](https://docs.mongodb.org/manual/core/crud-introduction/)) as appropriate.

In each case, you should start the app, register a user, and log in that user. The sample apps have been modified so that they log the db query and response to the console, so you can see what is being sent and returned.

In the Jade\_Express\_mySQL sample go to the other ssh shell and start a mysql command line session (username:root password:sec\_training, use sec\_training;) and run the SELECT command you see in the other ssh shell. You'll see (hopefully) 1 row - the registered user, with the given email and password. If you use the wrong password you'll get no rows back. 

However, if you add AND 1=0 to your correct query, you'll get 0 rows. And if you add AND 1=0 UNION SELECT '', '', '*insert your user name here*>', '' FROM users, you'll get 1 row back, with your user's name in the right column, totally ignoring the email and password in the first part of the query. 

This is looking hopeful, but how do we get this query to run via the UI? Looking at the code, the qu
ry is build up by string concatenation. We see that whatever we typed into the Email field goes inside some quotes in a where clause, as does whatever we typed into the Password field. So it's easy - we insert a whole new ending to the query as the Email input data, including a comment at the end to throw the original part of the query away. It will look something like this:

' AND 1=0 UNION SELECT '', '', '*insert your user name here*', '' -- 

And bingo, you're in, using a union-based SQL injection attack. Or not, if you haven't quite got the attack string right :-( - keep trying until you do, you can look at the console log to see what is actually being presented to the database. If you haven't come across the UNION keyword in SQL before, you may be sure that the attacker has (see above) - deep knowledge of the target system is key for an attacker, and UNION isn't very deep.

But wait, it gets worse. :-(. Even with this very simple injection we can replace '*insert your user name here*' with a subquery like:

(select password from users where name = '*insert some name here*') p

and the app will helpfully display a password in the place you normally see a user name. You could also try piggybacking additional SQL command onto the query, like:

; drop table users --

Though you'd need to deliberately weaken this app a bit do this (see db.js, and see exercise 6). I'll leave this to you to play with, though.

Of course this specific attack does rely on the fact that the UI (and the Add Post feature) only cares about user names, but it should be clear that you can put any select you like after the UNION, so long as it has the right number of columns and types. It also relies on you knowing the structure of the code/data and seeing what is going on, but there are tools to help the attacker with that, as we shall see below. 

The MEAN\_stack sample is slightly different, because it doesn't use a SQL database. However, a little googling throws up this: [http://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html](http://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html). The TLDR here is that mongo will accept partial expressions using its built-in operators inside javascript objects  So we might try a valid email and paste {"$gte": ""} into the Password box (i.e. accept any password greater than "", which is to say *any password*. No dice, it fails, so that attack doesn't work, right? Wrong. Start Fiddler and run it again to see what's actually being sent - it turns out that something on the client side (AngularJS maybe, who cares?) has escaped some quotes and quoted the whole input field. But hey, we can get round that in a zillion ways. We can submit the request direct to the API using Fiddler or Postman [https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en), then use Fiddler's autoresponder to drop the JWT in, like when we did the MITM attack. We could leave Fiddler on and write some Fiddlerscript to automagically replace all passwords with {"$gte": ""}, so we can do passwordless login with **any** valid user. The key point here is that anything the client javascript does is **outside your trust boundary** and the attacker can bypass it via your API and/or client-side tools. 

Oh, and if you haven't come across Mongo's operators before, you may be sure that the attacker has (see above) - deep knowledge of the target system is key for an attacker, and Mongo's operators aren't very deep. Does that warning sound familiar?

But wait, it gets worse. :-(. Why stop with {"$gte": ""}, when sequentially trying ..., {"$gte": "P"}, {"$gte": "Q"}, ..., {"$gte": "Pa"}, {"$gte": "Pb"}, ..., {"$gte": "Pas"} etc. (the exact letters will depend on your password) will expose the complete password one letter at a time? Here's an example of a case where multiple weakness combine - it wouldn't be possible if the passwords were stored hashed, or would it?

So what does all this tell us?

* Injection attacks occur when you pass untrusted input directly into a command to an external system
* They're very specific to the target system, detailed knowledge is invaluable
* Once the attacker finds a way in he can escalate the attack
* Directed trial and error gets the attacker a long way
* It can be laborious

*spoiler alert*: automation...


Exercise 2. Review your data/command flows
-----

Before we get onto automating these attacks, let's take a look at what we're trying to defend. Specifically we should be looking at the flows of untrusted data, with special regard to untrusted data that is used to construct commands to external back-end systems. We might also consider untrusted data that is sent to a web client, but that's more in the arena of cross-site scripting, so let's not worry about that in this module.

In the sample apps, untrusted data comes from the client as posts during registration, login and the Add Post feature. Data from the database might also be regarded as untrusted - you don't necessarily know how it was inserted.

The external system we immediately think of as an injection target is the database, but you might also bear in mind that untrusted data is written to log files and the console. We'll briefly consider logging in exercise 6, but for now well worry about the database.

*dev-specific* Review the whole codebase for both samples (it's short, don't worry, and both apps *should* be the same), looking for places where the application accesses the database. Enumerate all pieces of untrusted input that are used in commands to the database. In each case consider what constitutes 'valid' data for that input (e.g. an email address should be a valid email address, but also consider what constitutes a unique email address and whether they should be canonicalised in some way - casing, maybe?). Enumerate all the API/form entry points for those pieces of untrusted data.

This process will give you a listing of the attack surface of your application, including the fields that are relevant in the context of injection attacks, and some idea of how to sanitize the untrusted data (see exercise. Consider doing the same process for the system you are working on in your day job - it'll take you much longer, of course. 

 
Exercise 3. Automating injection risk discovery
-----

sql-inject-me [https://addons.mozilla.org/en-GB/firefox/addon/sql-inject-me/](https://addons.mozilla.org/en-GB/firefox/addon/sql-inject-me/) (firefox add-on) rudimentary fuzz testing

Proxy through ZAProxy [https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project). Spidering. Attack. Clean down.

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

e.g. Can we inject commands into the logging system? Is there a weakness/feature of the logging component? 


Exercise 7. Mitigate by input sanitization
-----

Reset to insecure version before Ex 5

Fix by input sanitization. Construct the known good patterns for each input field - whitelisting, not blacklisting. How to reject. Regex. Judgement re security vs usability. This is cleaning data as it comes in to your system. There are many many ways of avoiding blacklists - splitting, white space, hex, comments etc. etc.

Hack passwords out of MEAN_stack with Postman [https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en): {"email": "rsillem", "password": {"$gte": ""}}. Multiple weakness combine here - it wouldn't be possible if the passwords were stored hashed. See also $where (significantly hardened after V2.4). See also $where. Fix by getting rid of qs, or by manually sanitizing what we got from the API - must be a string, not an object.


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




