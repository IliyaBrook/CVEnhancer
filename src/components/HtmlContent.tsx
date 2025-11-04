import { Text } from '@react-pdf/renderer';
import { Fragment } from 'react';

interface HtmlContentProps {
  children: string;
}

const HtmlContent = ({ children }: HtmlContentProps) => {
  const parts = children.split(/(<strong>.*?<\/strong>)/g);

  return (
    <Fragment>
      {parts.map((part, index) => {
        const strongMatch = part.match(/<strong>(.*?)<\/strong>/);

        if (strongMatch) {
          return (
            <Text key={index} style={{ fontFamily: 'Helvetica-Bold', fontWeight: 'bold' }}>
              {strongMatch[1]}
            </Text>
          );
        }

        return part ? <Text key={index}>{part}</Text> : null;
      })}
    </Fragment>
  );
};

export default HtmlContent;
