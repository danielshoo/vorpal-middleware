import process from 'node:process';

export default function (args, callback) {

    process.on('uncaughtException', function (err) {
        callback(err);
    });

    process.on('unhandledRejection', function(err, promise) {
        callback(err);
    });
}
