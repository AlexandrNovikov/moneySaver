import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import About from '@/components/About';
import AuthorizePage from '@/components/AuthorizePage';
import Profile from '@/components/Profile';
import Users from '@/components/Users';
import UserDetail from '@/components/UserDetail';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/authorize',
      name: 'AuthorizePage',
      component: AuthorizePage,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
    },
    {
      path: '/user-detail/:id',
      name: 'UserDetail',
      component: UserDetail,
      props: true,
    },
  ],
});
