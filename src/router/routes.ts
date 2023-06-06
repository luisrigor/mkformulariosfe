import { RouteRecordRaw } from 'vue-router';
import Routes,
{
  HomePage
} from '../shared/constants/Routes'

const HomePageC = () => import('../pages/home/HomePage.vue')

const ErrorPageC = () => import('../pages/error/ErrorPage.vue')

const routes: RouteRecordRaw[] = [
  {
    path: Routes.HOME_PAGE,
    name: HomePage,
    component: HomePageC
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: ErrorPageC
  }
];

export default routes;
