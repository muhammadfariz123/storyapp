import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddPage from '../pages/add/add-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import SavedPage from '../pages/saved/saved-page';
import DetailPage from '../pages/detail/detail-page';

const routes = {
  '/': LoginPage,
  '/register': RegisterPage,
  '/home': HomePage,
  '/about': AboutPage,
  '/add': AddPage,
  '/saved': SavedPage,
  '/detail/:id': DetailPage,
};

export default routes;
