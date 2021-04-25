import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';

export const drawerWidth = 150;

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

const SettingsNavigation: FC = () => {
  const classes = useStyles();
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
          {['Photostrip', 'Interface', 'Printer'].map((text) => (
            <ListItem button key={text} className={classes.listItem}>
              <ListItemText primary={text} className={classes.listText} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default SettingsNavigation;
