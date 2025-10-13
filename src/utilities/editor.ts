import { decode } from 'he';
export const bakeEditorHtml = (html: string) => {
  const result = html.replace(/(<img[^>]*src=")[^"]*fileId=([^"&]+)([^"]*)"/g, '$1$2"');

  return result;
};

export function htmlToPlain(html?: string): string {
  if (!html) return '';

  return decode(
    html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}
