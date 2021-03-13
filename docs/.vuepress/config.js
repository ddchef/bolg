module.exports = {
  title: "神奇的厨房",
  description: "大厨师制作美味佳肴的神秘空间",
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      {
        text: '学习',
        items:[
          {
            text:'linux',
            link: '/linux/'
          }
        ]
      },
      {
        text: '问题',
        items: [
          {
            text:'日常问题',
            link: '/bug/'
          }
        ]
      }
    ],
    sidebar:{
        '/linux/':[
          '',
          'Docker化部署Ghost',
          'Vue-History-模式下nginx配置'
        ],
        '/bug/':[
          ''
        ]
      }
  },
  dest: './dist'
}