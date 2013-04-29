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
	//temporary - projects need to be a list
	$("#contents").append("<center><h2>"+page+"</h2><a id='folio_link' href=/"+username+"/"+page+"> View this folio </a></center><br><center><br><h2>Description</h2><br><div id='edit'><textarea type='text' id='folio_description' resize='false'></textarea></center><br><center><button type='button' id='folio_save' name='Save' value='"+page+"'>Save</button></center></div><h2><center>"+page+" Projects and Experience</h2></center><div id='projects'>"+data['projects']+"</div><br><center><h2>Options</h2></center><center><br><button id='folio_delete' name='Delete' value='"+page+"'>Delete this Folio</button></center><br><br><center><div id='delete_note'>Be careful, this cannot be undone!</div></center>");
	$("#folio_description").text(data['description']);
	$("#folio_save").click({pagename:page},saveFolio);
	$("#folio_delete").click({pagename:page},delFolio);
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

function delFolio(event){
    page = event.data.pagename;
    $("#folio_delete").attr("disabled","disabled");

    $.getJSON("/delPage",{"username":username,"pagename":page}
	      ,function(data){
		  if (data == true){
		      window.location.reload(true);
		  }
		  else {
		      console.log(data);
		      $("#contents").append("<p id='del_error'>Something went wrong. Please try again.</p>");
		      $("#folio_delete").removeAttr("disabled");
		  }
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
    $("#contents").empty().append("<div id='add'><h1>Add a new Folio!</h1><br><textarea id='add_title' type='text' resize='false' placeholder='Title'></textarea><div id='title_note'><b>The title is case-sensitive, and no spaces, please!</b></div><br><textarea id='add_description' type='text' resize='false' placeholder='Write about your projects here'></textarea><button type='button' id='create' name='Create'>Create</button></div>");



    $("#create").click(addFolio);
}

function addFolio() { //actually goes to server
    $("#create").attr("disabled","disabled");

    name = $("#add_title").val();
    des = $("#add_description").val();

    if (! /^[a-zA-Z0-9]+$/.test(name) ){
	$("#contents").append("<p id='add_error'>Alphanumeric characters only, and no spaces, please.</p>");
	$("#add_error").fadeOut(2500,function(){
	    
	    $("#add_title").val("");
	    $("#create").removeAttr("disabled");
	    $("#add_error").remove();
	});
	return false; //break function
    }

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



//create project

function createProject() {
    $("#about_me").remove()
    $("#contents").empty().append("<div id='add'><h1>Add a new Project!</h1><br><textarea id='add_title' type='text' resize='false' placeholder='Title'></textarea><div id='title_note'><b>The title is case-sensitive, and no spaces, please!</b></div><br><textarea id='add_description' type='text' resize='false' placeholder='Write about your project here'></textarea><br><textarea id='add_link' type='text' resize='false' placeholder='Put a link to the project here (if available)'></textarea><br><textarea id='add_embed' type='text' resize='false' placeholder='Put any embedded content code here'></textarea><!--textarea id='tags' type='text' resize='false' placeholder='Put any tags to go along with other folios.'></textarea--><button type='button' id='create' name='Create'>Create</button></div>");



    $("#create").click(addProject);
}

function addProject() { //actually goes to server
    $("#create").attr("disabled","disabled");

    name = $("#add_title").val();
    des = $("#add_description").val();
    link = $("#add_link").val();
    embed = $("#add_embed").val(); 
    

    if (! /^[a-zA-Z0-9]+$/.test(name) ){
	$("#contents").append("<p id='add_proj_error'>Alphanumeric characters only, and no spaces, please.</p>");
	$("#add_proj_error").fadeOut(2500,function(){
	    
	    $("#add_title").val("");
	    $("#create").removeAttr("disabled");
	    $("#add_proj_error").remove();
	});
	return false; //break function
    }

    info = { "description" : des, "link" : link, "embed" : embed };

    $.getJSON("/addProject",{"username":username,"projectname":name,"projectinfo":info},
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
    $("#newProj").click(createProject);
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

    $('#folio_save').css('position','relative');
    $('#folio_save').css('left','6em');

});