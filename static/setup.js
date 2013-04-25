var username

function getInfo() {
    var url = document.URL;
    var info = url.split("/");
    username = info[3]
    return username
}

function loadFolioData(data,page){
    //can do things to pagedata to make it pretty before this step
    //like mess with it in js and use different methods to display it etc
    
    //console.log("in loadFolioData");
    $("#about_me").remove();
    $("#contents").empty().append("<p id='data'>"+data+"</p>");

    if (page == "about"){
	$("#contents").prepend('<div id="about_me"></div>');
	$("#about_me").append('<center> <img src="/static/shan.png"></center><br><br> <form><button type="button" id="blurb_save" name="Save">Save</button> <textarea type="text" id="blurb" resize="false" placeholder="Write about yourself here."></textarea></form>');
    }
}

function getPage(page){
    //console.log("in getPage: "+page);
    $.getJSON("/getPage",{"username":username,"page":page},function(data){
	//console.log("in getPage json call");
	loadFolioData(data,page);
    });
}

function viewFolio(page){
    //console.log("in viewFolio");
    getPage(page); //gets data and loads it
    
}



function saveBlurb(){
    //do some stuff thru ajax and save the about me sighs at

    info = $($("#blurb")).val(); //val of textarea

    $.getJSON("/editPage",{"username"=username,"pagename"="about","info"=info},
	      function(data){
		 //not necessary but nice:
		  //fix data that appears on page
	      });
}

function createFolio() {
    $("#about_me").remove()
    $("#contents").empty().append("<p id='add'>this is where fancy stuff to name new folios and add contents goes</p>");
}


$(document).ready( function() {
    $("#add_folio").click(createFolio);

    $("#blurb_save").click(saveBlurb);

    //css is all peter, thanks peter
    $('.left_rectangle').click(function(){
	$('.left_rectangle').css("background-color","#8E978D");
	$('#' + this.id).css("background-color","#CDF2D6");
	$('.left_rectangle').css("color","white");
	$('#' + this.id).css("color","#8E978D");
    });

    getInfo()

    //possibly load page thru js?

});