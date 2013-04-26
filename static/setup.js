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
    $("#contents").empty()//.append("<p id='data'>"+data+"</p>");

    if (page == "about"){
	$("#contents").prepend('<div id="about_me"></div>');
	$("#about_me").append('<center> <img src="/static/shan.png"></center><br><br> <form id="blurb_form"><button type="button" id="blurb_save" name="Save">Save</button> <textarea type="text" id="blurb" resize="false" placeholder="Write about yourself here."></textarea></form>');
	$("#blurb").text(data);
	$("#blurb_save").click(saveBlurb);
    }
    
    else{
	$("#contents").append("<p id='data'>"+data+"</p>");
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
    $("#blurb_save").attr("disabled","disabled");

    $.getJSON("/editPage",{"username":username,"pagename":"about","info":info},
	      function(data){
		  $("#blurb_form").prepend("<p id='saved'><b>Saved!</b></p>");

		  $("#saved").fadeOut(2500,function(){
		      $("#blurb_save").removeAttr("disabled");
		  });
	      });
}

function createFolio() {
    $("#about_me").remove()
    $("#contents").empty().append("<p id='add'>this is where fancy stuff to name new folios and add contents goes</p>");

    //$("#add").click(dostuff);
}


$(document).ready( function() {
    $("#add_folio").click(createFolio);

    //$("#blurb_save").click(saveBlurb);

    //css is all/mostly peter, thanks peter
    $('.left_rectangle').click(function(){
	$('.left_rectangle').css("background-color","#8E978D");
	$('#' + this.id).css("background-color","#CDF2D6");
	$('.left_rectangle').css("color","white");
	$('#' + this.id).css("color","#8E978D");
    });

    getInfo();
    viewFolio("about"); //start things off
    //A NOTE: does not change rect color maybe set later?

    //possibly load page thru js?

});