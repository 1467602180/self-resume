import store from '@/store';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { FormItem, FormLayout, Input } from '@formily/next';
import { useMemo } from 'react';

const SelfIntroduceForm = () => {
  const [{ selfIntroduce }, resumeDispatch] = store.useModel('resume');
  const form = useMemo(
    () =>
      createForm({
        initialValues: {
          selfIntroduce,
        },
        effects() {
          onFieldValueChange('selfIntroduce', (state) => {
            resumeDispatch.updateSelfIntroduce(state.value);
          });
        },
      }),
    [selfIntroduce, resumeDispatch],
  );
  const SchemaField = useMemo(
    () =>
      createSchemaField({
        components: {
          Input,
          FormItem,
          FormLayout,
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
              title={'自我介绍'}
              name={'selfIntroduce'}
              x-component={'Input.TextArea'}
              x-decorator={'FormItem'}
              required
            />
          </SchemaField.Void>
        </SchemaField>
      </FormProvider>
    </div>
  );
};

export default SelfIntroduceForm;
