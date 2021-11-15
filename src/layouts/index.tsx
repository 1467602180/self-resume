import { FC, useEffect } from 'react';
import { ConfigProvider } from '@alifd/next';
import zhCN from '@alifd/next/lib/locale/zh-cn';
import moment from 'moment';

const Layouts: FC = (props) => {
  useEffect(() => {
    moment.locale('zh-cn');
  }, []);
  return <ConfigProvider locale={zhCN}>{props.children}</ConfigProvider>;
};

export default Layouts;
