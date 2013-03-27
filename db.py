from pymongo import Connection

conn = Connection("mongo2.stuycs.org")
global db,coll
errors = ["user already exists"
          ,"user does not exist"]


def connect():
    global db,coll
    db = conn.admin
    res = db.authenticate("ml7","ml7")
    db = conn["folio"]
    coll = db["c"]


#decorator

def user_exists(original):
    def check(*args):
        username,password = args[0],args[1]
        if username not in [ x["username"] for x in coll.find() ]:
            return errors[1]
        else:
            return original(*args)
    return check




# -- DB FUNCTIONS


def addUser(username,password):
    if username in [ x["username"] for x in coll.find() ]:
        return errors[0]
    user = { "username" : username
             , "password" : password #temporary
             , "pages" : [] } #keep track of page names
    coll.insert(user)
    return True

@user_exists
def checkPass(username,password):
    user = coll.find_one({"username":username})
    if password == str(user["password"]):
        return True
    return False


def getUserInfo(username):
    pass


def getPage(username,page):
    pass


def addPage(username,pagename,pageinfo):
    pass


#might not need this
def editPage(username,pagename,aspect,info):
    pass






if __name__ == "__main__":
    connect()
    #addUser("test","test")
    print checkPass("test","test")
