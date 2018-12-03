
//used to create a new cookie for the user which covers different cookie types
export function createCookie(name, value, days, path, domain, secure){
    //if number of days is given, sets expiry time
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires=date.toLocaleTimeString();
    }
    else {
        var expires = "";
    }
    //appends name to cookie, making it searchable
    cookieString= name + "=" + escape (value);

    if (expires)
    cookieString += "; expires=" + expires;

    if (path)
    cookieString += "; path=" + escape (path);

    if (domain)
    cookieString += "; domain=" + escape (domain);

    if (secure)
    cookieString += "; secure";

    //cookiestring now contains all necessary details and is turned into a cookie
    document.cookie=cookieString;
};

//gets a cookie based on the name
export function getCookie(name) {
    var cookie = document.cookie;
    var prefix = name + "=";
    var begin = cookie.indexOf("; " + prefix);
    if (begin == -1) {
        begin = cookie.indexOf(prefix);
        if (begin != 0) return null;
    } else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = cookie.length;
        }
    }
    return unescape(cookie.substring(begin + prefix.length, end));
}
