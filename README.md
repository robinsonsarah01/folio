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
*   [Front page design](http://i1322.photobucket.com/albums/u568/Daryl_LikeaBoshkosh/ScreenShot2013-03-25at105308PM1_zpsb15aa15b.png), courtesy of Jasko   

Features To Be Implemented
--------------------------

###Frontend  
*   Choose a custom URL for your folio (if we want to do this)  
*   View folio  
*   Ready-made templates
*   Method of customizing templates
*   Edit folio  
*   Add project  
*   Upload resume  
*   Allow users to tag projects/bits of information according to the resume they want them to appear in, as well as weight them so they appear in the desired order (i.e. #net: 1, #sysadmin: 7)  
*   Allow users to link to content from other sites  
*   Forgotten password page  
*   Many more

###Backend  
*   Server login stuff + session + remember me; see [relevant documentation](http://pythonhosted.org/Flask-Login/)
*   Forgotten password server stuff (may or may not be feasible)
*   Dealing with folio custom URLs
*   MongoDB: Storing users' folios

Deadlines
---------
3/29: Login page should be functional for multiple users concurrently accessing folio.  
4/1: 2 ready-made templates created. MongoDB code for storing folios functional.  
4/3: Users should be able to view and edit folio at a basic level.  
4/7: More ready-made templates created. Mechanisms for customizable templates in place; editing folios allows for addition of projects and uploading of resumes.  
4/14: Integration with other sites worked out. Customization smoothed out.  
4/21: Visual effects added to site and folios; more ready-made templates created, some with fancy visuals.  
4/24: Project deployed and sent out to others for beta testing. Peter and Daryl are out of the picture for the next 4 days so Sarah and Elizabeth deal with debugging.  
4/28: Folio is polished and has been tested by many; final issues are being worked out.  
5/1: Project due date  

Individual Task Distribution
----------------------------
More tasks will be added as progress carries on.  
*   Peter and Elizabeth are to finalize the UI design, paper prototyping everything and beginning to work on the html pages. Once a solid UI design is in place, there will be many more tasks here.  
*   Sarah will write the server code for the login page, preferably implementing session and remember me ([relevant documentation](http://pythonhosted.org/Flask-Login/)) 
*   Daryl will plan out visual effect templates for use towards the end of the project, delegate and coordinate work, and perform general bugfixes/pitch in wherever he sees fit. I'm kind of appointing myself team leader here. 

Branch Workflow/Github Use
--------------------------
Not quite established yet but have a [Git Cheat Sheet](http://byte.kde.org/~zrusin/git/git-cheat-sheet-medium.png). Obviously write detailed commit messages.  
