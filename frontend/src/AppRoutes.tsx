import { Route, Routes } from 'react-router-dom';
import { routes } from './routeConstants';

const AppRoutes = () => {
  return (
    <Routes>
      {routes.map((route, index) => {
        return <Route key={index} {...route} />;
      })}
    </Routes>
  );
};

export default AppRoutes;
