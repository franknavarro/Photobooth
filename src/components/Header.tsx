import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

interface HeaderProps extends Omit<TypographyProps, 'variant'> {
  top?: boolean;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: '#545454',
    padding: `${theme.spacing()}px ${theme.spacing(2)}px`,
    margin: `0 0 ${theme.spacing(2)}px 0`,
  },
  topSpacing: {
    marginTop: theme.spacing(4),
  },
}));

const Header: FC<HeaderProps> = ({ children, top = false, ...props }) => {
  const classes = useStyles();
  return (
    <Paper
      className={clsx(classes.paper, {
        [classes.topSpacing]: !top,
      })}
    >
      <Typography variant="h5" {...props}>
        {children}
      </Typography>
    </Paper>
  );
};

export default Header;
