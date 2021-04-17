import FlexBox from './FlexBox';
import Text from './Text';

const FlexText = ({ textProps, children, ...props }) => {
  return (
    <FlexBox {...props}>
      <Text {...textProps}>{children}</Text>
    </FlexBox>
  );
};

export default FlexText;
