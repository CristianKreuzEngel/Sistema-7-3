const routes = [
  {
      path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } },
      { path: '/products', component: () => import('pages/ProductsPage.vue'), meta: { requiresAuth: true } },
      { path: '/orders', component: () => import('pages/OrderPage.vue'), meta: { requiresAuth: true } },
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },

  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
]

export default routes
