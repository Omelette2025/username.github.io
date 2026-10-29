import {handlers} from '../analytics/handlers.mjs';
export default ()=>handlers().retention();
export const config={schedule:'17 3 * * *'};
