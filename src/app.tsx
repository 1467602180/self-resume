import { IAppConfig, runApp } from 'ice';
import '@alifd/theme-3/dist/next.css';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
  },
};

runApp(appConfig);
