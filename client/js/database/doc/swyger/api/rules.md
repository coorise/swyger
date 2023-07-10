# Rules
Here , we will explain some rules and mistakes about chainable to avoid.

```
//After setting up
 const client=swyger.init(req)
 //You can do:
 client
      .auth
           .login
           ... //other subchild
 //You can not do:
  client
       .auth
            .login
            ... //other subchild
       .database
                .create
                ... //other subchild
  //Instead, you will have to create two variables:
   const auth=client.auth
         auth
             .login
             ... //other subchild
   const database=client.database
         database
                .create
                ... //other subchild
 //You can not do:
   client
         .database
                 .database //calling the same function
                         .create
                         ... //oth subchild
```
