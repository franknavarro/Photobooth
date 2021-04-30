import { FC, RefObject } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
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
  },
  listItem: {
    padding: `0 ${theme.spacing(3)}px`,
  },
  list: {
    padding: 0,
    paddingTop: theme.spacing(3),
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
        <List className={classes.list}>
          {list.map(({ name, ref }) => (
            <ListItem
              button
              key={name}
              className={classes.listItem}
              onClick={() => scrollToRef(ref)}
            >
              <ListItemText primary={name} className={classes.listText} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default SettingsNavigation;
