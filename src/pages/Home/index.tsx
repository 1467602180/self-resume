import { Button } from '@alifd/next';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min';

const Home = () => {
  return (
    <>
      <div className={'flex justify-center'}>
        <div className={'h-screen overflow-y-auto w-screen md:w-1/3 shadow-2xl'}>
          <div id={'self-resume'}>
            <div className={'h-56 bg-gray-900 flex'}>
              <div className={'px-10 flex flex-col justify-center items-center space-y-2'}>
                <img src={'/avatar.png'} alt={'avatar'} className={'w-24 h-24 rounded-full'} />
                <span className={'text-gray-50 text-base'}>怎么学都学不会的何同学</span>
                <span className={'text-gray-50 text-sm'}>意向岗位：前端开发工程师</span>
              </div>
              <div className={'flex-1 flex flex-col justify-center items-end pr-6'}>
                <div className={'space-y-2'}>
                  <div className={'flex items-center'}>
                    <span className={'text-gray-50 w-10'}>手机：</span>
                    <span className={'text-gray-50'}>13243737707</span>
                  </div>
                  <div className={'flex items-center'}>
                    <span className={'text-gray-50 w-10'}>邮箱：</span>
                    <span className={'text-gray-50'}>1467602180@qq.com</span>
                  </div>
                  <div className={'flex items-center'}>
                    <span className={'text-gray-50 w-10'}>QQ：</span>
                    <span className={'text-gray-50'}>1467602180</span>
                  </div>
                  <div className={'flex items-center'}>
                    <span className={'text-gray-50 w-10'}>微信：</span>
                    <span className={'text-gray-50'}>he1467602180</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={'fixed top-2 right-2'}>
        <Button
          type={'primary'}
          onClick={() => {
            html2pdf(document.getElementById('self-resume'), {
              filename: '简历.pdf',
            });
          }}
        >
          导出简历
        </Button>
      </div>
    </>
  );
};

export default Home;
