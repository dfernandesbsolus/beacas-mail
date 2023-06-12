import { map, isEmpty } from 'lodash';

export default function buildMediaQueriesTags(
  breakpoint: string,
  mediaQueries: Record<string, string> = {},
) {
  if (isEmpty(mediaQueries)) {
    return '';
  }

  const baseMediaQueries = map(
    mediaQueries,
    (mediaQuery, className) => `.${className} ${mediaQuery}`,
  );

  return `@media only screen and (min-width:${breakpoint}) {  ${baseMediaQueries.join(
    '\n',
  )} }`;
}
