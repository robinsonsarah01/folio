var username
var currpage
//var nextpage


function getInfo(){
    var url = document.URL;
    var info = url.split("/");
    username = info[3];
    currpage = info[4];
    return [ username, currpage ];
}

function getPage(page){
    $.getJSON("/getPage",{"username":username,"page":page},function(data){
	loadFolioData(data);
    });
}
    

function loadFolioData(pagedata){
    //can do things to pagedata to make it pretty before this step

    $("#folio_contents").empty().append("<p>"+pagedata+"</p>");
}


function viewFolio(page){
    getPage(page); //gets data and loads it
    
}


$(document).ready( function() {
    //console.log(document.URL); //also window.location
    getInfo();
    viewFolio(currpage);
});