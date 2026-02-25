import type {Config} from '@docusaurus/types';

const config: Config = {
  title: 'رمز - لغة برمجة عربية للأطفال',
  tagline: 'تعلم البرمجة بالعربية بطريقة ممتعة وسهلة',
  favicon: 'img/favicon.ico',

  url: 'http://localhost:3000',
  baseUrl: '/',

  organizationName: 'LaamiriOuail',
  projectName: 'Ramz',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ar',
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
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

export default config;
