import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

function ButtonAppBar(props) {
  const { classes, onSignOut } = props;
  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        color='secondary'
      >
        <Toolbar>
          <Typography
            variant="title"
            color="inherit"
            className={classes.grow}
          >
            e-Blood-Bank
          </Typography>
          <Button
            color="inherit"
            onClick={onSignOut}
            size='large'
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ButtonAppBar);