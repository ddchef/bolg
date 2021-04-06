module.exports = {
  themeConfig: {
    logo: '/logo.png',
    sidebar:{
        '/framework/':[
          '',
          'webpack-dev-server不支持热更新',
          '项目集成husky-lint_staged_commitlint'
        ],
        '/linux/':[
          '',
          'Docker化部署Ghost',
          'Vue-History-模式下nginx配置',
          'github-action自动话部署vuepress',
          '树莓派镜像安装'
        ],
        '/bug/':[
          '',
          'vue嵌套iframe导致回退按钮无效'
        ]
      },
    nav: [
      {
        text: '学习',
        items:[
          {
            text:'前端架构',
            link: '/framework/'
          },
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
    ]
  },
  plugins: [
    '@vuepress/back-to-top',
    '@vuepress/active-header-links',
    '@vuepress/nprogress',
    [
      'vuepress-plugin-comment',
      {
        choosen: 'valine', 
        // options选项中的所有参数，会传给Valine的配置
        options: {
          el: '#valine-vuepress-comment',
          appId: '7s2pPmI2xbVXrjMfFLijceos-MdYXbMMI',
          appKey: 'blkaon0ltRyOv1BsnsKXgsTv',
          path: '<%- frontmatter.to.path %>'
        }
      }
    ]
  ],
  markdown: {
    lineNumbers: true
  },
  title: "神奇的厨房",
  description: "大厨师制作美味佳肴的神秘空间",
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    [
      'script',
      {},
      `var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.defer = true
          hm.src = "https://hm.baidu.com/hm.js?2e7e265eb2344dc6aa19ca81622cd9ac";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();` 
    ]
  ],
  scss: {
    
  },
  dest: './dist'
}