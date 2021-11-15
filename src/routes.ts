import { IRouterConfig } from 'ice';
import Home from '@/pages/Home';
import Layouts from '@/layouts';

const routerConfig: IRouterConfig[] = [
  {
    path: '/',
    component: Layouts,
    children: [
      {
        path: '/',
        component: Home,
      },
    ],
  },
];

export default routerConfig;
