// backend/src/utils/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtmlContent(html: string): string {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul',
            'ol', 'li', 'b', 'i', 'strong', 'em', 'strike', 'br', 'img', 'span',
            'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'pre', 'code'
        ],
        ALLOWED_ATTR: [
            'href', 'name', 'target', 'rel', 'src', 'alt', 'width', 'height',
            'class', 'style', 'title'
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    });
}