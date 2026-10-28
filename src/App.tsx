import { useRoutes } from 'react-router-dom';
import { appRoutes } from './routes';

/** Renders the page for the current URL using the central route table. */
export default function App() {
  return useRoutes(appRoutes);
}
