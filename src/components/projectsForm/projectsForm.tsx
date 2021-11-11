import { useMemo } from 'react';
import { createForm, onFormValuesChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { ArrayCards, ArrayItems, FormGrid, FormItem, Input, Select, Space } from '@formily/next';
import store from '@/store';

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
          FormGrid,
          ArrayItems,
          Space,
          Select,
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
              <SchemaField.Void x-component={'ArrayCards.Index'} />
              <SchemaField.String
                title={'项目名称'}
                name={'name'}
                required
                x-decorator={'FormItem'}
                x-component={'Input'}
              />
              <SchemaField.Array title={'标签'} name={'tags'} x-decorator={'FormItem'} x-component={'ArrayItems'}>
                <SchemaField.Object>
                  <SchemaField.Void
                    x-component={'ArrayItems.Item'}
                    x-component-props={{
                      className: 'w-96',
                    }}
                  >
                    <SchemaField.Void x-component={'ArrayItems.SortHandle'} />
                    <SchemaField.String
                      title={'标签名'}
                      name={'name'}
                      required
                      x-component={'Input'}
                      x-decorator={'FormItem'}
                    />
                    <SchemaField.String
                      title={'标签颜色'}
                      name={'color'}
                      required
                      x-component={'Select'}
                      x-decorator={'FormItem'}
                      enum={[
                        {
                          label: 'blue',
                          value: 'blue',
                        },
                        {
                          label: 'green',
                          value: 'green',
                        },
                        {
                          label: 'orange',
                          value: 'orange',
                        },
                        {
                          label: 'red',
                          value: 'red',
                        },
                        {
                          label: 'turquoise',
                          value: 'turquoise',
                        },
                        {
                          label: 'yellow',
                          value: 'yellow',
                        },
                      ]}
                    />
                  </SchemaField.Void>
                </SchemaField.Object>
                <SchemaField.Void x-component={'ArrayItems.Addition'} title={'添加标签'} />
              </SchemaField.Array>
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
