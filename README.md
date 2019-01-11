**blog - Node.js Blog Backend**  

A backend system that uses web requests to create, manage, sort
and distribute blog posts.   
This blog system allows users to create accounts, change their passwords, and create blog posts. Many more features are planned.  
      
**TODO:**
- Force accounts to be verified before any actions can be performed (verify via email code).
- Functions to add/delete/edit comments. Editing can be done by admin or the comment author.
- ~~Implement an IP blocking functionality, with routes to add/remove IPs.~~
- Functions to remove accounts (for administrators).
- Update auth middleware to check for cookies as well (for easy web browsing).
- Fix account implementation to distinguish between admins, authors, and readers (end-users)
