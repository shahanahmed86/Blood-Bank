//React Component
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Material-UI
import { withStyles } from '@material-ui/core/styles';

//Firebase
import * as firebase from 'firebase';

//Custom Component
import PrimarySearchAppBar from '../containers/appbar';

class Dashboard extends Component {
    state = {
        profile: {},
        uid: this.props.location.state,
    }
    componentDidMount() {
        if (Boolean(this.state.uid)) {
            firebase.database().ref().child(this.state.uid).child('profile').on('value', snapshot => {
                const profile = snapshot.val();
                this.setState({
                    profile,
                    displayName: `${profile.firstName} ${profile.lastName}`,
                });
            })
        }
        else {
            this.props.history.replace('/');
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <PrimarySearchAppBar
                    displayName={this.state.displayName}
                />
            </div>
        );
    }
}

const style = theme => ({
    container: {
        width: '95%',
        margin: 'auto',
        overflow: 'auto',
    }
});

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(style)(Dashboard);