from pymongo import Connection

conn = Connection("mongo2.stuycs.org")
global db,coll


def connect():
    global db,coll
    db = conn.admin
    res = db.authenticate("ml7","ml7")
    """
    db = conn["NAME OF DB"]
    coll = db["c"]
    """


def addUser(username,password):
    pass


def checkPass(username,password):
    pass


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
    pass
    #connect()
