import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

const useStyles = makeStyles({
  text: {
    userSelect: 'none',
    textAlign: 'center',
  },
});

const DEFAULT_TEXT = 'h2';

export type TextProps = TypographyProps;

const Text: FC<TextProps> = ({ children, className, ...props }) => {
  const classes = useStyles();
  const textProps: TextProps = {
    variant: DEFAULT_TEXT,
    className: `${classes.text} ${className || ''}`,
    ...props,
  };
  return <Typography {...textProps}>{children}</Typography>;
};

export default Text;
