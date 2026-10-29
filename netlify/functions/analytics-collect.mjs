import {handlers} from '../analytics/handlers.mjs';
export default req=>handlers().collect(req);
export const config={path:'/api/analytics/events',rateLimit:{windowLimit:60,windowSize:60,aggregateBy:['ip','domain']}};
