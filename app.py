from flask import Flask,request,render_template,redirect, session, url_for
from werkzeug import secure_filename
import db
import json 
import os

app = Flask(__name__)
Flask.secret_key = "folio is short for portfolio" #obvs temporary
app.config['MAX_CONTENT_LENGTH'] = 24 * 1024 * 1024 #max filesize 10mb
app.config['UPLOAD_FOLDER'] = 'uploads'
global ALLOWED_EXTENSIONS
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
@app.route("/", methods = ['GET','POST'])
def login():
    if request.method=='GET':
        if "user" in session:
            username = session["user"]
            return redirect(url_for("home",username=username))
        return render_template("login.html")
    else: 
        if "user" in session:
                return "we have issues right now." #aka this is not a thing

        button = request.form["button"]
        if button == "Login":
            password = request.form["password"]
            username = request.form["login"]
            
            #check pass
            res = db.checkPass(username,password)
            if res != True: #res is false or user does not exist
                error = res
                if res == False: 
                    error = "Incorrect Password"
                return render_template("login.html",anerror=error)
            
            #if all goes well
            session["user"] = username
            info = db.getUserInfo(username)
            #print "RESULT IN LOGIN: ", info
            try:
                pages = info["folios"]
            except: #fails if info is a string error
                print "ERROR IN LOGIN/DB"
                return render_template("login.html",anerror=info)
            
            return redirect(url_for("home",username=username,pages=pages)) 
        
        else: #if button == "Create my Folio!"
            name = request.form['first_name'] + " " + request.form['last_name']
            email = request.form['new_email']
            password = request.form['new_password']
            #res will be true or "user already exists"
            res = db.addUser(email,password,name)

            if res != True:
                return render_template("login.html",anerror=res)

            username = email
            pages = ["about"] #what all new users have
            projects = []
            return redirect(url_for("home",username=username,pages=pages
                                    ,projects=projects))



@app.route("/logout",methods=["GET","POST"])
def logout():
    if "user" in session:
        session.pop("user",None)
    return redirect(url_for("login"))


@app.route("/<username>/",methods = ["GET","POST"])
def home(username=""):
    if not username and "user" not in session:
        return redirect(url_for("login"))
    if "user" in session and not username:
        username = session["user"]
        
    if request.method == "GET":
        #print "USERNAME: ", username
        info = db.getUserInfo(username)
        #print "GOT INFO FROM DB IN HOME: ", info
        try:
            pages = info["folios"]
            projects = info["projects"]
        except: #fails if info is a string error
            #print "USER DOES NOT EXIST ERROR"
            return redirect(url_for("login",anerror=info))
        return render_template("setup.html",username=username,pages=pages
                               ,projects=projects)
    elif request.method == "POST":
        username = str(request.form['uzernaem'])
        uploaded_files = request.files.getlist('file[]')
        os.system("mkdir uploads/" + username)
        for fiel in uploaded_files:
            if fiel and allowed_file(fiel.filename):
                filename = secure_filename(fiel.filename)
                fiel.save(os.path.join(app.config['UPLOAD_FOLDER']+'/'+username+'/', filename))        
        """
        info = db.getUserInfo(username)
        try: 
            pages = info['folios']
            projects = info['projects']
        except:
            return redirect(url_for("login", anerror=info))
        return render_template("setup.html", username=username, pages=pages, projects=projects) 
        """
        return redirect("/"+username+"/")

@app.route("/<username>/<page>",methods = ["GET","POST"])
def folio(username="",page=""):
    if not username and "user" not in session:
        return redirect(url_for("login"))
    #if "user" in session and not username: #cannot access other pages when logged in
     #   username = session["user"]
    if not page:
        return redirect(url_for("home",username))
    
    else:
        folio = db.getPage(username,page)
        projects = db.getProjects(username)
       
        if folio == "folio or project does not exist":
            return redirect(url_for("home"))
       
        return render_template("user.html",username=username
                               ,page=page,folio=folio,projects=projects)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

#might not use this - edit happens in /username (home page) thru js

"""
@app.route("/<username>/<page>/edit",methods = ["GET","POST"])
def edit(username="",page=""):
    if not username and "user" not in session:
        return redirect(url_for("login"))
    if "user" in session and not username:
        username = session["user"]
    if not page:
        return redirect(url_for("home"))
    else:
        return "PLACEHOLDER - FOLIO EDIT PAGE FOR " + username + "'s " + page
"""


#---ajax urls------------------

#folio (page) ajax stuff
@app.route("/upload", methods=["GET", "POST"])
def uploadImage():
    username
@app.route("/getUserInfo",methods=["GET","POST"])
def getUserInfo():
    username = request.args.get("username","")
    if not username:
        username = session["user"]
    return json.dumps(db.getUserInfo(username))


@app.route("/getPage",methods=["GET","POST"])
def getPage():
    username = request.args.get("username","")
    page = request.args.get("page","")
    if not username:
        username = session["user"]
    if not page:
        page = "about" #default

    return json.dumps(db.getPage(username,page))


@app.route("/addPage",methods=["GET","POST"])
def addPage():
    username = request.args.get("username","")
    pagename = request.args.get("pagename","")
    des = request.args.get("description","")
    print username,pagename,des

    if not username:
        username = session["user"]

    res = False
    if pagename: #info can be blank
        print "ADDING FOLIO"
        res = db.addPage(username,pagename,des)
            
    print res
    return json.dumps(res)


@app.route("/delPage",methods=["GET","POST"])
def delPage():
    username = request.args.get("username","")
    pagename = request.args.get("pagename","")
    
    if not username:
        username = session["user"]
    
    res = False
    if pagename:
        res = db.delPage(username,pagename)

    return json.dumps(res)


@app.route("/editPage",methods=["GET","POST"])
def editPage():
    username = request.args.get("username","")
    pagename = request.args.get("pagename","")
    info = request.args.get("info","")
    aspect = request.args.get("aspect","") #works if folios are in dict format

    if not username:
        username = session["user"]

    res = False
    if pagename and info:
        res = db.editPage(username,pagename,info,aspect)

    return json.dumps(res)


#projects ajax stuff

@app.route("/getProjects",methods=["GET","POST"])
def getProjects():
    username = request.args.get("username","")
    if not username:
        username = session['user']

    return json.dumps(db.getProjects(username))


@app.route("/addProject",methods=["GET","POST"])
def addProject():
    username = request.args.get("username","")
    if not username:
        username = session['user']

    projectname = request.args.get("projectname","")
    des = request.args.get("projectinfo[description]","")
    link = request.args.get("projectinfo[link]","")
    embed = request.args.get("projectinfo[embed]","")

    projectinfo = { "description":des, "link":link, "embed":embed }
    
    print projectinfo

    res = False
    if projectname:
        res = db.addProject(username,projectname,projectinfo)

    return json.dumps(res)


@app.route("/delProject",methods=["GET","POST"])
def delProject():
    username = request.args.get("username","")
    if not username:
        username = session['user']
    
    projectname = request.args.get("projectname","")

    res = False
    if projectname:
        res = db.delProject(username,projectname)

    return json.dumps(res)


@app.route("/editProject",methods=["GET","POST"])
def editProject():
    username = request.args.get("username","")
    if not username:
        username = session['user']
    
    projectname = request.args.get("projectname","")
    aspect = request.args.get("aspect","")
    projectinfo = request.args.get("projectinfo","")

    if not aspect:
        des = request.args.get("projectinfo[description]","")
        link = request.args.get("projectinfo[link]","")
        embed = request.args.get("projectinfo[embed]","")
        img = request.args.get("projectinfo[image]","")
        projectinfo = { "description":des, "link":link
                        , "embed":embed , "image" : img }

    res = False
    if projectname and projectinfo:
        res = db.editProject(username,projectname,projectinfo,aspect)

    return json.dumps(res)


@app.route("/addProjToFolio",methods=["GET","POST"])
def addProjToFolio():
    username = request.args.get("username","")
    if not username:
        username = session['user']
        
    folio = request.args.get("folio","") #aka 'page'
    project = request.args.get("project","") #name not info

    res = False
    if folio and project:
        res = db.addProjToFolio(username,folio,project)

    return json.dumps(res)


@app.route("/delProjFromFolio",methods=["GET","POST"])
def delProjFromFolio():
    username = request.args.get("username","")
    if not username:
        username = session['user']
        
    folio = request.args.get("folio","") #aka 'page'
    project = request.args.get("project","") #name not info

    res = False
    if folio and project:
        print "deleting proj from folio"
        res = db.delProjFromFolio(username,folio,project)

    return json.dumps(res)




db.connect()
app.run(port=8888)

