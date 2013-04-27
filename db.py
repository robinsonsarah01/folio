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


def addUser(username,password,name):
    if username in [ x["username"] for x in coll.find() ]:
        return errors[0]
    user = { "username" : username
             , "password" : password #temporary
             , "folios" : ["about"] #keep track of folio names
             , "about" : "<p>" + name + "</p>" #temporary
             , "projects" : [ ] }
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
             , "folios" : user["folios"]
             , "projects" : user["projects"] }

    for p in user["folios"]:
        info[p] = user[p]
    
    return info

@user_exists
def getPage(username,page):
    user = coll.find_one({"username":username})
    if page in user["folios"]:
        return user[page]
    return errors[2]


@user_exists
def addPage(username,pagename,pageinfo):
    user = coll.find_one({"username":username})
    if pagename in user["folios"]:
        return errors[3]
    
    p = user["folios"]
    p.append(pagename)
    coll.update({"username":username},
                { "$set": {"folios":p
                           ,pagename:pageinfo} } )
    
    return True


@user_exists
def delPage(username,pagename):
    user = coll.find_one({"username":username})
    if pagename not in user["folios"]:
        return errors[2]

    p = [ x for x in user["folios"] if x != pagename ]
    coll.update({"username":username},
                { "$set": {"folios":p} } )
    
    coll.update({"username":username},
                { "$unset" : { pagename : "" } } )
    
    return True
    

@user_exists
def editPage(username,pagename,info,aspect=""):
    user = coll.find_one({"username":username})
    if pagename not in user["folios"]:
        return errors[2]

    if not aspect:
        delPage(username,pagename)
        addPage(username,pagename,info)
        return True

    else:
        p = user[pagename]
        p[aspect] = info
        coll.update({"username":username},
                    { "$set": {pagename:p} } )

        return True


#project stuff

@user_exists
def getProjects(username):
    user = coll.find_one({"username":username})
    return user["projects"]


@user_exists
def addProject(username,projectinfo):
    user = coll.find_one({"username":username})

    p = user["projects"]
    p.append(projectinfo)
    coll.update({"username":username},
                { "$set": {"projects":p}})
    
    return True #could return index instead


@user_exists
def delProject(username,projectindex="",projectinfo=""):
    pass


@user_exists
def editProject(username,projectinfo,projectindex=""):
    pass




#testing stuff

def dropUsers(): #testing purposes
    for iden in [ x["_id"] for x in coll.find() ]:
        coll.remove({"_id":iden})
    return True





if __name__ == "__main__":
    connect()
    #dropUsers()
    #addUser("test","test","test name")
    #print checkPass("test","test")
    #print addPage("test","page","<p>here is some stuff yep</p>")
    #print editPage("test","page","this is my page portfolio")
    #print getUserInfo("test")



"""
new architecture:

each user is a dictionary in the db

{ username, name, password, etc ... 

folios : [ list of folio names ] 
--> currently exists as "pages"

individual folios (under their names, in top level dictionary) : { description , list of indexes of projects , etc }
--> currently saved as string descriptions (current methods should work with dict?)

projects : [ { p1 } , { p2 } , etc ]
--> does not exist yet
--> to access projects from folios you take userdict[projects] and use the indexes to take the projects you want for that specific folio


"""
