import { Hono } from 'hono';
import { handle } from 'hono/vercel';

// import plaid from "./plaid";
// import accounts from './accounts';
import categories from './categories';
import cogLocations from './coglocations';
import customers from './customers';
import assetsConstraints from './assetsconstraints';
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
import customConstraints from './customconstraints';
import linearRanges from './linearranges';
import indicatorConstraints from './indicatorconstraints';
import objectiveMembers from './objectivemembers';
import unitconversions from './unitconversions'
import processingcosts from './processingcost'
import boms from './boms';
import cashAccounts from './cashaccounts';
import facilityExpenses from './facilityexpenses';
import salesbatches from './salesbatches';
import co2Emissions from './co2facilities';
import co2Processings from './co2processings';
import bomComponents from './bomcomponents';
import locationGroups from './locationgroups';
import demandForecasts from './demandforecasts';
import paymentTerms from './paymentterms';
import vehicleSelections from './vehicleselections';
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
  .route('/assetsconstraints', assetsConstraints)
  .route('/customconstraints', customConstraints)
  .route('/linearranges', linearRanges)
  .route('/indicatorconstraints', indicatorConstraints)
  .route('/objectivemembers', objectiveMembers)
  .route('/unitconversions', unitconversions)
  .route('/processingcosts', processingcosts)
  .route('/boms', boms)
  .route('/cashaccounts', cashAccounts)
  .route('/facilityexpenses', facilityExpenses)
  .route('/salesbatches', salesbatches)
  .route('/bomcomponents', bomComponents)
  .route('/co2facilities', co2Emissions)
  .route('/co2processings', co2Processings)
  .route('/demandforecasts', demandForecasts)
  .route('/locationgroups', locationGroups)
  .route('/paymentterms', paymentTerms)
  .route('/vehicleselections', vehicleSelections);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;