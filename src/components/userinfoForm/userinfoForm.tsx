import store from '@/store';
import { createForm, onFormValuesChange } from '@formily/core';
import { useMemo } from 'react';
import { createSchemaField, FormProvider } from '@formily/react';
import { FormItem, FormLayout, Input } from '@formily/next';

const UserinfoForm = () => {
  const [{ userinfo }, resumeDispatch] = store.useModel('resume');
  const form = useMemo(
    () =>
      createForm({
        initialValues: {
          ...userinfo,
        },
        effects() {
          onFormValuesChange((form1) => {
            resumeDispatch.updateUserinfo(form1.values);
          });
        },
      }),
    [userinfo, resumeDispatch],
  );
  const SchemaField = useMemo(
    () =>
      createSchemaField({
        components: {
          Input,
          FormLayout,
          FormItem,
        },
      }),
    [],
  );
  return (
    <div className={'p-4'}>
      <FormProvider form={form}>
        <SchemaField>
          <SchemaField.Void
            x-component={'FormLayout'}
            x-component-props={{
              layout: 'vertical',
            }}
          >
            <SchemaField.String
              title={'头像'}
              name={'avatar'}
              required
              x-decorator={'FormItem'}
              x-component={'Input'}
            />
            <SchemaField.String
              title={'名称'}
              name={'nickname'}
              required
              x-decorator={'FormItem'}
              x-component={'Input'}
            />
            <SchemaField.String
              title={'意向岗位'}
              name={'intentionJob'}
              required
              x-decorator={'FormItem'}
              x-component={'Input'}
            />
            <SchemaField.String title={'手机'} name={'phone'} required x-decorator={'FormItem'} x-component={'Input'} />
            <SchemaField.String title={'邮箱'} name={'mail'} required x-decorator={'FormItem'} x-component={'Input'} />
            <SchemaField.String title={'QQ'} name={'qq'} required x-decorator={'FormItem'} x-component={'Input'} />
            <SchemaField.String
              title={'微信'}
              name={'wechat'}
              required
              x-decorator={'FormItem'}
              x-component={'Input'}
            />
          </SchemaField.Void>
        </SchemaField>
      </FormProvider>
    </div>
  );
};

export default UserinfoForm;
