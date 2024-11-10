const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/home', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } },
      { path: '/products', component: () => import('pages/ProductsPage.vue'), meta: { requiresAuth: true } },
      { path: '/orders', component: () => import('pages/OrderPage.vue'), meta: { requiresAuth: true } },
      { path: '/services', component: () => import('pages/ServicesPage.vue'), meta: { requiresAuth: true } },
      { path: '/requests', component: () => import('pages/RequestPage.vue'), meta: { requiresAuth: true } },
      { path: '/customers', component: () => import('pages/CustomerPage.vue'), meta: { requiresAuth: true } },
    ]
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
