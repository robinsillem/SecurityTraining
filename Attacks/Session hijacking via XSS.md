Not yet finished - or even started, really :-(

Exercise 4: Perform a simple penetration test with OWASP ZAP
-----

Install and run OWASP ZAP. [https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project](https://). Open up the user guide from the help menu and work through the Getting Started page, including the basic penetration test. This will reveal a whole bunch of alerts, some of which may be relevant to this module.

Now take a look at the testing guide (the pdf is in the resources folder of this repo). In particular, for this module, see the chapter on session management, specifically OTG-SESS-004, page  93. This section is heavy on inspection, review and manual test rather than automation.

You can write extensions for OWASP ZAP, but for this module, I think Fiddler is an easier way of finding specific data in the HTTP requests/responses, as in the exercise above. ZAP will come in very useful in other modules though, so it's worth getting to know it.

Remember to disable the proxy server when you're done.


