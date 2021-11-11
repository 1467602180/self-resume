import { Button, Divider, Drawer, Tab, Tag, Timeline, Typography } from '@alifd/next';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min';
import store from '@/store';
import { useBoolean } from 'ahooks';
import UserinfoForm from '@/components/userinfoForm/userinfoForm';
import SelfIntroduceForm from '@/components/selfIntroduceForm/selfIntroduceForm';
import { randomString } from '@/utils';
import ProjectsForm from '@/components/projectsForm/projectsForm';
import TitleColorTag from '@/components/titleColorTag/titleColorTag';
import EducationExperienceForm from '@/components/educationExperienceForm/educationExperienceForm';

const Home = () => {
  const [{ userinfo, selfIntroduce, projects, educationExperience }] = store.useModel('resume');
  const [drawerVisible, drawerVisibleAction] = useBoolean(false);

  const ResumeUserinfo = () => {
    return (
      <div className={'h-56 bg-gray-900 flex'}>
        <div className={'px-10 flex flex-col justify-center items-center space-y-2'}>
          <img src={userinfo.avatar} alt={'avatar'} className={'w-24 h-24 rounded-full'} />
          <span className={'text-gray-50 text-base'}>{userinfo.nickname}</span>
          <span className={'text-gray-50 text-sm'}>意向岗位：{userinfo.intentionJob}</span>
        </div>
        <div className={'flex-1 flex flex-col justify-center items-end pr-6'}>
          <div className={'space-y-2'}>
            {userinfo.phone ? (
              <div className={'flex items-center'}>
                <span className={'text-gray-50 w-10'}>手机：</span>
                <span className={'text-gray-50'}>{userinfo.phone}</span>
              </div>
            ) : null}
            {userinfo.mail ? (
              <div className={'flex items-center'}>
                <span className={'text-gray-50 w-10'}>邮箱：</span>
                <span className={'text-gray-50'}>{userinfo.mail}</span>
              </div>
            ) : null}
            {userinfo.qq ? (
              <div className={'flex items-center'}>
                <span className={'text-gray-50 w-10'}>QQ：</span>
                <span className={'text-gray-50'}>{userinfo.qq}</span>
              </div>
            ) : null}
            {userinfo.wechat ? (
              <div className={'flex items-center'}>
                <span className={'text-gray-50 w-10'}>微信：</span>
                <span className={'text-gray-50'}>{userinfo.wechat}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  const ToolButton = () => {
    return (
      <div className={'fixed top-2 right-2 space-x-2'}>
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
        <Button
          type={'secondary'}
          onClick={() => {
            drawerVisibleAction.toggle();
          }}
        >
          编辑简历
        </Button>
      </div>
    );
  };

  const EducationExperience = () => {
    return (
      <div className={'py-2 px-4'}>
        <TitleColorTag>教育经历</TitleColorTag>
        <div>
          <Timeline>
            {educationExperience?.map((item) => (
              <Timeline.Item
                key={randomString()}
                time={`${item.date?.start} --- ${item.date?.end}`}
                title={
                  <div className={'space-x-2 flex items-center'}>
                    <span>{item.school}</span>
                    <Tag size={'small'} type={'primary'} color={'blue'}>
                      {item.education}
                    </Tag>
                  </div>
                }
              />
            ))}
          </Timeline>
        </div>
      </div>
    );
  };

  const Projects = () => {
    return (
      <div className={'py-2 px-4'}>
        <TitleColorTag>项目经历</TitleColorTag>
        <div className={'space-y-4'}>
          {projects.map((item, index) => (
            <div key={randomString()} className={'space-y-2'}>
              <div className={'space-x-2 flex items-center'}>
                <span className={'text-sm'}>
                  {index + 1}.{item.name}
                </span>
                {item.tags?.map((d) => (
                  <Tag key={randomString()} type={'primary'} color={d.color} size={'small'}>
                    {d.name}
                  </Tag>
                ))}
              </div>
              <div className={'h-1'} />
              <span className={'whitespace-pre-line'}>项目介绍：{item.introduce}</span>
              <ul className={'list-disc list-inside'}>
                {item.lists?.map((dd) => (
                  <li key={randomString()} className={'font-semibold'}>
                    {dd}
                  </li>
                ))}
              </ul>
              <Divider />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={'flex justify-center'}>
        <div className={'h-screen overflow-y-auto w-screen lg:w-1/3 shadow-2xl'}>
          <div id={'self-resume'}>
            <ResumeUserinfo />
            <div className={'py-2 px-4'}>
              <TitleColorTag>自我介绍</TitleColorTag>
              <Typography.Text strong className={'whitespace-pre-line'}>
                {selfIntroduce}
              </Typography.Text>
            </div>
            <EducationExperience />
            <Projects />
          </div>
        </div>
      </div>
      <ToolButton />
      <Drawer
        cache
        title={'编辑简历'}
        width={800}
        visible={drawerVisible}
        onClose={() => {
          drawerVisibleAction.toggle();
        }}
      >
        <Tab>
          <Tab.Item title={'个人信息'} key={'userinfo'}>
            <UserinfoForm />
          </Tab.Item>
          <Tab.Item title={'自我介绍'} key={'selfIntroduce'}>
            <SelfIntroduceForm />
          </Tab.Item>
          <Tab.Item title={'教育经历'} key={'educationExperience'}>
            <EducationExperienceForm />
          </Tab.Item>
          <Tab.Item title={'项目经历'} key={'projects'}>
            <ProjectsForm />
          </Tab.Item>
        </Tab>
      </Drawer>
    </>
  );
};

export default Home;
