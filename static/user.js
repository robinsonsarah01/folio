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
    

function loadFolioData(data){
    //can do things to pagedata to make it pretty before this step
    //like mess with it in js and use different methods to display it etc

    $("#folio_contents").empty().append("<p id='descrption'>"+data['description']+"</p>");
    $("#folio_contents").append("<p id='projects'>"+data['projects']+"</p>");
}


function viewFolio(page){
    getPage(page); //gets data and loads it
    
}


$(document).ready( function() {
    //console.log(document.URL); //also window.location
    getInfo();
    viewFolio(currpage);

    $('.left_rectangle').click(function(){
	$('.left_rectangle').css("background-color","#8E978D");
	$('#' + this.id).css("background-color","#CDF2D6");
	$('.left_rectangle').css("color","white");
	$('#' + this.id).css("color","#8E978D");
    });

});