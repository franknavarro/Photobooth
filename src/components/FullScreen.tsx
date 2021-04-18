import React, { FC, HTMLAttributes } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },
});

const FullScreen: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const classes = useStyles();
  return (
    <div className={`${classes.root} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export default FullScreen;
