import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { Fragment } from 'react';

const HtmlContent = ({ children }: { children: string }) => {
  const cleanHtml = DOMPurify.sanitize(children, {
    RETURN_TRUSTED_TYPE: false,
    USE_PROFILES: { html: true },
  }) as string;

  return <Fragment>{parse(cleanHtml)}</Fragment>;
};

export default HtmlContent;
