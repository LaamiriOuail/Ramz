import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'beginner-guide',
      label: 'الدليل الشامل للمبتدئين',
    },
    {
      type: 'category',
      label: 'الدروس التعليمية',
      items: [
        'tutorial/01-first-steps',
        'tutorial/02-variables',
        'tutorial/03-input-output',
        'tutorial/04-functions',
        'tutorial/05-conditionals',
        'tutorial/06-loops',
        'tutorial/07-types',
        'tutorial/08-operators',
        'tutorial/09-collections',
        'tutorial/10-builtins',
      ],
    },
    {
      type: 'category',
      label: 'أدلة إضافية',
      items: [
        'quick-reference',
        'reference/functions',
      ],
    },
  ],
};

export default sidebars;
