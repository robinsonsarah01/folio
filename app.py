from flask import Flask,request,render_template,redirect, session, url_for
import db
import json 

app = Flask(__name__)
Flask.secret_key = "folio is short for portfolio" #obvs temporary

@app.route("/", methods = ['GET','POST'])
def login():
    if request.method=='GET':
        if "user" in session:
            username = session["user"]
            return redirect(url_for("home",username=username))
        return render_template("login.html")
    else: 
        if "user" in session:
                return "we have issues." #aka this is not a thing

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
                return render_template("login.html",error=error)
            
            #if all goes well
            session["user"] = username
            info = db.getUserInfo(username)
            try:
                pages = info["pages"]
            except: #fails if info is a string error
                return render_template("login.html",error=info)
            
            return redirect(url_for("home",username=username,pages=pages)) 
        
        else: #if button == "Create my Folio!"
            name = request.form['first_name'] + " " + request.form['last_name']
            email = request.form['new_email']
            password = request.form['new_password']
            #res will be true or "user already exists"
            res = db.addUser(email,password,name)

            return "<p>PLACEHOLDER - YOU HAVE BEEN REGISTERED, " + name + "</p>" + "<p>" + str(res) + "</p>"



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
        
    info = db.getUserInfo(username)
    try:
        pages = info["pages"]
    except(e): #deal with user does not exist errors elsewhere?
        pages = ["about"]

    return render_template("setup.html",username=username,pages=pages)


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
       
        if folio == "page does not exist":
            return redirect(url_for("home"))
       
        return render_template("user.html",username=username
                               ,page=page,folio=folio)



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



#ajax urls

""" #not to be used - see login url for authentication
@app.route("/checkPass",methods = ["GET","POST"])
def checkPass():
    username = request.args.get("username","")
    password = request.args.get("password","")
    res = {}
    if username and password:
        res = db.checkPass(username,password)
    return json.dumps(res)
"""


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
    info = request.args.get("info","")
    
    if not username:
        username = session["user"]

    res = False
    if pagename: #info can be blank
        res = db.addPage(username,pagename,info)
            
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
    aspect = request.args.get("aspect","") #works if folio is in dict format

    if not username:
        username = session["user"]

    res = False
    if pagename and info:
        res = db.editPage(username,pagename,info,aspect)

    return res
    
    




if __name__ == "__main__":
    db.connect()
    app.run(debug=True)

