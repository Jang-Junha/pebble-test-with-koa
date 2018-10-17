const bcrypt = require("bcrypt");

module.exports = async (ctx, next) => {
    if(!ctx.request.body.email || !ctx.request.body.name || !ctx.request.body.password) {
        throw new Error(400);
    }
    try {
        await ctx.collection.insertOne({
            email: ctx.request.body.email,
            name: ctx.request.body.name,
            password: await bcrypt.hash(ctx.request.body.password, 10)
        });
    } catch(e) {
        if(e.name === "MongoError" && e.code === 11000) {
            e.message = {
                status: 409,
                msg: "Email already exists"
            };
        }

        throw e;
    }
    ctx.body.status = "success";
    await next();
};
