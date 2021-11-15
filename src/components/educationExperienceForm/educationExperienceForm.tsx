import { useMemo } from 'react';
import { createForm, onFormValuesChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { ArrayCards, FormItem, FormLayout, Input, Space } from '@formily/next';
import store from '@/store';
import { throttleFunc } from '@/utils';
import CustomDatePicker from '../customDatePicker/customDatePicker';

const EducationExperienceForm = () => {
  const [{ educationExperience }, resumeDispatch] = store.useModel('resume');
  const throttleResumeDispatch = throttleFunc(resumeDispatch.updateEducationExperience, 1000);
  const form = useMemo(
    () =>
      createForm({
        effects() {
          onFormValuesChange((form1) => {
            throttleResumeDispatch(form1.getFieldState('educationExperience').value);
          });
        },
        initialValues: {
          educationExperience,
        },
      }),
    [educationExperience, resumeDispatch],
  );
  const SchemaField = useMemo(
    () =>
      createSchemaField({
        components: {
          ArrayCards,
          FormItem,
          Input,
          Space,
          FormLayout,
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
            name={'educationExperience'}
            x-decorator={'FormItem'}
            x-component={'ArrayCards'}
            x-component-props={{
              title: '教育经历',
            }}
          >
            <SchemaField.Object>
              <SchemaField.Void x-component={'ArrayCards.Remove'} />
              <SchemaField.Void x-component={'ArrayCards.MoveUp'} />
              <SchemaField.Void x-component={'ArrayCards.MoveDown'} />
              <SchemaField.String
                title={'学校名称'}
                name={'school'}
                x-decorator={'FormItem'}
                x-component={'Input'}
                required
              />
              <SchemaField.String
                title={'学历'}
                name={'education'}
                x-decorator={'FormItem'}
                x-component={'Input'}
                required
              />
              <SchemaField.Object name={'date'}>
                <SchemaField.String
                  title={'就读时间'}
                  name={'[start,end]'}
                  x-decorator={'FormItem'}
                  x-component={'CustomDatePicker'}
                />
              </SchemaField.Object>
            </SchemaField.Object>
            <SchemaField.Void x-component={'ArrayCards.Addition'} title={'增加教育经历'} />
          </SchemaField.Array>
        </SchemaField>
      </FormProvider>
    </div>
  );
};

export default EducationExperienceForm;
