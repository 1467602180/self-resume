import { Field, Form, Input } from '@alifd/next';
import store from '@/store';

const UserinfoForm = () => {
  const [{ userinfo }, resumeDispatch] = store.useModel('resume');
  const field = Field.useField({
    onChange: (name, value) => {
      resumeDispatch.updateUserinfo({ name, value });
    },
  });
  return (
    <div className={'p-4'}>
      <Form field={field}>
        <Form.Item label={'头像'} name={'avatar'}>
          <Input defaultValue={userinfo.avatar} />
        </Form.Item>
        <Form.Item label={'名称'} name={'nickname'}>
          <Input defaultValue={userinfo.nickname} />
        </Form.Item>
        <Form.Item label={'意向岗位'} name={'intentionJob'}>
          <Input defaultValue={userinfo.intentionJob} />
        </Form.Item>
        <Form.Item label={'手机号码'} name={'phone'}>
          <Input defaultValue={userinfo.phone} />
        </Form.Item>
        <Form.Item label={'邮箱'} name={'mail'}>
          <Input defaultValue={userinfo.mail} />
        </Form.Item>
        <Form.Item label={'QQ'} name={'qq'}>
          <Input defaultValue={userinfo.qq} />
        </Form.Item>
        <Form.Item label={'微信'} name={'wechat'}>
          <Input defaultValue={userinfo.wechat} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserinfoForm;
