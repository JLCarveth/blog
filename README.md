**blog - Node.js Blog Backend**  

A backend system that uses web requests to create, manage, sort
and distribute blog posts.   
This blog system allows users to create accounts, change their passwords, and create blog posts. Many more features are planned.

There are some cool things about this software that makes it a bit more interesting than most blog software platforms / CMS. I've built several middlewares to accomplish a variety of security features. These middlewares include:  
    
- *RoleWare*: In conjunction with `RoleController` and `RoleModel` to handle the storage of data, RoleWare implements *Role-Based Access Control (RBAC)* through `roles` and `permissions`. With RoleWare implemented, individual routes can be locked behind permissions that are required of the user requesting access. That code looks something like this:

            `app.use('/api/deleteUser', new RoleWare('deleteUser'))`
    This line of code would require that any user making a request to `/api/deleteUser` must have a role with the permission `deleteUser`.

- *IPFilterWare*: This is a far more simple middleware, it allows the blocking of IP addresses. In the future, I plan to implement a DDOS-detection middleware that would use `IPFilterWare` to block offending addresses.
- *AuthWare*: A very simple authentication middleware that checks incoming requests for valid tokens.
    
      
**TODO:**
- Force accounts to be verified before any actions can be performed (verify via email code).
- ~~Implement an IP blocking functionality, with routes to add/remove IPs.~~ (Needs Testing...)
- Functions to remove accounts (for administrators).
- ~~Update auth middleware to check for cookies as well (for easy web browsing)~~ (Needs testing)
- ~~Implement role-based access control for all actions.~~ (Needs testing but works)
- Limit failed password attempts to prevent brute force attacks.
- Add function to check token expiration, since apparently the JWT lib doesn't do it, which is half the point of verifying tokens...
- Commenting system
