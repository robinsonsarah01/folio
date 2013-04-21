var username
var currpage
var nextpage


function getInfo(){
    var url = document.URL
    var info = url.split("/")
    username = info[3]
    currpage = info[4]
    return [ username, currpage ]
}

function getPage(page){
    $.getJSON("/getPage",{"username":username,"page":page},function(data){
	nextpage = data;
    });
}
    




$(document).ready( function() {
    //console.log(document.URL); //also window.location
    getInfo()
});