import { Hono } from 'hono';
import { handle } from 'hono/vercel';

// import plaid from "./plaid";
// import accounts from './accounts';
import categories from './categories';
import cogLocations from './coglocations';
import customers from './customers';
import demandByDistances from './demandbydistances';
import demandFulfillments from './demandfulfillments';
import demands from './demands';
import distanceByDemands from './distancebydemands';
import facilities from './facilities';
import groups from './groups';
import locations from './locations';
import periods from './periods';
import productFlows from './productflows';
import products from './products';
import summary from './summary';
import transactions from './transactions';
import units from './units';
import vehicleTypes from './vehicleTypes';

export const runtime = 'nodejs';

const app = new Hono().basePath('/api');

const routes = app
  // .route("/plaid", plaid)
  .route('/summary', summary)
  // .route('/accounts', accounts)
  .route('/categories', categories)
  .route('/transactions', transactions)
  // .route('/subscriptions', subscriptions)
  .route('/customers', customers)
  .route('/locations', locations)
  .route('/products', products)
  .route('/groups', groups)
  .route('/units', units)
  .route('/facilities', facilities)
  .route('/demands', demands)
  .route('/periods', periods)
  .route('/vehicleTypes', vehicleTypes)
  .route('/coglocations', cogLocations)
  .route('/demandbydistances', demandByDistances)
  .route('/distancebydemands', distanceByDemands)
  .route('/productflows', productFlows)
  .route('/demandfulfillments', demandFulfillments)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
