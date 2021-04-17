import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  text: {
    userSelect: 'none',
    textAlign: 'center',
  },
});

const DEFAULT_TEXT = 'h2';

const Text = ({ children, className, ...props }) => {
  const classes = useStyles();
  const textProps = {
    variant: DEFAULT_TEXT,
    component: DEFAULT_TEXT,
    className: `${classes.text} ${className || ''}`,
    ...props,
  };
  return <Typography {...textProps}>{children}</Typography>;
};

export default Text;
