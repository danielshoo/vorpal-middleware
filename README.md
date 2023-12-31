# vorpal-middleware
A middleware pipeline supporting the Vorpal CLI package

### Problem Statement

Ideally, Vorpal would have a native middleware pipeline (similar to Express) in which each entry could act on and mutate 
the CLI arguments in a legible and predictable order. Since it does not, at the time of writing, this forces logic into Vorpal-actions 
promoting code duplication. Consider having multiple Vorpal-commands that require validating a session-token and appending
user data to the CLI arguments. To that end, an AuthMiddleware could be added to this pipeline.

### Asynchronous Middleware Support
Asynchronous middlewares are supported. They will also be executed in the order they were added to the pipeline.

### Example Middleware

```
// AuthMiddleware.js

import OAuth2 from "#lib/oauth2";

/**
 * @param {{}} args : The cli arguments provided by user.
 * @param {function} callback : A callback function that prints errors and ends execution of the command.
 * @returns {void}
 */
export default function(args, callback) {
    OAuth2.validateSessionToken(args.sessionToken, (err, user) => {
        if (err) {
            callback(err);
        } else {
            Object.assign(args, { ...user });
        }
    });
}
```

### Example Usage:

```
// index.js

///////////////////////////////////////////////
// Collect your dependencies and middlewares //
///////////////////////////////////////////////

import vorpalDefault from 'vorpal';
import { getVorpalMiddlewarePipeline } from "#lib/vorpal-middleware"; // Project directory structures will vary.
import uncaughtExceptionMiddleware from "#src/frameworks/terminal/vorpal/middleware/uncaughtExceptionMiddleware.js";
import authMiddleware from "#src/frameworks/terminal/vorpal/middleware/authMiddleware.js";
import * as accountRoutes from '#src/frameworks/terminal/vorpal/routes/account.js';
const vorpal = vorpalDefault();

//////////////////////////////////////////////////////
// Add your middlewares to the middleware pipeline: //
//////////////////////////////////////////////////////

const middlewarePipeline = getMiddlewarePipeline();
middlewarePipeline.push(uncaughtExceptionMiddleware);
middlewarePipeline.push(authMiddleware);

vorpal.command('create-account <firstName> <lastName> <username> <email> <password>').action(function(args, cb) {
    
    ///////////////////////////////////////////////////////////////
    // Execute the middleware pipeline. Each middleware layer    //
    // has the ability to mutate or act on the args object/param //
    //                                                           //
    // @param {{}} this : A 'this' override provided by Vorpal.  //
    // @param {{}} args : The cli arguments provided by user.    //
    // @param {function} cb : A callback function that ends      //
    // execution of the command.                                 //
    // @param {function} action : The actual function to call    //
    // once all middlewares have been executed.                  //
    ///////////////////////////////////////////////////////////////
    middlewarePipeline.execute(this, args, cb, accountRoutes.createAccount);
});

vorpal.command('delete-account <password> [username] [email]').action(function(args, cb) {
    middlewarePipeline.execute(this, args, cb, accountRoutes.deleteAccount);
});

vorpal.delimiter('app-name').parse(process.argv);

```
