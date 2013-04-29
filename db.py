from pymongo import Connection

conn = Connection("mongo2.stuycs.org")
global db,coll
errors = ["user already exists"
          ,"user does not exist"
          ,"folio or project does not exist"
          ,"folio or project already exists"]


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
             , "about" : { "description" : name } #temporary
             , "projects" : { } }
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
def addPage(username,pagename,description):
    user = coll.find_one({"username":username})
    if pagename in user["folios"]:
        return errors[3]
    
    p = user["folios"]
    p.append(pagename)
    pageinfo = { "description":description,"projects":[] }
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
        #delPage(username,pagename) #lazy version
        #addPage(username,pagename,info)
        
        coll.update({"username":username},
                    { "$set": {pagename:info} } )
        
        return True

    else:
        p = user[pagename]
        print p
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
def addProject(username,projectname,projectinfo):
    user = coll.find_one({"username":username})

    p = user["projects"]

    if projectname in p.keys():
        return errors[3]
    
    p[projectname] = projectinfo
    coll.update({"username":username},
                { "$set": {"projects":p}})
    
    return True


@user_exists
def delProject(username,projectname):
    user = coll.find_one({"username":username})

    p = { n : p for n,p in user["projects"].iteritems() if n != projectname }
    coll.update({"username":username},
                { "$set": {"projects":p}})

    for folio in user["folios"]:
        delProjFromFolio(username,folio,projectname)
    
    return True
    


@user_exists
def editProject(username,projectname,projectinfo,aspect=""):
    user = coll.find_one({"username":username})
    if projectname not in user["projects"].keys():
        return errors[2]

    projects = user["projects"]

    if not aspect:
        projects[projectname] = projectinfo
    else:
        projects[projectname][aspect] = projectinfo

    coll.update({"username":username},
                { "$set": {"projects":projects} } )

    return True



@user_exists
def addProjToFolio(username,folio,project):
    #used separately from addProject thru tagging ability
    
    user = coll.find_one({"username":username})
    
    if folio not in user["folios"]:
        return errors[2]

    f = user[folio]
    f["projects"].append(project)
    
    coll.update({"username":username},
                { "$set": {folio:f}})

    return True


@user_exists
def delProjFromFolio(username,folio,project):
    #used in delProject and separately

    user = coll.find_one({"username":username})

    f = user[folio]
    if project in f["projects"]: #f[p] is a list of str project names
        f["projects"].remove(project)

    coll.update({"username":username},
                { "$set": {folio:f}})

    return True




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
    #print addPage("test","page",{"description":"this is my page folio","projects":[]})
    #print delPage("test","Software Dev")
    #print editPage("test","about","test name - i am cool","description")
    #print delProject("test","p1")
    #print addProject("test","p1",{"description":"this is my first project"
                                  ,"link":"some.com","embed":""})
    #print addProjToFolio("test","page","p1")
    #print delProjFromFolio("test","page","p1")
    #print editProject("test","p1","this is my first project, yo","description")
    print getUserInfo("test")



"""
new architecture:

each user is a dictionary in the db

{ username, name, password, etc ... 

folios : [ list of folio names ] 
--> used to be "pages"

individual folios (under their names, in top level dictionary) : { description , list of names of projects , etc }
--> used to be saved as just string descriptions (current methods work with dictionaries)

projects : { p1name: { p1 } , p2name: { p2 } , etc }
--> to access projects from folios you take userdict[projects] and use the names to take the projects you want for that specific folio


"""
