import {handlers} from '../analytics/handlers.mjs';
export default req=>handlers().counter(req);
export const config={path:'/api/analytics/counter',rateLimit:{windowLimit:60,windowSize:60,aggregateBy:['ip','domain']}};
