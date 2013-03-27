Folio
=========
###Group Members:  
Daryl Sew, Sarah Robinson, Elizabeth Ji, Peter Jasko  

What it is:  
-----------
Folio is a streamlined portfolio builder created to help job seekers present themselves effectively to prospective employers.  

Resources & Dependencies:
------------------------
*   Github API for code integration  
*   Soundcloud for music integration
*   Deviantart/flickr for art integration

Current Features
----------------
*   ![Front page design](http://i1322.photobucket.com/albums/u568/Daryl_LikeaBoshkosh/ScreenShot2013-03-25at105308PM1_zpsb15aa15b.png), courtesy of Jasko   

Features To Be Implemented
--------------------------

###Frontend  (Peter & Elizabeth)
*   Choose a custom URL for your folio (if we want to do this)  
*   View folio  
*   Ready-made templates
*   Edit folio  
*   Add project  
*   Upload resume  
*   Allow users to tag projects/bits of information according to the resume they want them to appear in, as well as weight them so they appear in the desired order (i.e. #net: 1, #sysadmin: 7)  
*   Allow users to link to content from other sites  
*   Forgotten password page  
*   Many more

###Backend  (Sarah & Daryl)
*   Server login stuff + session + remember me; see [relevant documentation](http://pythonhosted.org/Flask-Login/) -- see below under tasks re: why are we using flask-login
*   Forgotten password server stuff (may or may not be feasible -- probably not, leave it for later if there's time)
*   MongoDB: Storing users' folios

Deadlines
---------

*    4/1: MongoDB code for storing folios functional.  
*    4/3: 2 ready-made templates created. Login page should be functional for multiple users concurrently accessing folio. 
*    4/7: Users should be able to view and edit folio at a basic level.  
*    4/14: More ready-made templates created. Editing folios allows for addition of projects and uploading of resumes.  
*    4/21: Integration with other sites worked out.
*    4/24: Visual designs added to site and folios; more ready-made templates created.  
*    4/28: Project deployed; testing. Peter and Daryl are out of the picture for the next 4 days so Sarah and Elizabeth deal with debugging.
*    4/30: Folio is polished; final issues are being worked out.  
*    5/1: Project due date  

(EDIT: Please note that Daryl did not consult us about any of this and therefore these deadlines are not realistic. Schedules may become impacted by pending college visits. Thank you.)

Individual Task Distribution
----------------------------
These will change as the project progresses. Feel free to modify anything. 
*   Peter will lead frontend work.
*   Sarah will lead backend work.
*   Peter and Elizabeth are to finalize the UI design, paper prototyping everything and beginning to work on the html pages. Once a solid UI design is in place, there will be many more tasks here.  
*   Sarah will write the server code for the login page, preferably implementing session and remember me ([relevant documentation](http://pythonhosted.org/Flask-Login/)) -- Sarah does not see why we need to use flask-login, as none of the special things it does are things we need. She will instead be working on fleshing out some of the db.py functions. 
*   Daryl will plan out visual effect templates for use towards the end of the project, delegate and coordinate work, and perform general bugfixes/pitch in wherever he sees fit.
*   Team leader is unfilled. It is not Daryl unless a vote is performed. Awaiting Peter's return to teh internetz to determine overall team leader.

Branch Workflow/Github Use
--------------------------
Not quite established yet but have a [Git Cheat Sheet](http://byte.kde.org/~zrusin/git/git-cheat-sheet-medium.png). Obviously write detailed commit messages.  
