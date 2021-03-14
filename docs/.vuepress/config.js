module.exports = {
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
      },
      {
        text: '工具',
        items: [
          {
            text:'代码比对工具',
            link: 'http://diff.xjie.me/'
          },
          {
            text:'水印工具',
            link: 'http://watermark.xjie.me/'
          }
        ]
      },
      {
        text: 'GitHub',
        link: 'https://github.com/ddchef/bolg'
      }
    ],
    sidebar:{
        '/linux/':[
          '',
          'Docker化部署Ghost',
          'Vue-History-模式下nginx配置',
          'github-action自动话部署vuepress'
        ],
        '/bug/':[
          ''
        ]
      }
  },
  plugins: [
    '@vuepress/back-to-top',
    '@vuepress/active-header-links',
    '@vuepress/nprogress'
  ],
  markdown: {
    lineNumbers: true
  },
  title: "神奇的厨房",
  description: "大厨师制作美味佳肴的神秘空间",
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  dest: './dist'
}