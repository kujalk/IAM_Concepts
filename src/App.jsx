import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import ScrollToTop from './components/ScrollToTop';
import pagesConfig from './pagesConfig';

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          {pagesConfig.map((page) => (
            <Route
              key={page.id}
              path={page.path}
              element={<page.component />}
            />
          ))}
        </Route>
      </Routes>
    </HashRouter>
  );
}
