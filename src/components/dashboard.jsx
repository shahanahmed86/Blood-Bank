//React Component
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Material-UI
import { withStyles } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';

//Firebase
import * as firebase from 'firebase';

//Custom Component
import PrimarySearchAppBar from '../containers/appbar';
import NativeSelects from '../containers/select';
import PositionedSnackbar from '../containers/snackbar';
import DonorsList from '../containers/list';

function Donors(name, bloodType, contact) {
    this.name = name;
    this.bloodType = bloodType;
    this.contact = contact;
}

const donorsList = [
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
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            uid: props.location.state,
            profile: {},
            error: {},
            open: false,
            donorsList,
            getDonors: [],
            bloodTypes: ['', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'O-', 'O+'],
            isDonor: false,
            isDonorType: '',
            ref: firebase.database().ref(),
        }
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
        const { ref, uid } = this.state;
        ref.child('profile').child(uid).on('value', snapshot => {
            const profile = snapshot.val();
            this.setState({
                profile,
                displayName: `${profile.firstName} ${profile.lastName}`,
                isLoading: false,
            });
        })
    }

    getBloodType = blood => {
        const { donorsList } = this.state;
        const getDonors = [];
        switch (blood) {
            case 'O-': {
                getDonors.push(donorsList.find(val => val.bloodType === 'O-'));
                this.setState({ getDonors });
                break;
            }
            case 'O+': {
                getDonors.push(donorsList.find(val => val.bloodType === 'O-'));
                getDonors.push(donorsList.find(val => val.bloodType === 'O+'));
                this.setState({ getDonors });
                break;
            }
            case 'A-': {
                getDonors.push(donorsList.find(val => val.bloodType === 'A-'));
                getDonors.push(donorsList.find(val => val.bloodType === 'O-'));
                this.setState({ getDonors });
                break;
            }
            case 'A+': {
                getDonors.push(donorsList.find(val => val.bloodType === 'A-'));
                getDonors.push(donorsList.find(val => val.bloodType === 'A+'));
                getDonors.push(donorsList.find(val => val.bloodType === 'O-'));
                getDonors.push(donorsList.find(val => val.bloodType === 'O+'));
                this.setState({ getDonors });
                break;
            }
            case 'B-': {
                getDonors.push(donorsList.find(val => val.bloodType === 'B-'));
                getDonors.push(donorsList.find(val => val.bloodType === 'O-'));
                this.setState({ getDonors });
                break;
            }
            case 'B+': {
                getDonors.push(donorsList.find(val => val.bloodType === 'B-'));
                getDonors.push(donorsList.find(val => val.bloodType === 'B+'));
                getDonors.push(donorsList.find(val => val.bloodType === 'O-'));
                getDonors.push(donorsList.find(val => val.bloodType === 'O+'));
                this.setState({ getDonors });
                break;
            }
            case 'AB-': {
                getDonors.push(donorsList.find(val => val.bloodType === 'A-'));
                getDonors.push(donorsList.find(val => val.bloodType === 'B-'));
                getDonors.push(donorsList.find(val => val.bloodType === 'O-'));
                this.setState({ getDonors });
                break;
            }
            case 'AB+': {
                getDonors.push(donorsList.find(val => val.bloodType === 'A-'));
                getDonors.push(donorsList.find(val => val.bloodType === 'A+'));
                getDonors.push(donorsList.find(val => val.bloodType === 'B-'));
                getDonors.push(donorsList.find(val => val.bloodType === 'B+'));
                getDonors.push(donorsList.find(val => val.bloodType === 'O-'));
                getDonors.push(donorsList.find(val => val.bloodType === 'O+'));
                this.setState({ getDonors });
                break;
            }
            default: {
                this.setState({ getDonors });
            }
        }
    }

    onSignOutHandler = () => {
        firebase.auth().signOut()
            .then(() => {
                this.setState({
                    profile: {},
                    uid: '',
                });
                this.props.history.replace('/');
            })
            .catch(error => {
                this.setState({
                    error,
                    open: true,
                })
            })
    }

    handleCloseMessage = () => {
        this.setState({
            open: false,
        });
    }

    checkDonor = () => {
        this.setState({
            isDonor: true
        });
    }

    becomeDonor = () => {
        this.setState({
            isDonor: false
        })
    }

    handleChange = ev => {
        const { name, value } = ev.target;
        this.setState({
            [name]: value,
        });
    }

    render() {
        const { classes } = this.props;
        const { displayName, isLoading, bloodTypes, open, error, getDonors, isDonor } = this.state;
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
                        <div className={classes.newBox}>
                            {isDonor ?
                                <div>
                                    <NativeSelects
                                        bloodType={bloodTypes}
                                        getType={this.getDonorBloodType}
                                    />
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        onClick={this.becomeDonor}
                                    >
                                        Become
                                    </Button>
                                    <br />
                                </div>
                                : null}
                            <Button
                                onClick={this.checkDonor}
                                variant='outlined'
                                color='secondary'
                                size='small'
                            >
                                Donor
                            </Button>
                        </div>
                        <div className={classes.newBox}>
                            <NativeSelects
                                bloodType={bloodTypes}
                                getType={this.getBloodType}
                            />
                        </div>
                        {getDonors.length > 0 ?
                            <div>
                                <DonorsList
                                    data={getDonors}
                                />
                            </div>
                            : ''}
                    </div>
                }
                <PositionedSnackbar
                    open={open}
                    close={this.handleCloseMessage}
                    message={error.message}
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
    },
    motherContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
    },
    newBox: {
        marginTop: theme.spacing.unit,
        display: 'block',
    },
});

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(style)(Dashboard);