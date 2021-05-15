import { FC, RefObject } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';

export const drawerWidth = 175;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  listItem: {
    padding: `0 ${theme.spacing(3)}px`,
    width: 'auto',
  },
  list: {
    margin: 0,
    padding: 0,
    paddingTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
  },
  listIcon: {
    minWidth: 0,
  },
  listText: {
    margin: 0,
  },
}));

interface SettingsNavigationProps {
  list: Array<{
    name: string;
    ref: RefObject<HTMLDivElement>;
  }>;
}

const SettingsNavigation: FC<SettingsNavigationProps> = ({ list }) => {
  const classes = useStyles();

  const scrollToRef = (scrollRef: RefObject<HTMLDivElement>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <div className={classes.list}>
          {list.map(({ name, ref }) => (
            <ListItem
              button
              key={name}
              className={classes.listItem}
              onClick={() => scrollToRef(ref)}
            >
              <ListItemIcon className={classes.listIcon}>
                {' '}
                <ChevronRightIcon />{' '}
              </ListItemIcon>
              <ListItemText primary={name} className={classes.listText} />
            </ListItem>
          ))}
        </div>
      </div>
    </Drawer>
  );
};

export default SettingsNavigation;
