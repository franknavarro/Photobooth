import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  flexBox: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const FlexBox = ({ children, className, ...props }) => {
  const classes = useStyles();
  return (
    <div className={`${classes.flexBox} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export default FlexBox;
