Security training #3 - Cross-site scripting
=====

Level: Hard to understand and defend against

What is this attack?
-----

At a fundamental level, XSS (I'll use this abbreviation for cross-site scripting throughout) is simply another form of injection attack, and many of the concepts will be familiar from the previous module on SQL (and other server-side) injection. Your application passes some maliciously crafted input to an external system in a form which can damage that system. The unique feature of XSS is that the external system is the web client, using his browser to execute malicious commands.

Because XSS attacks occur on the client, there is less scope for the huge one-off data breaches, so the immediate impact on the owner of the website is less severe, but on the other hand, an XSS attack will affect many more systems, which are likely to be less well secured than the servers. See [https://www.owasp.org/index.php/Top_10_2013-A3-Cross-Site_Scripting_(XSS)](https://www.owasp.org/index.php/Top_10_2013-A3-Cross-Site_Scripting_(XSS)) and [https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS))

What makes XSS hard to get your head around, and defend against is:

* There are lots of routes by which the malicious data can get into a browser
* There are lots of ways in which browsers execute active content
* There are lots of browsers and versions, providing different behaviours

XSS is often classified in terms of the first point above. Here's the currently accepted taxonomy:

**Reflected XSS**

1. The attacker provides the victim with some malicious data. This is often done by persuading the victim to clicking on a link, with the malicious data embedded in the URL. At this point the malicious data is still just data.
2. The victim's browser sends the malicious data to the server in a request.
3. The server embeds the malicious data in the response, typically HTML but there are other possibilities - it depends on the design of the site. The malicious data appears in the response in a place where the browser (and/or scripts running in the browser) will treat it as active content. This is the 'reflected' bit.
4. The browser renders (or otherwise processes) the response, running the malicious data as commands. The bad thing (whatever the attack was - e.g. sending user data or session IDs to the attacker) happens.

**Stored (aka Persisted) XSS**

1. The attacker inserts some malicious data into the server's database. This might typically be by using the normal features of the application - no additional exploit might be necessary, nor any action by the victim. This is the 'Stored' bit.
2. The victim's browser sends an entirely innocent request to the server.
3. The server embeds the malicious data in the response, typically HTML but there are other possibilities - it depends on the design of the site. The malicious data appears in the response in a place where the browser (and/or scripts running in the browser) will treat it as active content.
4. The browser renders (or otherwise processes) the response, running the malicious data as commands. The bad thing (whatever the attack was - e.g. sending user data or session IDs to the attacker) happens.

**DOM-based XSS**

1. The attacker provides the victim with some malicious data. This is often done by persuading the victim to clicking on a link, with the malicious data embedded in the URL. At this point the malicious data is still just data.
2. Scripts running in the browser use the malicious data in client-side DOM manipulation, as part of their normal operation.
3. The browser renders (or otherwise processes) the DOM, running the malicious data as commands. The bad thing (whatever the attack was - e.g. sending user data or session IDs to the attacker) happens.

[https://www.owasp.org/index.php/Types_of_Cross-Site_Scripting](https://www.owasp.org/index.php/Types_of_Cross-Site_Scripting)

This taxonomy is all about the flow of malicious data, but the picture is made more complex by the variety of ways in which you can abuse the browser - injecting script is obvious, but how about altering CSS to change how controls are presented to the user? This all gets quite deep, see [https://channel9.msdn.com/Events/Blue-Hat-Security-Briefings/BlueHat-Security-Briefings-Fall-2012-Sessions/BH1203](https://channel9.msdn.com/Events/Blue-Hat-Security-Briefings/BlueHat-Security-Briefings-Fall-2012-Sessions/BH1203) for a lot of very scary information about how to build scriptless attacks using some less-well-known features of CSS and SVG amongst other things. Clearly attackers (and security researchers) know more about obscure corners of web tech than most developers.

However, the good news is that the conceptual framework we got from looking at SQL injection is equally applicable to XSS. The basic defences are:

* Know the data flows of your application - where untrusted data comes in, what constitutes valid input, how it's transformed in your application and where it goes to.
* Use automated security testing tools and code review.
* Sanitize input data, by whitelisting.
* Sanitize output data, according to the context it's going to.
* Limit the damage that can be done.

[https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet)


Real-world examples
-----

The first big wake-up call. [http://motherboard.vice.com/read/the-myspace-worm-that-changed-the-internet-forever](http://motherboard.vice.com/read/the-myspace-worm-that-changed-the-internet-forever)

Ooh look - Jira, we use that. [https://www.netsparker.com/blog/web-security/apacheorg-and-jira-incident/](https://www.netsparker.com/blog/web-security/apacheorg-and-jira-incident/)

Ooh look - Wordpress, we use that. [http://wptavern.com/xss-vulnerability-affects-more-than-a-dozen-popular-wordpress-plugins](http://wptavern.com/xss-vulnerability-affects-more-than-a-dozen-popular-wordpress-plugins)


Exercise 0. Moving on from a previous module
-----

If you're moving on from a different module in this course you may want to clean up your system somewhat:

* Kill the sample app VMs with vagrant destroy.
* Make sure you're using the right commit for this module - a variety of new features and vulnerabilities have been added to support it. The commit ID is tagged with SQL\_injection\_presentation.
* Reset the Fiddler rules - delete the customrules.js file inside your \Documents\Fiddler2\Scripts folder.
* Recreate the sample apps (and new databases) with vagrant up. 


Exercise 4: Perform a simple penetration test with OWASP ZAP
-----

Install and run OWASP ZAP. [https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project](https://). Open up the user guide from the help menu and work through the Getting Started page, including the basic penetration test. This will reveal a whole bunch of alerts, some of which may be relevant to this module.

Now take a look at the testing guide (the pdf is in the resources folder of this repo). In particular, for this module, see the chapter on session management, specifically OTG-SESS-004, page  93. This section is heavy on inspection, review and manual test rather than automation.

You can write extensions for OWASP ZAP, but for this module, I think Fiddler is an easier way of finding specific data in the HTTP requests/responses, as in the exercise above. ZAP will come in very useful in other modules though, so it's worth getting to know it.

Remember to disable the proxy server when you're done.

[https://www.owasp.org/index.php/Reviewing_Code_for_Cross-site_scripting](https://www.owasp.org/index.php/Reviewing_Code_for_Cross-site_scripting)

[https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)

Maliciously constructed query strings

URL shorteners

Reflected vs Stored. Reflected via search feature. Stored via Add Post. Reflected via search

Execution of payload via <script\>, attributes (on_xyz), <IMG SRC\>, <META\> 

Whitelist input data - same as injection

Always encode output. Encode for context JS/HTML/CSS

Access to HTML5 APIs such as accessing a user’s geolocation, webcam, microphone and even the specific files from the user’s file system

HttpOnly cookies

Content Security Policy


New required features
-----

Search posts

Further reading
-----

[https://www.owasp.org/index.php/OWASP_Testing_Guide_v4_Table_of_Contents](https://www.owasp.org/index.php/OWASP_Testing_Guide_v4_Table_of_Contents) Sections 4.8.1, 4.8.2, 4.12.1


