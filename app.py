from flask import Flask,request,render_template,redirect
import db

app = Flask(__name__)


@app.route("/", methods = ['GET','POST'])
def login():
    if request.method=='GET':
        return render_template("login.html")
    else:
         button = request.form['password']
         print(button)
         return "PLACEHOLDER - YOU HAVE BEEN LOGGED IN"


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
    
    app.run(debug=True)

