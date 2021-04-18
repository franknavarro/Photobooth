import { FC } from 'react';
import FlexBox, { FlexBoxProps } from './FlexBox';
import Text, { TextProps } from './Text';

interface FlexTextProps extends FlexBoxProps {
  textProps?: TextProps;
}

const FlexText: FC<FlexTextProps> = ({ textProps, children, ...props }) => {
  return (
    <FlexBox {...props}>
      <Text {...textProps}>{children}</Text>
    </FlexBox>
  );
};

export default FlexText;
