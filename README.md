# vorpal-middleware
A basic middleware pipeline supporting the Vorpal CLI package


## Example Usage:

```
// terminal.mjs (aka main.js or index.js)

import vorpalDefault from 'vorpal';
const vorpal = vorpalDefault();
import getMiddlewarePipeline from "#src/frameworks/terminal/vorpal/util/getMiddlewarePipeline.js"; // your project structure will vary
import uncaughtExceptionMiddleware from "#src/frameworks/terminal/vorpal/middleware/uncaughtExceptionMiddleware.js";
import authMiddleware from "#src/frameworks/terminal/vorpal/middleware/authMiddleware.js";
import * as accountRoutes from './routes/account.js';

const middlewarePipeline = getMiddlewarePipeline();
middlewarePipeline.push(uncaughtExceptionMiddleware);
middlewarePipeline.push(authMiddleware)

vorpal.command('create-account <firstName> <lastName> <username> <email> <password>').action(function(args, cb) {
    middlewarePipeline.execute(this, args, cb, accountRoutes.createAccount);
});

vorpal.command('delete-account <password> [username] [email]').action(function(args, cb) {
    middlewarePipeline.execute(this, args, cb, accountRoutes.deleteAccount);
});

vorpal.delimiter('app-name').parse(process.argv);

```
