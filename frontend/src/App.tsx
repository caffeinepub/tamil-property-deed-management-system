import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import PartyManagement from './pages/PartyManagement';
import LocationManagement from './pages/LocationManagement';
import SaleDeedForm from './pages/SaleDeedForm';
import AgreementDeedForm from './pages/AgreementDeedForm';
import Drafts from './pages/Drafts';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });
const partiesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/parties', component: PartyManagement });
const locationsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/locations', component: LocationManagement });
const saleDeedRoute = createRoute({ getParentRoute: () => rootRoute, path: '/sale-deed', component: SaleDeedForm });
const agreementDeedRoute = createRoute({ getParentRoute: () => rootRoute, path: '/agreement-deed', component: AgreementDeedForm });
const draftsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/drafts', component: Drafts });

const routeTree = rootRoute.addChildren([
  indexRoute,
  partiesRoute,
  locationsRoute,
  saleDeedRoute,
  agreementDeedRoute,
  draftsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
