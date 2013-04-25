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
	$("#about_me").append('<center> <img src="/static/shan.png"></center><br><br> <form> <textarea type="text" id="blurb" resize="false" placeholder="Write about yourself here."></textarea></form>');
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





function createFolio() {
    $("#contents").empty().append("<p id='add'>this is where fancy stuff to name new folio and add contents goes</p>");
}


$(document).ready( function() {
    $("#add_folio").click(createFolio);

    // $("#blurb_button_save").click(saveBlurb);

    //css is all peter, thanks peter
    $('.left_rectangle').click(function(){
	$('.left_rectangle').css("background-color","#8E978D");
	$('#' + this.id).css("background-color","#CDF2D6");
	$('.left_rectangle').css("color","white");
	$('#' + this.id).css("color","#8E978D");
    });

    getInfo()

});