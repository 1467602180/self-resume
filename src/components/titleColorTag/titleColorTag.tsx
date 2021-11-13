import { FC } from 'react';

/**
 *  标题头，左边有个紫色色块
 **/
const TitleColorTag: FC = (props) => {
  return (
    <div className={'flex space-x-1 items-center mb-2'}>
      <div
        style={{
          background: '#4b0cff',
        }}
        className={'h-4 w-2 rounded-md'}
      />
      <span className={'text-base font-medium'}>{props.children}</span>
    </div>
  );
};

export default TitleColorTag;
