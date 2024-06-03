import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Cookies from 'js-cookie'

const routes: Array<RouteRecordRaw> = [
   {
      path:"",
      redirect: "/home"
   },
   {
    path:"/guide",
    name:"guide",
    component: () => import( /* webpackChunkName: 'Guide' */ "../views/Guide.vue"),
 },
   {
      path:"/login",
      name:"login",
      component: () => import( /* webpackChunkName: 'Login' */ "../views/LogIn.vue"),
   },
   {
    //任意匹配
    path:"/:pathMatch(.*)",
    name:"notfound",
    component: () => import( /* webpackChunkName: 'NotFound' */ "../views/NotFound.vue"),
   },
   {
    path:"/information",
    name:"information",
    component: () => import( /* webpackChunkName: 'Information' */ "../views/Information.vue"),
    meta: { requiresAuth: true }, // 这个路由需要登录权限
 },
   {
      path:"/home",
      name:"home",
      component: () => import( /* webpackChunkName: 'Home' */ "../views/HomePage.vue"),
      meta: { requiresAuth: true }, // 这个路由需要登录权限
   },
   {
      path:"/setting",
      name:"setting",
      component: () => import( /* webpackChunkName: 'Setting' */ "../views/Setting.vue"),
      meta: { requiresAuth: true }, // 这个路由需要登录权限
   },
   {
      path:"/search",
      name:"search",
      component: () => import( /* webpackChunkName: 'Search' */ "../views/Search.vue"),
      meta: { requiresAuth: true }, // 这个路由需要登录权限
   },
   {
    path:"/friends",
    name:"friends",
    component: () => import( /* webpackChunkName: 'Friends' */ "../views/Friends.vue"),
    meta: { requiresAuth: true }, // 这个路由需要登录权限
   },
   {
    path:"/oneMeal/:id/:type/:time",
    name:"oneMeal",
    component: () => import( /* webpackChunkName: 'OneMeal' */ "../views/OneMeal.vue"),
    meta: { requiresAuth: true }, // 这个路由需要登录权限
    props: true, // 允许传参
   },
   {
    path:"/dietRecord/:meal",
    name:"dietRecord",
    component: () => import( /* webpackChunkName: 'DietRecord' */ "../views/DietRecord.vue"),
    props: true,
    meta: { requiresAuth: true }, // 这个路由需要登录权限
   },
   {
    //饮食图片识别页面
    path:"/foodRecognition",
    name:"foodRecognition",
    component: () => import( /* webpackChunkName: 'DietRecognition' */ "../views/FoodRecognition.vue"),
    meta: { requiresAuth: true }, // 这个路由需要登录权限
   },
   {
    // 消息中心
    path:"/message",
    name:"message",
    component: () => import( /* webpackChunkName: 'Message' */ "../views/Message.vue"),
    meta: { requiresAuth: true }, // 这个路由需要登录权限
   }
] 


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
  document.body.style.fontSize = '';
  // 检查 "satoken" cookie 是否存在
  const satoken = Cookies.get('satoken');
  // 检查路由是否需要登录权限
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查用户是否已登录
    if (!satoken) {
      // 如果用户未登录，重定向到登录页面
      next('/login');
    } else {
      next(); // 如果用户已登录，正常跳转
    }
  } else {
    next(); // 如果路由不需要登录权限，正常跳转
  }
});

export default router;
