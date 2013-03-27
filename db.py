from pymongo import Connection

conn = Connection("mongo2.stuycs.org")
global db,coll
errors = ["user already exists"
          ,"user does not exist"
          ,"page does not exist"
          ,"page already exists"]


def connect():
    global db,coll
    db = conn.admin
    res = db.authenticate("ml7","ml7")
    db = conn["folio"]
    coll = db["c"]


#decorator

def user_exists(original):
    def check(*args):
        username = args[0]
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


@user_exists
def getUserInfo(username):
    user = coll.find_one({"username":username})
    info = { "username" : user["username"]
             , "pages" : user["pages"] }

    for p in user["pages"]:
        info[p] = user[p]
    
    return info

@user_exists
def getPage(username,page):
    user = coll.find_one({"username":username})
    if page in user["pages"]:
        return user[page]
    return errors[2]


@user_exists
def addPage(username,pagename,pageinfo):
    user = coll.find_one({"username":username})
    if pagename in user["pages"]:
        return errors[3]
    
    p = user["pages"]
    p.append(pagename)
    coll.update({"username":username},
                { "$set": {"pages":p
                           ,pagename:pageinfo} } )
    
    return True


@user_exists
def delPage(username,pagename):
    user = coll.find_one({"username":username})
    if pagename not in user["pages"]:
        return errors[2]

    p = [ x for x in user["pages"] if x != pagename ]
    coll.update({"username":username},
                { "$set": {"pages":p} } )
    
    coll.update({"username":username},
                { "$unset" : { pagename : "" } } )
    
    return True
    




#will implement later if needed
def editPage(username,pagename,aspect,info):
    pass




#testing stuff

def dropUsers(): #testing purposes
    for iden in [ x["_id"] for x in coll.find() ]:
        coll.remove({"_id":iden})
    return True





if __name__ == "__main__":
    connect()
    #addUser("test","test")
    #print checkPass("test","test")
    #print delPage("test","p1")
    print getUserInfo("test")
