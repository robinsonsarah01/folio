var username
var folios
var projects
var name

function getInfo() {
    var url = document.URL;
    var info = url.split("/");
    username = info[3];

    $.getJSON("/getUserInfo",{"username":username},function(data){
	folios = data['folios'];
	projects = data['projects'];
	name = data['name'];
    });
}


// view

function loadFolioData(data,page){
    //can do things to pagedata to make it pretty before this step
    //like mess with it in js and use different methods to display it etc
    
    //console.log("in loadFolioData");
    $("#about_me").remove();
    $("#contents").empty(); //.append("<p id='data'>"+data+"</p>");
    var url = document.URL;
    var info = url.split("/");
    username = info[3];

    if (page == "about"){
	$("#contents").prepend('<div id="about_me"></div>');
	$("#about_me").append('<center> <div id="name"><h1>'+name+'</h1></div><img id="user_image" src="../static/uploads/'+username+'/new.png?"'+ (new Date()).getTime() +'></center<br><br><br><br><center> <form method="POST" enctype="multipart/form-data" action="/<username>/" id="upload"><input type="file" onchange="this.form.submit();" name="file[]" multiple=""></center><input type="hidden" name="uzernaem" value="'+username+'"><form id="blurb_form"><button type="button" id="blurb_save" name="Save">Save</button> <textarea type="text" id="blurb" resize="false" placeholder="Write about yourself here."></textarea></form>');
	d = new Date();
	$("#user_image").attr("src", "../static/uploads/"+ username + "/new.png?"+ d.getTime());
	$("#blurb").text(data['description']); //no projects for about
	$("#blurb_save").click(saveBlurb);
    }
    
    else{
	var projstr = ""
	projstr = data['projects'].reduce( 
	    function(p,c,i,a) { return p+"<div id='proj_"+c+"'>"+c+"<button class='remove_proj' id='"+c+"' type='button' name='Remove project from folio'>   Remove project from folio</button></div>";},"" ); //if you want to display projs do it circa here
	projstr = projstr.substring(0,(projstr.length-3));
	//temporary - projects need to be a list
	$("#contents").append("<center><h2>"+page+"</h2><a id='folio_link' href=/"+username+"/"+page+"> View this Folio </a></center><br><center><br><h2>Description</h2><br><div id='edit'><textarea type='text' id='folio_description' resize='false'></textarea></center><br><center><button type='button' id='folio_save' name='Save' value='"+page+"'>Save</button></center></div><h2><center>"+page+" Projects and Experience</h2></center><br><div id='projects'>"+projstr+"</div><center><h2>Options</h2></center><center><br><button id='folio_delete' name='Delete' value='"+page+"'>Delete this Folio</button></center><br><br><center><div id='delete_note'>Be careful, this cannot be undone!</div></center>");
	$("#folio_description").text(data['description']);
	//console.log(data['description']);
	$("#folio_save").click({pagename:page},saveFolio);
	$("#folio_delete").click({pagename:page},delFolio);
	$(".remove_proj").click({pagename:page},removeProjFromFolio);
    }
}


function removeProjFromFolio(event){
    var proj = $(this).attr("id");
    var folio = event.data.pagename;
    $(".remove_proj").attr("disabled","disabled");

    //console.log(proj+" "+folio);
    
    $.getJSON("/delProjFromFolio",{"username":username,"folio":folio,"project":proj},function(data){
	if (data == true){
	    window.location.reload(true); //shh i am somewhat lazy
	}
	else {
	    console.log(data);
	    $("#contents").append("<p id='proj_del_error'>Something went wrong. Please try again.</p>");
	    $(".remove_proj").removeAttr("disabled");
	}
    });
}


function saveFolio(event){
    var page = event.data.pagename;
    var des = $($("#folio_description")).val();
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
    var page = event.data.pagename;
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

    var info = $($("#blurb")).val(); //val of textarea
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



// CREATE FOLIO STUFF

function createFolio() {
    $("#about_me").remove()
    $("#contents").empty().append("<center><div id='add'><h1>Add a New Folio</h1></center><br><center><textarea id='add_title' type='text' resize='false' placeholder='Title'></textarea></center><center><div id='title_note'><b>The title is case-sensitive, and no spaces, please!</b></center></div><br><center><textarea id='add_description' type='text' resize='false' placeholder='Write about your projects here'></textarea></center><center><button type='button' id='create' name='Create'>Create</button></div></center>");



    $("#create").click(addFolio);
}

function addFolio() { //actually goes to server
    $("#create").attr("disabled","disabled");

    var name = $("#add_title").val();
    var des = $("#add_description").val();

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





//PROJECT STUFF

//create project

function createProject() {
    $("#about_me").remove()
    $("#contents").empty().append("<center><div id='add'><h1>Add a New Project or Experience</h1></center><br><center><textarea id='add_title' type='text' resize='false' placeholder='Title'></textarea></center><center><div id='title_note'><b>The title is case-sensitive, and no spaces, please!</b></div></center><br><center><textarea id='add_description' type='text' resize='false' placeholder='Write about your project here'></textarea></center><br><center><textarea id='add_link' type='text' resize='false' placeholder='Put a link to the project here'></textarea></center><br><center><textarea id='add_embed' type='text' resize='false' placeholder='Put any embedded content code here'></textarea></center></center><center><textarea id='add_img' type='text' resize='false' placeholder='Add an image link here'></textarea></center><!--textarea id='tags' type='text' resize='false' placeholder='Put any tags to go along with other folios.'></textarea--><center><button type='button' id='create' name='Create'>Create</button></div></center>");



    $("#create").click(addProject);
}

function addProject() { //actually goes to server
    $("#create").attr("disabled","disabled");

    var name = $("#add_title").val();
    var des = $("#add_description").val();
    var link = $("#add_link").val();
    var embed = $("#add_embed").val(); 
    var img = $("#add_img").val(); 

    if (! /^[a-zA-Z0-9]+$/.test(name) ){

	//once dialog box works comment this out
	$("#contents").append("<p id='add_proj_error'>Alphanumeric characters only, and no spaces, please.</p>");
	$("#add_proj_error").fadeOut(2500,function(){
	    
	    $("#add_title").val("");
	    $("#create").removeAttr("disabled");
	    $("#add_proj_error").remove();
	});

	//create a window to fix the title - will use jqueryui
	/*res = window.confirm("You have non-alphanumeric characters in your title. Would you like us to remove them?"); */
	
	//comment this out once dialog works
	return false; //break function
    }

    info = { "description" : des, "link" : link, "embed" : embed, "image" : img};

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


function viewProjects(){
    $("#about_me").remove();
    $("#contents").empty().append("<div id='projects'></div>");
    
    var projstr = "";
    for (var proj in projects){
	projstr+= ("<br><div class='pro_experience' id='proj_"+proj+"'><h1>" + proj + "</h1><button class='editProj' type='button' id='"+proj+"' name='Edit Project'>Edit Project</button></div>");
    }
    
    $("#projects").append("<center><h1 id='your_projects'>Your Projects and Experience</h1></center>"+projstr+"");
    $(".editProj").click(editProject);

}


function editProject(){
    $("#editing").remove();
    var proj = $(this).attr("id");
    
    var selectstr = "<select id='folio_select'><option value=''></option>";
    for (var i in folios){
	if (folios[i] != "about"){
	    selectstr += "<option value='"+folios[i]+"'>"+folios[i]+"</option>";
	}
    }
    
    selectstr += "</select>"
    
	$("#proj_"+proj+"").append("<div id='editing'><br><center>Description<br><textarea id='edit_description' type='text' resize='false' placeholder='Write about your project here'></textarea></center><br><center>Link<br><textarea id='edit_link' type='text' resize='false' placeholder='Put a link to the project here (if available)'></textarea></center><br><center>Embedded Content<br><textarea id='edit_embed' type='text' resize='false' placeholder='Put any embedded content code here'></textarea></center><br><center>Select Folio<br>"+selectstr+"</center><br><br><center><button type='button' id='save_proj' name='Save'>Save</button></center><center><button type='button' id='del_proj' name='Delete'>Delete</button></center></div>");
    
    //sometimes the dictionary won't have certain keys
    try { $("#edit_description").text(projects[proj]["description"]); }
    catch (err) { }
    try { $("#edit_link").text(projects[proj]["link"]); }
    catch (err) { }
    try { $("#edit_embed").text(projects[proj]["embed"]); }
    catch (err) { }
    
    $("#save_proj").click({projectname:proj},saveProject);
    $("#del_proj").click({projectname:proj},delProject);

}

function saveProject(event){
    //need to add delprojfromfolio functionality to folio pages
    
    $("#save_proj").attr("disabled","disabled");
    $("#del_proj").attr("disabled","disabled");
    
    var des = $("#edit_description").val();
    var link = $("#edit_link").val();
    var embed = $("#edit_embed").val();

    var projectinfo = { "description":des, "link":link, "embed":embed };

    var projname = event.data.projectname;
    
    var folio_add = $("#folio_select").val();
    //console.log(folio_add);

    $.getJSON("/editProject",{"username":username,"projectname":projname,"projectinfo":projectinfo},function(data){
	if (data == true){

	    if (folio_add != ''){    //if folio_select value is '', don't add a project to a folio!!
		$.getJSON("/addProjToFolio",{"username":username,"folio":folio_add,"project":projname},function(data){
		    if (data == true){
			$("#editing").append("<p class='saved' id='proj_saved'><b>Saved!</b></p>");
			
			$("#proj_saved").fadeOut(2500,function(){
			    $("#save_proj").removeAttr("disabled");
			    $("#del_proj").removeAttr("disabled");
			    $("#proj_saved").remove();
			});
		    }
		    else {
			console.log(data);
			$("#editing").append("<p id='proj_error'>Something went wrong. Please try again.</p>");
			$("#save_proj").removeAttr("disabled");
			$("#del_proj").removeAttr("disabled");
		    }
		});
	    }
	    
	    else {
		$("#editing").append("<p class='saved' id='proj_saved'><b>Saved!</b></p>");
		
		$("#proj_saved").fadeOut(2500,function(){
		    $("#save_proj").removeAttr("disabled");
		    $("#del_proj").removeAttr("disabled");
		    $("#proj_saved").remove();
		});
	    }
	}
	else {
	    console.log(data);
	    $("#editing").append("<p id='proj_error'>Something went wrong. Please try again.</p>");
	    $("#save_proj").removeAttr("disabled");
	    $("#del_proj").removeAttr("disabled");
	}
    });
    

}

function delProject(event){
    var proj = event.data.projectname;
    $("#save_proj").attr("disabled","disabled");
    $("#del_proj").attr("disabled","disabled");

    $.getJSON("/delProject",{"username":username,"projectname":proj}
	      ,function(data){
		  if (data == true){
		      window.location.reload(true);
		  }
		  else {
		      console.log(data);
		      $("#editing").append("<p id='del_error'>Something went wrong. Please try again.</p>");
		      $("#save_proj").removeAttr("disabled");
		      $("#del_proj").removeAttr("disabled"); 
		  }
	      });
}




// startup

$(document).ready( function() {
    $("#add_folio").click(createFolio);
    $("#newProj").click(createProject);
    $("#viewProj").click(viewProjects);
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
