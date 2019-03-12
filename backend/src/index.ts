import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { Container } from 'typedi';
import { createConnection, useContainer as ormUseContainer } from 'typeorm';
import { createKoaServer, useContainer as routingUseContainer } from 'routing-controllers';

const cors = require('@koa/cors');

dotenv.load();

ormUseContainer(Container);
routingUseContainer(Container);

(async () => {
  try {
    process.title = process.env.PROCESS_TITLE || 'Default CMS Server title';

    await createConnection();

    const app = createKoaServer({
      routePrefix: '/api',
      development: process.env.NODE_ENV === 'development',
      controllers: [`${__dirname}/controllers/*.js`]
    });

    app.listen(process.env.PORT, () => console.log(`Server running on localhost:${process.env.PORT}`));
    app.use(cors());

    // cron.schedule('* * * * *', async () => {
    //   const cron = new scrapePage();
    //   await cron.scrapePage();
    // });

  } catch (e) {
    console.log(e);
  }
})();
