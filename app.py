from flask import Flask
from flask import request
from flask import render_template
from flask import redirect

app = Flask(__name__)


@app.route("/", methods = ['get','post'])
def home():
    if request.method=='GET':
        return render_template("login.html")
    else:
         button = request.form['password']
         print(button)
         return render_template("login.html")


app.run(debug=True)
