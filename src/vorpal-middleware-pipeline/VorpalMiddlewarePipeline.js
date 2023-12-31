export default class VorpalMiddlewarePipeline {

    constructor(_action, ..._middlewares) {
        this.action = _action ? _action : (args, cb) => {
            console.log('empty default action executed');
            cb();
        };
        this.middlewareStack = _middlewares.length ? [..._middlewares] : [];
    }

    setAction(vorpalFunction) {
        this.action = vorpalFunction;
        return this;
    }

    push(...middlewares) {
        this.middlewareStack.push(...middlewares);
        return this;
    }

    execute(vorpalThis, args, cb, action) {
        const resolvedAction = action || this.action || ((args, cb) => cb('empty middleware'));

        (async () => {
            await this._execute(0, args, cb, vorpalThis)
            resolvedAction.call(vorpalThis, args, cb);
        })();
    }

    async _execute(index, args, callback) {

        if (index >= this.middlewareStack.length) {
            return;
        }

        await this.middlewareStack[index](args, callback);
        await this._execute(index + 1, args, callback);
    }
}
