// Fiddler rules to find sensitive data exposed in HTTP requests in the sample apps
// Use the Fiddler Rules/Customize rules... menu option

// Copy this into OnBeforeRequest

// Data exposed in HTTP requests
if (!oSession.isHTTPS) {
            
    var oBodyString = oSession.GetRequestBodyAsString();
            
    // Body contains password - the JSON field name
    if (oBodyString.Contains("password")) 
    {
        oSession["ui-backcolor"] = "red";
        oSession["ui-color"] = "white";
        oSession["ui-comments"] = oSession["ui-comments"] + " Exposed password. ";
    }
            
    // Session cookie snt by client
    if (oSession.RequestHeaders["Cookie"].Contains("connect.sid")) 
    {
        oSession["ui-backcolor"] = "red";
        oSession["ui-color"] = "white";
        oSession["ui-comments"] = oSession["ui-comments"] + " Exposed session cookie. ";
    }
            
    // Auth header present
    if (oSession.RequestHeaders["X-Auth"]) {
        oSession["ui-backcolor"] = "red";
        oSession["ui-color"] = "white";
        oSession["ui-comments"] = oSession["ui-comments"] + " Exposed session token. ";
    }
            
}
        
// Copy this into OnBeforeResponse

// Data exposed in HTTP responses
if (!oSession.isHTTPS) {

    // Any response to /api/sessions
    if (oSession.uriContains("sessions")) {
        oSession["ui-backcolor"] = "red";
        oSession["ui-color"] = "white";
        oSession["ui-comments"] = oSession["ui-comments"] + " Exposed session token. ";
    }

    // Session cookie set by server
    if (oSession.ResponseHeaders["set-cookie"].Contains("connect.sid")) {
        oSession["ui-backcolor"] = "red";
        oSession["ui-color"] = "white";
        oSession["ui-comments"] = oSession["ui-comments"] + " Exposed session cookie. ";
    }

    var oBodyString = oSession.GetResponseBodyAsString();

    // Body contains password - the JSON field name
    if (oSession.oResponse.headers.ExistsAndContains("Content-Type", "application/json") && oBodyString.Contains("password")) {
        oSession["ui-backcolor"] = "red";
        oSession["ui-color"] = "white";
        oSession["ui-comments"] = oSession["ui-comments"] + " Exposed password. ";
    }

}

