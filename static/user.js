var username
var currpage
var projects
var name


function getInfo(){
    var url = document.URL;
    var info = url.split("/");
    username = info[3];
    currpage = info[4];
    //return [ username, currpage ];

    $.getJSON("/getUserInfo",{"username":username},function(data){
	//folios = data['folios'];
	projects = data['projects'];
	name = data['name'];
    });
}

function getPage(page){
    $.getJSON("/getPage",{"username":username,"page":page},function(data){
	loadFolioData(data);
    });
}

function gitURL(url){
    var items = [];
    var hash = {};
    var url;
    var fin;

    var x = $.getJSON("https://api.github.com/repos/"+ url +"/readme",function(data){
	    $.each(data, function(key, val) {
		    items.push('<li id="' + key + '">' + val + '</li>');
		    hash[key] = val;  
		});
	    set();
	});

    function set(){
	url  = hash['html_url'];
	url = url.split('https://')
url = url[1]
	    url = 'raw.'+url;
	url =  url.replace('/blob/','/');
    }
    
    var fin = $.getJSON("https://" + url);
    return fin;
}
    

function loadFolioData(data){
    //can do things to pagedata to make it pretty before this step
    //like mess with it in js and use different methods to display it etc

    $("#folio_contents").empty().append("<div id='name'><center><h1>"+name+"</h1></center></div>"+"</div><div id='descrption'>&nbsp;&nbsp;&nbsp;"+data['description']+"</div>");

    if($('#folio_description').length == 0) {
    $("#left_scroll").append("<div id=folio_description> &nbsp;" +data['description']+ "</div>");
	}
    var projstr = "";
    for (var key in data['projects']){
	proj = projects[data['projects'][key]]; //proj is project data

	projstr += "<div class='new_project' id='proj_"+data['projects'][key]+"'>";

	if (proj['description']) {
	    projstr += "<div id='description'><b>Project Description:</b>"+proj['description']+"</div>";
	}
	if (proj['link']) {
	    projstr += "<br>This project can be viewed over <a href=http://"+proj['link']+" id="+proj['link']+">here.</a><br>";
	}


if (proj['key']) {
	    projstr += "<br>"+proj['key'];
	}
	if (proj['embed'])  {
	    projstr+= "<br><center>"+proj['embed']+ "</center>";
	}
	
	projstr+="</div><br><br><hr width='75%' size='5' color='#8E978D'> ";
    }

    $("#folio_contents").append("<p id='projects'>"+projstr+"</p>");
}


function viewFolio(page){
    getPage(page); //gets data and loads it
    
}

function renderMD(){
    var links = $('a');
    $.map(links,function(n){
	    console.log(" n is " + n); 
	    link = "";
	    link = "" + n;
	    
	    if(link.indexOf('github.com') >= 0){
		var url = link.split('http://https//github.com/');
		var markdown = $.getJSON("/getMD",{"url":"https://raw.github.com/"+url[1]+"/master/README.md"},function(){
			try{
				link = link.split("http://https");
			}
			catch(err){}
			link[0]="http://https";
			var fin_link = link[0] + ":" + link[1];
			var href = $("a[href*=" +"\""+fin_link+ "\""+ "]");
			console.log(href.closest("div"));
			href.closest("div").append("<br><p>" + markdown.responseText+ "</p>");
		    });
	    }
	});}

$(document).ready( function() {
    //console.log(document.URL); //also window.location
    getInfo();
    viewFolio(currpage);


    

    $('.left_rectangle').click(function(){
	renderMD();
	$('.left_rectangle').css("background-color","#8E978D");
	$('#' + this.id).css("background-color","#CDF2D6");
	$('.left_rectangle').css("color","white");
	sti$('#' + this.id).css("color","#8E978D");

	});


    

    });