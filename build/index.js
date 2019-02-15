"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
require("reflect-metadata");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const routing_controllers_1 = require("routing-controllers");
dotenv.load();
typeorm_1.useContainer(typedi_1.Container);
routing_controllers_1.useContainer(typedi_1.Container);
(async () => {
    try {
        process.title = process.env.PROCESS_TITLE || 'Default CMS Server title';
        await typeorm_1.createConnection();
        const app = routing_controllers_1.createKoaServer({
            routePrefix: '/api',
            development: process.env.NODE_ENV === 'development',
            controllers: [`${__dirname}/controllers/*.js`]
        });
        app.listen(process.env.PORT, () => console.log(`Server running on localhost:${process.env.PORT}`));
    }
    catch (e) {
        console.log(e);
    }
})();
//# sourceMappingURL=index.js.map