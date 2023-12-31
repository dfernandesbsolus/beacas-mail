import { forEach, map } from 'lodash';

export function buildFontsTags(content: string, inlineStyle: string[], fonts = {}) {
  const toImport: string[] = [];

  forEach(fonts, (url, name) => {
    const regex = new RegExp(`"[^"]*font-family:[^"]*${name}[^"]*"`, 'gmi');
    const inlineRegex = new RegExp(`font-family:[^;}]*${name}`, 'gmi');

    if (content.match(regex) || inlineStyle.some(s => s.match(inlineRegex))) {
      toImport.push(url);
    }
  });

  if (toImport.length > 0) {
    return `
      <!--[if !mso]><!-->
        ${map(
          toImport,
          url => `<link href="${url}" rel="stylesheet" type="text/css">`,
        ).join('\n')}
        <style type="text/css">
          ${map(toImport, url => `@import url(${url});`).join('\n')}
        </style>
      <!--<![endif]-->\n
    `;
  }

  return '';
}
