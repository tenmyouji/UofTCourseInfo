const FB_URL = 'https://www.facebook.com/groups/183712131723915/for_sale_search/?forsalesearchtype=for_sale&availability=available&query=';
const AMZN_URL = 'https://www.amazon.ca/s/field-keywords=';
const EBAY_URL = 'https://www.ebay.ca/sch/i.html?_nkw=';
const GOOG_URL = 'https://www.google.com/search?tbm=bks&q=';
$(document).ready(function () {

    document.getElementById('search-books').addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            handle();
        }
    });


    function handle() {
        let query = $('#search-books').val();
        if(/[0-9]{13}/.test(query)){
            window.location.href = 'index.html?filter?q=isbn:"' + query + '"'
        }else if(/\b[a-zA-Z]{3}([1-4]|\b)([0-9]|\b)([0-9]|\b)/.test(query)){
            window.location.href = 'index.html?filter?q=course_code:"' + query + '"';
        }else{
            window.location.href = 'index.html?search?q="' + query + '"';

        }
    }

    let url = window.location.href;
    let params = url.split('?');
    if (params.length === 3) {
        displayBooks(fetcher(params[1] + '?' + params[2]));

    }
});

function fetcher(query) {
    let json = [];
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            json = JSON.parse(this.responseText);
        }
    };
    xmlhttp.open("GET", 'https://cors.io/?https://cobalt.qas.im/api/1.0/textbooks/' + query + '&key=bolBkU4DDtKmXbbr4j5b0m814s3RCcBm&limit=100', false);
    xmlhttp.send();
    return json;
}


function displayBooks(json) {
    $('#accordion').accordion({
        collapsible: true,
        heightStyle: "content"
    });

    json.forEach(function (item) {
        let courses ="Courses:";
        item.courses.forEach(function (course) {
            courses += " " + course.code;
        });
        let title = "<h3><b>" + item.title + "</b>  " + item.author + "<span style='float: right'>ISBN:" + item.isbn + "</span></h3>";
        let facebook = "<a class='facebook' href="+ FB_URL + item.courses[0].code.substring(0, 6) + ">Search on Facebook" + "</a>";
        let ebay = "<a class='ebay' href="+ EBAY_URL + item.isbn + ">Shop  on Ebay" + "</a>";
        let google = "<a class='google' href="+ GOOG_URL + item.isbn + ">Search on Google Books" + "</a>";
        let amazon = "<a class='amazon' href="+ AMZN_URL + item.isbn + ">Shop on Amazon" + "</a>";
        let external = "<br/><br/>" + facebook + '<span style="padding: 3%"> </span>' + amazon +'<span style="padding: 3%"> </span>'+ ebay +'<span style="padding: 3%"> </span>'+ google;
        let image = "<img class='pic' src='" + item.image + "'>";
        let bookstore = '<b>UofT BookStore</b><br/>';
        bookstore += ("new: $" + item.price + "<br/>");
        bookstore += 'See the <a href="'+item.url+'">listing</a> for more information, including the price for a used item';


        let content = "<div style='float: right; width: 80%'>" + courses + '<br/><br/>' + bookstore + addDbook(item.isbn) + external + "</div>";
        $('#accordion').append(title + "<div>" + image + content + "</div>")
    });
    $('#accordion').accordion("refresh");
}


function getDiscount() {
    var dir;
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            dir = JSON.parse(this.responseText);
        }
    };
    xmlhttp.open("GET", chrome.runtime.getURL("discounttb.json"), false);
    xmlhttp.send();
    return dir;
}


function addDbook(isbn){
    let discount = getDiscount();
    let output = '<b>Discount Textbooks Store</b><br/>';
    if(discount[isbn] == null){
        output += 'Not found <br/>';
    }else{
        if(discount[isbn]['new'] !== 'N/A'){
            output += 'new: $' + discount[isbn]['new']

        }else
            output += '<br/>';
        if(discount[isbn]['used'] !== 'N/A'){
            output += 'used: $ ' + discount[isbn]['used']

        }else{
            output += '<br/>';

        }

    }

    return '<br/><br/>' + output +'<br/><a href="http://www.discounttextbookstoronto.com/home.html">Visit the website for more info</a>';
}