import { useMemo } from 'react';
import { createForm, onFormValuesChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { ArrayCards, ArrayItems, FormItem, FormLayout, Input, Select, Space } from '@formily/next';
import { Tag, Typography } from '@alifd/next';
import store from '@/store';
import { throttleFunc } from '@/utils';
import CustomDatePicker from '@/components/customDatePicker/customDatePicker';

const JobsForm = () => {
  const [{ jobs }, resumeDispatch] = store.useModel('resume');
  const throttleDispatch = throttleFunc(resumeDispatch.updateJobs, 1000);
  const form = useMemo(
    () =>
      createForm({
        initialValues: {
          jobs,
        },
        effects() {
          onFormValuesChange((form1) => {
            throttleDispatch(form1.getFieldState('jobs').value);
          });
        },
      }),
    [jobs],
  );
  const SchemaField = useMemo(
    () =>
      createSchemaField({
        components: {
          FormItem,
          FormLayout,
          Input,
          Select,
          ArrayCards,
          Space,
          ArrayItems,
          CustomDatePicker,
        },
      }),
    [],
  );
  return (
    <div className={'p-4'}>
      <FormProvider form={form}>
        <SchemaField>
          <SchemaField.Array
            name={'jobs'}
            x-component={'ArrayCards'}
            x-component-props={{
              title: '工作经历',
            }}
          >
            <SchemaField.Object>
              <SchemaField.Void x-component={'ArrayCards.Remove'} />
              <SchemaField.Void x-component={'ArrayCards.MoveUp'} />
              <SchemaField.Void x-component={'ArrayCards.MoveDown'} />
              <SchemaField.Void
                x-component={'FormLayout'}
                x-component-props={{
                  layout: 'vertical',
                }}
              >
                <SchemaField.String
                  title={'公司名称'}
                  name={'name'}
                  x-decorator={'FormItem'}
                  required
                  x-component={'Input'}
                />
                <SchemaField.Object name={'date'}>
                  <SchemaField.String
                    title={'就职时间'}
                    name={'[start,end]'}
                    x-decorator={'FormItem'}
                    required
                    x-component={'CustomDatePicker'}
                  />
                </SchemaField.Object>
                <SchemaField.Array name={'tags'} title={'标签'} x-decorator={'FormItem'} x-component={'ArrayItems'}>
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
                            label: (
                              <Tag size={'small'} color={'blue'} type={'primary'}>
                                <span className={'flex items-center h-full'}>蓝色</span>
                              </Tag>
                            ),
                            value: 'blue',
                          },
                          {
                            label: (
                              <Tag size={'small'} color={'green'} type={'primary'}>
                                <span className={'flex items-center h-full'}>绿色</span>
                              </Tag>
                            ),
                            value: 'green',
                          },
                          {
                            label: (
                              <Tag size={'small'} color={'orange'} type={'primary'}>
                                <span className={'flex items-center h-full'}>橙色</span>
                              </Tag>
                            ),
                            value: 'orange',
                          },
                          {
                            label: (
                              <Tag size={'small'} color={'red'} type={'primary'}>
                                <span className={'flex items-center h-full'}>红色</span>
                              </Tag>
                            ),
                            value: 'red',
                          },
                          {
                            label: (
                              <Tag size={'small'} color={'turquoise'} type={'primary'}>
                                <span className={'flex items-center h-full'}>蓝绿色</span>
                              </Tag>
                            ),
                            value: 'turquoise',
                          },
                          {
                            label: (
                              <Tag size={'small'} color={'yellow'} type={'primary'}>
                                <span className={'flex items-center h-full'}>黄色</span>
                              </Tag>
                            ),
                            value: 'yellow',
                          },
                        ]}
                      />
                      <SchemaField.Void x-component={'ArrayItems.Remove'} />
                    </SchemaField.Void>
                  </SchemaField.Object>
                  <SchemaField.Void x-component={'ArrayItems.Addition'} title={'添加标签'} />
                </SchemaField.Array>
                <SchemaField.String
                  title={'职责描述'}
                  name={'introduce'}
                  required
                  x-decorator={'FormItem'}
                  x-component={'Input.TextArea'}
                  x-component-props={{
                    autoHeight: true,
                  }}
                />
              </SchemaField.Void>
            </SchemaField.Object>
            <SchemaField.Void x-component={'ArrayCards.Addition'} title={'增加工作经历'} />
          </SchemaField.Array>
        </SchemaField>
      </FormProvider>
    </div>
  );
};

export default JobsForm;
