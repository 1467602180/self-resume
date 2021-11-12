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
import { randomString } from '@/utils';
import ProjectsForm from '@/components/projectsForm/projectsForm';
import TitleColorTag from '@/components/titleColorTag/titleColorTag';
import EducationExperienceForm from '@/components/educationExperienceForm/educationExperienceForm';
import { FormDialog, FormItem, FormLayout, Input, Upload } from '@formily/next';
import { useEffect, useMemo, useState } from 'react';
import { createSchemaField, useField } from '@formily/react';
import { StorageType } from '@/types/type';
import moment from 'moment';
import * as localforage from 'localforage';

const JsonFileSelect = () => {
  const field = useField();
  const [file, setFile] = useState<File>();
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
    <Button
      type={'primary'}
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.click();
        input.addEventListener('change', () => {
          if (input.files) {
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
      }}
    >
      选择文件
    </Button>
  );
};

const Home = () => {
  const [{ userinfo, selfIntroduce, projects, educationExperience }, resumeDispatch] = store.useModel('resume');
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
        },
      }),
    [],
  );
  useEffect(() => {
    if (loadDrawerVisible) {
      localforage.getItem('storage').then((value: StorageType[]) => {
        if (value) {
          setStorageState(value);
        }
      });
    }
  }, [loadDrawerVisible]);

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
        <MenuButton label={'更多操作'} type={'secondary'} autoWidth={false}>
          <MenuButton.Item
            key={'save'}
            onClick={() => {
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
            }}
          >
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
          <MenuButton.Item
            key={'export'}
            onClick={async () => {
              const storage = (await localforage.getItem('storage')) as StorageType[];
              if (storage) {
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
            }}
          >
            导出模板数据
          </MenuButton.Item>
          <MenuButton.Item
            key={'exportLocal'}
            onClick={() => {
              const data = {
                userinfo,
                selfIntroduce,
                projects,
                educationExperience,
              };
              const blob = new Blob([JSON.stringify(data)], { type: 'text/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = '简历.json';
              a.click();
              a.remove();
            }}
          >
            导出当前数据
          </MenuButton.Item>
          <MenuButton.Item
            key={'loadTemp'}
            onClick={() => {
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
                      <SchemaField.Array
                        title={'模板json文件'}
                        name={'file'}
                        x-decorator={'FormItem'}
                        required
                        x-component={'JsonFileSelect'}
                      />
                    </SchemaField.Void>
                  </SchemaField>
                ),
              )
                .forConfirm(async (payload, next) => {
                  const file = payload.values.file;
                  console.log(JSON.parse(file));
                })
                .open()
                .then();
            }}
          >
            导入模板数据
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
              <Card free>
                <Card.Header
                  title={item.name}
                  subTitle={item.date}
                  key={item.id}
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
