import {handlers} from '../analytics/handlers.mjs';
export default req=>handlers().owner(req);
export const config={path:['/analytics','/analytics/login','/analytics/logout'],rateLimit:{windowLimit:12,windowSize:60,aggregateBy:['ip','domain']}};
