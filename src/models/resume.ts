export default {
  state: {
    userinfo: {
      avatar: '/avatar.png',
      nickname: '怎么学都学不会的何同学',
      intentionJob: '前端开发工程师',
      phone: '13243737707',
      mail: '1467602180@qq.com',
      qq: '1467602180',
      wechat: 'he1467602180',
    },
    selfIntroduce:
      '于2020年7月，毕业于中山职业技术学院的信息安全与管理专业，在校期间加入校内大数据双创工作室，学习大数据可视化和数据清洗等技术，为校参与竞赛。获取过省二，国二等竞赛成绩。\n\n' +
      '大二期间，开始自学前端，开发自己的应用程序，涉及了vue，flutter等框架和lua，python，golang等语言，在校内开发了校园宿舍电量可视化，工作室论坛等系统。\n\n' +
      '工作期间，为了迎合项目，自学了react，angular，webpack等技术。\n\n' +
      '总结：我十分勤奋且好学，对技术有追求，对代码有规范，对一切新技术保持着热爱和追求。',
    educationExperience: [
      {
        date: {
          start: '2017-9-1',
          end: '2020-7-1',
        },
        school: '中山职业技术学院',
        education: '大专',
      },
    ],
    projects: [
      {
        name: '共享充电宝运营后台',
        tags: [
          {
            name: 'Vue',
            color: 'blue',
          },
          {
            name: 'React',
            color: 'turquoise',
          },
          {
            name: 'Angular',
            color: 'yellow',
          },
        ],
        introduce:
          '该项目为一套共享充电宝的完整运营后台项目，项目包括了硬件升级，硬件维护，充电宝状态查看，运维派单，订单查看，统计分析和预测等功能，项目包含了公司后台，代理商后台，商户后台和运维后台四大部分，分别用了React,Vue和Angular进行开发维护',
        lists: [
          '基于axios封装了一套用户无感刷新token的请求函数',
          '基于Vue Router实现远程路由及远程菜单',
          '基于Vuex实现远程权限控制',
          '基于React Redux实现远程权限控制',
          '基于Angular Serve实现远程权限控制',
          '使用ssr预渲染优化性能，加快首屏渲染',
          '借助webpack插件使用按需加载，减少打包体积',
        ],
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
    updateEducationExperience(preState, payload) {
      return {
        ...preState,
        educationExperience: payload,
      };
    },
  },
};
