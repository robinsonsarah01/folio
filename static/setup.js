var username

function getInfo() {
    var url = document.URL;
    var info = url.split("/");
    username = info[3]
    return username
}


// view

function loadFolioData(data,page){
    //can do things to pagedata to make it pretty before this step
    //like mess with it in js and use different methods to display it etc
    
    //console.log("in loadFolioData");
    $("#about_me").remove();
    $("#contents").empty()//.append("<p id='data'>"+data+"</p>");

    if (page == "about"){
	$("#contents").prepend('<div id="about_me"></div>');
	$("#about_me").append('<center> <img src="/static/shan.png"></center><br><br> <form id="blurb_form"><button type="button" id="blurb_save" name="Save">Save</button> <textarea type="text" id="blurb" resize="false" placeholder="Write about yourself here."></textarea></form>');
	$("#blurb").text(data['description']); //no projects for about
	$("#blurb_save").click(saveBlurb);
    }
    
    else{
	//temporary - needs css / pretty-fying
	$("#contents").append("<h2>This is my "+page+" folio</h2><div id='edit'><textarea type='text' id='folio_description' resize='false'></textarea><button type='button' id='folio_save' name='Save' value='"+page+"'>Save</button></div><h2>These projects are attached to this folio:</h2><div id='projects'>"+data['projects']+"</div>");
	$("#folio_description").text(data['description']);
	$("#folio_save").click({pagename:page},saveFolio);
    }
}


function saveFolio(event){
    page = event.data.pagename;
    des = $($("#folio_description")).val();
    $("#folio_save").attr("disabled","disabled");

    $.getJSON("/editPage",{"username":username,"pagename":page,
			   "info":des,"aspect":"description"},
	      function(data){
		  $("#edit").append("<p class='saved' id='folio_saved'><b>Saved!</b></p>");
		  
		  $("#folio_saved").fadeOut(2500,function(){
		      $("#folio_save").removeAttr("disabled");
		      $("#folio_saved").remove();
		  });
	      });
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

    $.getJSON("/editPage",{"username":username,"pagename":"about",
			   "info":info,"aspect":"description"},
	      function(data){
		  $("#blurb_form").prepend("<p class='saved' id='blurb_saved'><b>Saved!</b></p>");

		  $("#blurb_saved").fadeOut(2500,function(){
		      $("#blurb_save").removeAttr("disabled");
		      $("#blurb_saved").remove();
		  });
	      });
}



// create

function createFolio() {
    $("#about_me").remove()
    $("#contents").empty().append("<div id='add'><h1>Add a new Folio!</h1><br><textarea id='add_title' type='text' resize='false' placeholder='Title'></textarea><br><textarea id='add_description' type='text' resize='false' placeholder='Write about your projects here'></textarea><button type='button' id='create' name='Create'>Create</button></div>");

    $("#create").click(addFolio);
}

function addFolio() { //actually goes to server
    $("#create").attr("disabled","disabled");

    name = $("#add_title").val();
    des = $("#add_description").val();
    //info = { "description" : description, "projects" : [] };

    $.getJSON("/addPage",{"username":username,"pagename":name,"description":des},
	      function(data){
		  if (data == true){
		      window.location.reload(true);
		  }
		  else {
		      console.log(data);
		      $("#contents").append("<p id='add_error'>Something went wrong. Please try again.</p>");
		      $("#create").removeAttr("disabled");
		  }

	      });
}


// startup

$(document).ready( function() {
    $("#add_folio").click(createFolio);

    //$("#blurb_save").click(saveBlurb);

    //css is all/mostly peter, thanks peter
    $('.left_rectangle').click(function(){
	$('.left_rectangle').css("background-color","#8E978D");
	//$('#' + this.id +'').css("background-color","#CDF2D6");
	$(this).css("background-color","#CDF2D6");
	$('.left_rectangle').css("color","white");
	//$('#' + this.id+'').css("color","#8E978D");
	$(this).css("color","#8E978D");
    });

    // startup stuff
    getInfo();
    viewFolio("about"); //load page thru js
    //change color of about tab
    $("#about").css("background-color","#CDF2D6").css("color","#8E978D");

});