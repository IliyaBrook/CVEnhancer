import parse, { HTMLReactParserOptions } from 'html-react-parser';
import DOMPurify from 'dompurify';
import { JSX } from 'react';

interface HtmlContentProps {
  html: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  parserOptions?: HTMLReactParserOptions;
}

const HtmlContent = ({ html, className, as: Component = 'div', parserOptions }: HtmlContentProps) => {
  const cleanHtml = DOMPurify.sanitize(html, {
    RETURN_TRUSTED_TYPE: false,
    USE_PROFILES: { html: true },
  }) as string;

  return <Component className={className}>{parse(cleanHtml, parserOptions)}</Component>;
};

export default HtmlContent;
