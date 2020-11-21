export default [
  {
    name: '图例集合',
    path: '/home',
    component: () => import('@/views/default/home'),
    meta: {
      requiresAuth: true,
      title: '图例集合'
    }
  },
  {
    name: '富文本',
    path: '/rich_text',
    component: () => import('@/views/default/rich'),
    meta: {
      requiresAuth: true,
      title: '富文本'
    }
  },
  {
    path: '/projectRequirement',
    name: 'project_requirement',
    component: () =>
      import('@/views/front/project_requirement/project_requirement'),
    meta: {
      title: '项目需求'
    }
  },
  {
    path: '/itemForm',
    name: 'item_form',
    component: () =>
      import('@/views/front/project_requirement/item_form'),
    meta: {
      title: '项目表单'
    }
  },
  {
    path: '/allShow',
    name: 'all_show',
    component: () =>
      import('@/views/front/project_requirement/all_show'),
    meta: {
      title: '总览'
    }
  },
  {
    path: '/myWork',
    name: 'my_work',
    component: () =>
      import('@/views/front/work_place/my_work'),
    meta: {
      title: '我的任务'
    }
  }
]