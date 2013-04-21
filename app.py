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
            
            return "PLACEHOLDER - YOU HAVE BEEN LOGGED IN, " + str(username) 
        
        else: #if button == "Create my Folio!"
            name = request.form['first_name'] + " " + request.form['last_name']
            email = request.form['new_email']
            password = request.form['new_password']
            #res will be true or "user already exists"
            res = db.addUser(email,password,name)

            return "<p>PLACEHOLDER - YOU HAVE BEEN REGISTERED, " + name + "</p>" + "<p>" + str(res) + "</p>"


@app.route("/<username>/",methods = ["GET","POST"])
def home(username=""):
    if not username and "user" not in session:
        return redirect(url_for("login"))
    if "user" in session and not username:
        username = session["user"]

    return "PLACEHOLDER - HOME PAGE FOR " + username


@app.route("/<username>/<page>",methods = ["GET","POST"])
def folio(username="",page=""):
    if not username and "user" not in session:
        return redirect(url_for("login"))
    if "user" in session and not username:
        username = session["user"]
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
def dummyajax():
    username = request.args.get("username","")
    if not username:
        username = session["user"]
    return json.dumps(db.getUserInfo(username))



if __name__ == "__main__":
    db.connect()
    app.run(debug=True)

