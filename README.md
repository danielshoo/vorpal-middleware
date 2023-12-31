# vorpal-middleware
A basic middleware pipeline supporting the Vorpal CLI package


## Example Usage:

```
///////////////////////////////////////////////
// Collect your dependencies and middlewares //
///////////////////////////////////////////////

import vorpalDefault from 'vorpal';
const vorpal = vorpalDefault();
import getMiddlewarePipeline from "#src/frameworks/terminal/vorpal/util/getMiddlewarePipeline.js"; // your project structure will vary
import uncaughtExceptionMiddleware from "#src/frameworks/terminal/vorpal/middleware/uncaughtExceptionMiddleware.js";
import authMiddleware from "#src/frameworks/terminal/vorpal/middleware/authMiddleware.js";
import * as accountRoutes from '#src/frameworks/terminal/vorpal/routes/account.js';

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
    // @param {{}} args : The cli arguments ptovided by user.    //
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
