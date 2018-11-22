//React Component
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Material-UI
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';


//Firebase
import * as firebase from 'firebase';

//Custom Component
import PrimarySearchAppBar from '../containers/appbar';
import NativeSelects from '../containers/select';

function Donors(name, bloodType, cell) {
    this.name = name;
    this.bloodType = bloodType;
    this.cell = cell;
}

const donorsList = [
    new Donors('', '', ''),
    new Donors('A', 'A-', '03001111111'),
    new Donors('B', 'A+', '03002222222'),
    new Donors('C', 'B-', '03003333333'),
    new Donors('D', 'B+', '03004444444'),
    new Donors('E', 'AB-', '03003333333'),
    new Donors('F', 'AB+', '03004444444'),
    new Donors('G', 'O+', '03005555555'),
    new Donors('H', 'O-', '03006666666'),
];

class Dashboard extends Component {
    state = {
        profile: {},
        uid: this.props.location.state,
        isLoading: true,
        error: {},
        messageState: false,
        donorsList,
        bloodType: donorsList.map(val => val.bloodType),
        getDonors: [],
    }
    componentDidMount() {
        if (this.state.uid) {
            this.getData();
        }
        else {
            this.props.history.replace('/');
        }
    }

    getData = () => {
        firebase.database().ref().child(this.state.uid).child('profile').on('value', snapshot => {
            const profile = snapshot.val();
            this.setState({
                profile,
                displayName: `${profile.firstName} ${profile.lastName}`,
                isLoading: false,
            });
        })
    }

    onSignOutHandler = () => {
        firebase.auth().signOut()
            .then(() => {
                this.props.history.replace('/');
                this.setState({
                    profile: {},
                    uid: '',
                })
            })
            .catch(error => {
                this.setState({
                    error,
                    messageState: true,
                })
            })
    }

    getBloodType = blood => {
        const { donorsList } = this.state;
        const getDonors = [];
        switch (blood) {
            case 'AB-':
            case 'AB+': {
                getDonors.push(donorsList.filter(val => {
                    switch (val.bloodType) {
                        case 'A-':
                        case 'A+':
                        case 'B-':
                        case 'B+':
                        case 'AB-':
                        case 'AB+':
                        case 'O-':
                        case 'O+': {
                            return val;
                        }
                        default: {
                            return null;
                        }
                    }
                }));
                this.setState({ getDonors });
                break;
            }
            case 'A-':
            case 'A+': {
                getDonors.push(donorsList.filter(val => {
                    switch (val.bloodType) {
                        case 'A-':
                        case 'A+':
                        case 'O-':
                        case 'O+': {
                            return val;
                        }
                        default: {
                            return null;
                        }
                    }
                }));
                this.setState({ getDonors });
                break;
            }
            case 'B-':
            case 'B+': {
                getDonors.push(donorsList.filter(val => {
                    switch (val.bloodType) {
                        case 'B-':
                        case 'B+':
                        case 'O-':
                        case 'O+': {
                            return val;
                        }
                        default: {
                            return null;
                        }
                    }
                }));
                this.setState({ getDonors });
                break;
            }
            case 'O-':
            case 'O+': {
                getDonors.push(donorsList.filter(val => {
                    switch (val.bloodType) {
                        case 'O-':
                        case 'O+': {
                            return val;
                        }
                        default: {
                            return null;
                        }
                    }
                }));
                this.setState({ getDonors });
                break;
            }
            default: {
                this.setState({ getDonors });
            }
        }
        console.log(getDonors);
    }

    render() {
        const { classes } = this.props;
        const { displayName, isLoading, bloodType } = this.state;
        return (
            <div>
                {isLoading ?
                    <div className={classes.motherContainer} >
                        <CircularProgress />
                    </div >
                    :
                    <div className={classes.container}>
                        <PrimarySearchAppBar
                            displayName={displayName}
                            onSignOut={this.onSignOutHandler}
                        />
                        <NativeSelects
                            bloodType={bloodType}
                            getType={this.getBloodType}
                        />
                    </div>
                }
            </div>
        );
    }
}

const style = theme => ({
    container: {
        width: '95%',
        margin: 'auto',
        overflow: 'auto',
    },
    motherContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
    },
});

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(style)(Dashboard);