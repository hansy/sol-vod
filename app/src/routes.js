export default [
  {
      name: 'Home',
      path: '/',
      component: require('@/components/Page/Home').default,
  },
  {
      name: 'Library',
      path: '/library',
      component: require('@/components/Page/Library').default,
  },
  {
      name: 'Upload',
      path: '/upload',
      component: require('@/components/Page/Upload').default,
  },
  // {
  //     name: 'Profile',
  //     path: '/profile',
  //     component: require('@/components/PageProfile').default,
  // },
  // {
  //     name: 'Tweet',
  //     path: '/tweet/:tweet',
  //     component: require('@/components/PageTweet').default,
  // },
  {
      name: 'NotFound',
      path: '/:pathMatch(.*)*',
      component: require('@/components/PageNotFound').default,
  },
]
