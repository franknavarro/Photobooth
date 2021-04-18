import { FC, HTMLAttributes } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  flexBox: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export type FlexBoxProps = HTMLAttributes<HTMLDivElement>;

const FlexBox: FC<FlexBoxProps> = ({ children, className, ...props }) => {
  const classes = useStyles();
  return (
    <div className={`${classes.flexBox} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export default FlexBox;
