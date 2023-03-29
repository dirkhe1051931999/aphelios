import { RouteRecordRaw } from 'vue-router';
import Layout from 'src/layouts/index.vue';
import { markRaw, shallowRef } from 'vue';
import setting from 'src/setting.json';
import { PermissionModule } from 'src/store/modules/permission';
import globalMessage from 'src/utils/notify';
import { UserModule } from 'src/store/modules/user';
import { sleep } from 'src/utils/tools';
/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      如果设置为“ noredirect”，则在单击面包屑时将不会触发任何重定向操作
  meta: {
    pagePermissionId              页面权限的id, -1就是管理员才有的权限  只有一级的写父级，有多级都要写，不填的就是不限制权限
    title: 'title'               子菜单和面包屑中显示的名称（推荐设置）
    icon: 'icon-name'             侧栏中显示的图标
    hidden: true                 if true, 此路由不会显示在侧边栏中（默认为false）
    breadcrumb: false            if false, 该项目将隐藏在面包屑中（默认为true）
    affix: true                  if true, 标签将粘贴在标签视图中
  }
*/
function redirect(to: any): any {
  const routes = PermissionModule.routes;
  const item: any = routes.find((item: any) => item.meta && item.path && item.component && item.name !== 'Login');
  if (!item || (item && !item.children.length)) {
    globalMessage.show({
      type: 'error',
      content: `当前账号：${UserModule.username} 权限异常`,
    });
    UserModule.ResetToken();
    return '/login';
  } else {
    return `${item.path}${item.children[0].path ? `/${item.children[0].path}` : ''}`;
  }
}
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ 'src/pages/login/index.vue'),
    meta: { hidden: true },
  },
];
/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: shallowRef(Layout),
    name: 'Dashboard0',
    meta: {
      pagePermissionId: ['dashboard'],
    },
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "dashboard" */ 'src/pages/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'home',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/account',
    component: shallowRef(Layout),
    name: 'Account0',
    meta: {
      pagePermissionId: ['account'],
    },
    children: [
      {
        path: '',
        name: 'Account',
        meta: {
          title: 'account',
          icon: 'people',
        },
        component: () => import(/* webpackChunkName: "account" */ 'pages/account/index.vue'),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    redirect: redirect,
  },
];
