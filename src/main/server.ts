import { MongoHelper } from '../db/mongodb/helpers/mongo-helper';
import env from './env';

MongoHelper.connect(env.mongoUrl)
.then(async () => {
    const app = (await import('./config/app')).default
    app.listen(3000, () => console.log('Server running on http://localhost:3000'))
  })
  .catch(console.error)