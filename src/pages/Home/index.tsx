import {
  Box,
  Button,
  Card,
  Dialog,
  Divider,
  Drawer,
  MenuButton,
  Message,
  Tab,
  Tag,
  Timeline,
  Typography,
} from '@alifd/next';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min';
import store from '@/store';
import { useBoolean } from 'ahooks';
import UserinfoForm from '@/components/userinfoForm/userinfoForm';
import SelfIntroduceForm from '@/components/selfIntroduceForm/selfIntroduceForm';
import { compareArray, randomString } from '@/utils';
import ProjectsForm from '@/components/projectsForm/projectsForm';
import TitleColorTag from '@/components/titleColorTag/titleColorTag';
import EducationExperienceForm from '@/components/educationExperienceForm/educationExperienceForm';
import { FormDialog, FormItem, FormLayout, Input, Upload } from '@formily/next';
import { useEffect, useMemo, useState } from 'react';
import { createSchemaField, useField } from '@formily/react';
import { StorageType } from '@/types/type';
import moment from 'moment';
import * as localforage from 'localforage';
import JobsForm from '@/components/jobsForm/jobsForm';

/**
 * 自定义文件选择组件，用于导入数据时读取本地文件
 **/
const JsonFileSelect = () => {
  const field = useField();
  const [file, setFile] = useState<File>();
  /**
   * 调用文件选择器并将本地文件内容传入表单项
   **/
  const fileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.click();
    input.addEventListener('change', () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[input.files.length - 1];
        setFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          field.form.setValues({
            file: reader.result,
          });
        };
        reader.readAsText(file);
      }
    });
    input.remove();
  };
  return file ? (
    <div className={'py-1 px-2 flex items-center space-x-1 bg-gray-100 rounded-md'}>
      <span>{file.name}</span>
      <div className={'flex-1 flex justify-end'}>
        <Button
          size={'small'}
          type={'primary'}
          warning
          onClick={() => {
            setFile(undefined);
            field.form.setValues({
              file: undefined,
            });
          }}
        >
          删除
        </Button>
      </div>
    </div>
  ) : (
    <Button type={'primary'} onClick={fileSelect}>
      选择文件
    </Button>
  );
};

const LoadTempText = () => {
  return <span className={'text-red-500'}>重复的模板数据是不会被导入的哦</span>;
};

const Home = () => {
  const [{ userinfo, selfIntroduce, projects, educationExperience, jobs }, resumeDispatch] = store.useModel('resume');
  const [storageState, setStorageState] = useState<StorageType[]>([]);
  const [drawerVisible, drawerVisibleAction] = useBoolean(false);
  const [loadDrawerVisible, loadDrawerVisibleAction] = useBoolean(false);
  const SchemaField = useMemo(
    () =>
      createSchemaField({
        components: {
          FormItem,
          Input,
          Upload,
          FormLayout,
          JsonFileSelect,
          LoadTempText,
        },
      }),
    [],
  );
  /**
   * 在每次打开加载模板的drawer时重新读取本地数据并刷新状态
   **/
  useEffect(() => {
    if (loadDrawerVisible) {
      localforage.getItem('storage').then((value: StorageType[]) => {
        if (value) {
          setStorageState(value);
        }
      });
    }
  }, [loadDrawerVisible]);

  /**
   *  简历个人信息界面
   **/
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

  /**
   *  右上角操作按钮
   **/
  const ToolButton = () => {
    /**
     *  保存为模板
     **/
    const saveTemp = () => {
      FormDialog(
        {
          title: '保存为模板',
          style: {
            width: 400,
          },
        },
        () => (
          <SchemaField>
            <SchemaField.String
              title={'模板名'}
              name={'name'}
              required
              x-component={'Input'}
              x-decorator={'FormItem'}
            />
          </SchemaField>
        ),
      )
        .forConfirm(async (payload, next) => {
          const storage = ((await localforage.getItem('storage')) as StorageType[]) || [];
          storage.push({
            id: randomString(),
            name: payload.values.name,
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            data: {
              userinfo,
              selfIntroduce,
              projects,
              educationExperience,
              jobs,
            },
          });
          await localforage.setItem('storage', storage);
          next(payload);
        })
        .forCancel((payload, next) => {
          next(payload);
        })
        .open()
        .then();
    };
    /**
     *  导出模板数据
     **/
    const exportTemp = async () => {
      const storage = (await localforage.getItem('storage')) as StorageType[];
      if (storage && storage.length > 0) {
        const blob = new Blob([JSON.stringify(storage)], { type: 'text/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '简历模板.json';
        a.click();
        a.remove();
      } else {
        Message.error({ title: '无模板数据可导出' });
      }
    };
    /**
     *  导出当前数据
     **/
    const exportLocalTemp = () => {
      const data = {
        userinfo,
        selfIntroduce,
        projects,
        educationExperience,
        jobs,
      };
      const blob = new Blob([JSON.stringify(data)], { type: 'text/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '简历.json';
      a.click();
      a.remove();
    };
    /**
     *  导入模板数据
     **/
    const importTemp = () => {
      FormDialog(
        {
          title: '导入模板数据',
          style: {
            width: 300,
          },
        },
        () => (
          <SchemaField>
            <SchemaField.Void
              x-component={'FormLayout'}
              x-component-props={{
                layout: 'vertical',
              }}
            >
              <SchemaField.String
                title={'模板json文件'}
                name={'file'}
                x-decorator={'FormItem'}
                required
                x-component={'JsonFileSelect'}
              />
              <SchemaField.Void x-component={'LoadTempText'} />
            </SchemaField.Void>
          </SchemaField>
        ),
      )
        .forConfirm(async (payload, next) => {
          const file = payload.values.file;
          try {
            const data = JSON.parse(file) as StorageType[];
            if (data && data.length > 0) {
              const checkArray = ['id', 'name', 'date', 'data'];
              let check = true;
              for (const item of data) {
                if (check) {
                  check = compareArray(checkArray, Object.keys(item));
                }
              }
              if (check) {
                const storage = ((await localforage.getItem('storage')) || []) as StorageType[];
                const filterData = data.filter((item) => {
                  return !storage.some((d) => d.id === item.id);
                });
                storage.push(...filterData);
                await localforage.setItem('storage', storage);
                setStorageState(storage);
                Message.success({ title: '导入成功' });
                next(payload);
                return;
              }
            }
          } catch (e) {}
          Message.error({
            title: '导入失败',
          });
        })
        .open()
        .then();
    };
    /**
     *  导入当前数据
     **/
    const importLocalTemp = () => {
      FormDialog(
        {
          title: '导入当前数据',
          style: {
            width: 300,
          },
        },
        () => (
          <SchemaField>
            <SchemaField.Void
              x-component={'FormLayout'}
              x-component-props={{
                layout: 'vertical',
              }}
            >
              <SchemaField.String
                title={'json文件'}
                name={'file'}
                x-decorator={'FormItem'}
                x-component={'JsonFileSelect'}
                required
              />
            </SchemaField.Void>
          </SchemaField>
        ),
      )
        .forConfirm((payload, next) => {
          const file = payload.values.file;
          try {
            const data = JSON.parse(file);
            const checkArray = ['userinfo', 'selfIntroduce', 'projects', 'educationExperience', 'jobs'];
            if (compareArray(checkArray, Object.keys(data))) {
              resumeDispatch.updateAll(data);
              Message.success({ title: '导入成功' });
              next(payload);
              return;
            }
          } catch (e) {}
          Message.error({
            title: '导入失败',
          });
        })
        .open()
        .then();
    };
    /**
     *  导出简历
     **/
    const exportResume = () => {
      html2pdf(document.getElementById('self-resume'), {
        filename: '简历.pdf',
      });
    };
    return (
      <div className={'fixed top-2 right-2 space-x-2'}>
        <MenuButton label={'更多操作'} type={'secondary'} autoWidth={false}>
          <MenuButton.Item key={'save'} onClick={saveTemp}>
            保存为模板
          </MenuButton.Item>
          <MenuButton.Item
            key={'load'}
            onClick={() => {
              loadDrawerVisibleAction.toggle();
            }}
          >
            加载模板
          </MenuButton.Item>
          <MenuButton.Item key={'export'} onClick={exportTemp}>
            导出模板数据
          </MenuButton.Item>
          <MenuButton.Item key={'exportLocal'} onClick={exportLocalTemp}>
            导出当前数据
          </MenuButton.Item>
          <MenuButton.Item key={'loadTemp'} onClick={importTemp}>
            导入模板数据
          </MenuButton.Item>
          <MenuButton.Item key={'loadLocalTemp'} onClick={importLocalTemp}>
            导入当前数据
          </MenuButton.Item>
        </MenuButton>
        <Button
          type={'secondary'}
          onClick={() => {
            drawerVisibleAction.toggle();
          }}
        >
          编辑简历
        </Button>
        <Button type={'primary'} onClick={exportResume}>
          导出简历
        </Button>
      </div>
    );
  };

  /**
   *  教育经历界面
   **/
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

  /**
   *  工作经历界面
   **/
  const Jobs = () => {
    return (
      <div className={'py-2 px-4'}>
        <TitleColorTag>工作经历</TitleColorTag>
        <Timeline>
          {jobs.map((item) => (
            <Timeline.Item
              key={randomString()}
              time={`${item.date?.start} --- ${item.date?.end}`}
              title={
                <div className={'flex items-center space-x-2'}>
                  <span>{item.name}</span>
                  {item.tags?.map((d) => (
                    <Tag color={d.color} type={'primary'} size={'small'} key={randomString()}>
                      {d.name}
                    </Tag>
                  ))}
                </div>
              }
              content={<span className={'whitespace-pre-line'}>职责描述：{item.introduce}</span>}
            />
          ))}
        </Timeline>
      </div>
    );
  };

  /**
   *  项目经历界面
   **/
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
              <div className={'space-y-1'}>
                {item.lists?.map((dd) => (
                  <div className={'flex items-center space-x-2'} key={randomString()}>
                    <div className={'w-1 h-1 rounded-full bg-gray-900'} />
                    <span key={randomString()} className={'font-semibold'}>
                      {dd}
                    </span>
                  </div>
                ))}
              </div>
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
        <div className={'min-h-screen w-screen lg:w-1/3 shadow-2xl'}>
          <div id={'self-resume'}>
            <ResumeUserinfo />
            <div className={'py-2 px-4'}>
              <TitleColorTag>自我介绍</TitleColorTag>
              <Typography.Text strong className={'whitespace-pre-line'}>
                {selfIntroduce}
              </Typography.Text>
            </div>
            <EducationExperience />
            <Jobs />
            <Projects />
          </div>
        </div>
      </div>
      <div className={'pt-4 pb-2 flex justify-center items-center'}>
        <span>
          ©
          <a href="https://github.com/1467602180" target={'_blank'}>
            怎么学都学不会的何同学
          </a>{' '}
          By 2021-11
        </span>
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
          <Tab.Item title={'工作经历'} key={'jobs'}>
            <JobsForm />
          </Tab.Item>
          <Tab.Item title={'项目经历'} key={'projects'}>
            <ProjectsForm />
          </Tab.Item>
        </Tab>
      </Drawer>
      <Drawer
        title={'加载模板'}
        height={500}
        visible={loadDrawerVisible}
        onClose={() => {
          loadDrawerVisibleAction.toggle();
        }}
        placement={'bottom'}
      >
        {storageState.length === 0 ? (
          <div className={'h-20 flex justify-center items-center'}>无模板</div>
        ) : (
          <div className={'grid grid-cols-1 md:grid-cols-3 gap-4'}>
            {storageState.map((item) => (
              <Card free key={item.id}>
                <Card.Header
                  title={item.name}
                  subTitle={item.date}
                  extra={
                    <Box direction={'row'} spacing={20}>
                      <Button
                        type={'primary'}
                        onClick={() => {
                          resumeDispatch.updateAll(item.data);
                          loadDrawerVisibleAction.toggle();
                        }}
                      >
                        使用此模板
                      </Button>
                      <Button
                        type={'primary'}
                        warning
                        onClick={() => {
                          Dialog.confirm({
                            title: '删除提醒',
                            content: '确定删除此模板吗？',
                            onOk: async () => {
                              const storage = (await localforage.getItem('storage')) as StorageType[];
                              if (storage) {
                                await localforage.setItem(
                                  'storage',
                                  storage.filter((d) => d.id !== item.id),
                                );
                                setStorageState((value) => value.filter((d) => d.id !== item.id));
                              }
                            },
                          });
                        }}
                      >
                        删除
                      </Button>
                    </Box>
                  }
                />
              </Card>
            ))}
          </div>
        )}
      </Drawer>
    </>
  );
};

export default Home;
