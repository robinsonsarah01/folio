from flask import Flask,request,render_template,redirect, session, url_for
import db

app = Flask(__name__)
Flask.secret_key = "folio is short for portfolio" #obvs temporary

@app.route("/", methods = ['GET','POST'])
def login():
    if request.method=='GET':
        return render_template("login.html")
    else: 
        button = request.form["button"]
        if button == "Login":
            password = request.form["password"]
            email = request.form["login"]
            #check pass should be done with js and ajax
            #PLACEHOLDER - ADD USER TO SESSION / LOG THEM IN
            return "PLACEHOLDER - YOU HAVE BEEN LOGGED IN"
        
        """
            name = str(request.form['first_name']) + str(request.form['last_name'])
            email = str(request.form['new_email'])
            password = str(request.form['new_password'])
            return "PLACEHOLDER - YOU HAVE BEEN REGISTERED"
        """
        return "doot doot"

@app.route("/<username>",methods = ["GET","POST"])
def home(username=""):
    if not username:
        return redirect(url_for("login"))
    else:
        return "PLACEHOLDER - HOME PAGE FOR " + username


@app.route("/<username>/<page>",methods = ["GET","POST"])
def folio(username="",page=""):
    if not username:
        return redirect(url_for("login"))
    if not page:
        return redirect(url_for("home"))
    else:
        return "PLACEHOLDER - FOLIO PAGE FOR " + username + "'s " + page


if __name__ == "__main__":
    db.connect()
    app.run(debug=True)

