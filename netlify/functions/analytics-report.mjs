import {handlers} from '../analytics/handlers.mjs';
export default req=>handlers().report(req);
export const config={path:'/api/analytics/report',rateLimit:{windowLimit:30,windowSize:60,aggregateBy:['ip','domain']}};
