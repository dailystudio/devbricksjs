const logger        = require('../development/logger.js');
const AsyncLock     = require('async-lock');

const lock = new AsyncLock();

module.exports = {

    lockCall: function (keys, asyncCall, ...args) {
        logger.info(`locking call[${asyncCall.name}]: keys = ${JSON.stringify(keys)}, args = ${JSON.stringify(args)}`);
        return new Promise((resolve, reject) => {
            lock.acquire(keys, function(done) {
                asyncCall(...args).then(function (ret) {
                    done(null, ret);
                });
            }, function(err, ret) {
                logger.info(`releasing call[${asyncCall.name}]: keys = ${JSON.stringify(keys)}, args = ${JSON.stringify(args)}, err = ${err}, ret = ${ret}`);
                if (err) {
                    reject(err);
                }

                resolve(ret);
            }, {});
        });
    },

};

