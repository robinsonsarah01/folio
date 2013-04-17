from flask import Flask,request,render_template,redirect, session, url_for
from werkzeug import secure_filename
import db
import json 
import os

app = Flask(__name__)
Flask.secret_key = "folio is short for portfolio" #obvs temporary

#Later we can look into implementing http://pythonhosted.org/Flask-Uploads/
#for neater upload stuff.
#Sets the maximum upload filesize to 96 megabytes; larger files will raise a RequestEntityTOoLarge exception
app.config['MAX_CONTENT_LENGTH'] = 96 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = 'uploads'
global ALLOWED_EXTENSIONS 
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'html'])

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
            res = db.addUser(email,password)

            return "<p>PLACEHOLDER - YOU HAVE BEEN REGISTERED</p>" + "<p>" + str(res) + "</p>"


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
        return "PLACEHOLDER - FOLIO PAGE FOR " + username + "'s " + page

@app.route("/upload", methods = ["GET", "POST"])
def upload():
    if request.method == "POST":
        uploaded_files = request.files.getlist("file[]")
        for fiel in uploaded_files:
            if fiel and allowed_file(fiel.filename):
                filename = secure_filename(fiel.filename)
                fiel.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            else:
                return "Uploaded unsuccessfully!"
        return "Uploaded successfully!"
    else:
        return render_template("upload.html")

def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS
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


if __name__ == "__main__":
    db.connect()
    app.run(debug=True)

