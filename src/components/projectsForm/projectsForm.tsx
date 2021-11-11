import { useMemo } from 'react';
import { createForm, onFormValuesChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { ArrayCards, ArrayItems, FormItem, FormLayout, Input, Select, Space } from '@formily/next';
import store from '@/store';
import { Typography } from '@alifd/next';

const ProjectsForm = () => {
  const [{ projects }, resumeDispatch] = store.useModel('resume');
  const form = useMemo(
    () =>
      createForm({
        initialValues: {
          projects,
        },
        effects() {
          onFormValuesChange((form1) => {
            resumeDispatch.updateProjects(form1.getFieldState('projects').value);
          });
        },
      }),
    [projects, resumeDispatch],
  );
  const SchemaField = useMemo(
    () =>
      createSchemaField({
        components: {
          ArrayCards,
          FormItem,
          Input,
          ArrayItems,
          Space,
          Select,
          FormLayout,
        },
      }),
    [],
  );
  return (
    <div className={'p-4'}>
      <FormProvider form={form}>
        <SchemaField>
          <SchemaField.Array
            name={'projects'}
            x-decorator={'FormItem'}
            x-component={'ArrayCards'}
            x-component-props={{
              title: '项目经历',
            }}
          >
            <SchemaField.Object>
              <SchemaField.Void
                x-component={'FormLayout'}
                x-component-props={{
                  layout: 'vertical',
                }}
              >
                <SchemaField.String
                  title={'项目名称'}
                  name={'name'}
                  required
                  x-decorator={'FormItem'}
                  x-component={'Input'}
                />
                <SchemaField.String
                  title={'项目介绍'}
                  name={'introduce'}
                  required
                  x-decorator={'FormItem'}
                  x-component={'Input.TextArea'}
                  x-component-props={{
                    autoHeight: true,
                  }}
                />
                <SchemaField.Array title={'标签'} name={'tags'} x-decorator={'FormItem'} x-component={'ArrayItems'}>
                  <SchemaField.Object>
                    <SchemaField.Void
                      x-component={'Space'}
                      x-component-props={{
                        wrap: true,
                        align: 'center',
                      }}
                    >
                      <SchemaField.Void x-component={'ArrayItems.SortHandle'} />
                      <SchemaField.String
                        name={'name'}
                        required
                        x-component={'Input'}
                        x-component-props={{
                          innerBefore: <Typography.Text className={'ml-2'}>标签名：</Typography.Text>,
                        }}
                      />
                      <SchemaField.String
                        name={'color'}
                        required
                        x-component={'Select'}
                        x-component-props={{
                          label: '标签颜色：',
                        }}
                        enum={[
                          {
                            label: '蓝色',
                            value: 'blue',
                          },
                          {
                            label: '绿色',
                            value: 'green',
                          },
                          {
                            label: '橙色',
                            value: 'orange',
                          },
                          {
                            label: '红色',
                            value: 'red',
                          },
                          {
                            label: '蓝绿色',
                            value: 'turquoise',
                          },
                          {
                            label: '黄色',
                            value: 'yellow',
                          },
                        ]}
                      />
                      <SchemaField.Void x-component={'ArrayItems.Remove'} />
                    </SchemaField.Void>
                  </SchemaField.Object>
                  <SchemaField.Void x-component={'ArrayItems.Addition'} title={'添加标签'} />
                </SchemaField.Array>
                <SchemaField.Array
                  title={'项目描述'}
                  name={'lists'}
                  x-decorator={'FormItem'}
                  x-component={'ArrayItems'}
                >
                  <SchemaField.Void
                    x-component={'Space'}
                    x-component-props={{
                      wrap: true,
                    }}
                  >
                    <SchemaField.Void x-component={'ArrayItems.SortHandle'} />
                    <SchemaField.String
                      x-component={'Input.TextArea'}
                      required
                      x-component-props={{
                        autoHeight: true,
                      }}
                    />
                    <SchemaField.Void x-component={'ArrayItems.Remove'} />
                  </SchemaField.Void>
                  <SchemaField.Void x-component={'ArrayItems.Addition'} title={'添加描述'} />
                </SchemaField.Array>
              </SchemaField.Void>
              <SchemaField.Void x-component="ArrayCards.Remove" />
              <SchemaField.Void x-component="ArrayCards.MoveUp" />
              <SchemaField.Void x-component="ArrayCards.MoveDown" />
            </SchemaField.Object>
            <SchemaField.Void title={'添加项目'} x-component={'ArrayCards.Addition'} />
          </SchemaField.Array>
        </SchemaField>
      </FormProvider>
    </div>
  );
};

export default ProjectsForm;
