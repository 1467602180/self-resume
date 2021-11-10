import store from '@/store';
import { Field, Form, Input } from '@alifd/next';

const SelfIntroduceForm = () => {
  const [{ selfIntroduce }, resumeDispatch] = store.useModel('resume');
  const field = Field.useField({
    onChange: (name, value) => {
      resumeDispatch.updateSelfIntroduce(value);
    },
  });
  return (
    <div className={'p-4'}>
      <Form field={field}>
        <Form.Item label={'自我介绍'} name={'selfIntroduce'}>
          <Input.TextArea defaultValue={selfIntroduce} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default SelfIntroduceForm;
