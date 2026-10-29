import {handlers} from '../analytics/handlers.mjs';
export default req=>handlers().open(req);
export const config={path:'/api/analytics/open',rateLimit:{windowLimit:30,windowSize:60,aggregateBy:['ip','domain']}};
