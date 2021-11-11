export default {
  state: {
    userinfo: {
      avatar: '/avatar.png',
      nickname: 'xxx',
      intentionJob: 'xxx工程师',
      phone: '132xxxxxxxx',
      mail: 'xxxxx@qq.com',
      qq: '146xxxxxxx',
      wechat: 'hexxxxxxx',
    },
    selfIntroduce: 'xxxxxx',
    projects: [
      {
        name: 'xxx项目',
        tags: [
          {
            name: 'xxx',
            color: 'blue',
          },
          {
            name: 'xxx',
            color: 'turquoise',
          },
        ],
        introduce: 'xxx',
        lists: ['xxx', 'xxx'],
      },
    ],
  },
  reducers: {
    updateUserinfo(prevState, payload) {
      return {
        ...prevState,
        userinfo: payload,
      };
    },
    updateSelfIntroduce(preState, payload) {
      return {
        ...preState,
        selfIntroduce: payload,
      };
    },
    updateProjects(preState, payload) {
      return {
        ...preState,
        projects: payload,
      };
    },
  },
};
