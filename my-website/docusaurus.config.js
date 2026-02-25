// @ts-check
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'رمز - لغة برمجة عربية للأطفال',
  tagline: 'تعلم البرمجة بالعربية بطريقة ممتعة وسهلة',
  favicon: 'img/favicon.ico',

  url: 'http://localhost:3005',
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ar',
    locales: ['ar'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: 'https://github.com/LaamiriOuail/Ramz/edit/main/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'رمز',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'الدروس',
        },
        {
          type: 'doc',
          docId: 'beginner-guide',
          position: 'left',
          label: 'الدليل الشامل',
        },
        {
          type: 'doc',
          docId: 'quick-reference',
          position: 'left',
          label: 'مرجع سريع',
        },
        {
          href: 'https://github.com/LaamiriOuail/Ramz',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `صُنع بـ ❤️ لمساعدة الأطفال على تعلم البرمجة`,
    },
  },
};

module.exports = config;
