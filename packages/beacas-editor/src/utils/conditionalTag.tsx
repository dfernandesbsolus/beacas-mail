import React from 'react';

export const startConditionalTag = '<!--[if mso | IE]>';
export const startMsoConditionalTag = '<!--[if mso]>';
export const endConditionalTag = '<![endif]-->';
export const startNegationConditionalTag = '<!--[if !mso | IE]><!-->';
export const startMsoNegationConditionalTag = '<!--[if !mso><!-->';
export const endNegationConditionalTag = '<!--<![endif]-->';

export default function conditionalTag(content: string, negation = false) {
  return `
    ${negation ? startNegationConditionalTag : startConditionalTag}
    ${content}
    ${negation ? endNegationConditionalTag : endConditionalTag}
  `;
}

export function msoConditionalTag(content: React.ReactNode, negation = false) {
  return (
    <>
      {negation ? startMsoNegationConditionalTag : startMsoConditionalTag}
      {content}
      {negation ? endNegationConditionalTag : endConditionalTag}
    </>
  );
}
