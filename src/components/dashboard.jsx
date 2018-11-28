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
import BecomeDonor from '../containers/become';
import PositionedSnackbar from '../containers/snackbar';
import DonorsList from '../containers/list';

function Donors(firstName, donorBloodType, gender, cell, user, uid) {
    this.firstName = firstName;
    this.donorBloodType = donorBloodType;
    this.gender = gender;
    this.cell = cell;
    this.user = user;
    this.uid = uid;
}

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            uid: props.location.state,
            profile: {},
            error: {},
            open: false,
            donorsList: [],
            getDonors: [],
            bloodTypes: ['', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'O-', 'O+'],
            isDonor: false,
            isDonorType: '',
            donorBloodType: '',
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
        //getting user data
        ref.child('profile').child(uid).on('value', snapshot => {
            const profile = snapshot.val();
            this.setState({
                profile,
                displayName: `${profile.firstName} ${profile.lastName}`,
                isLoading: false,
            });
        });
        //becoming/updating a donor
        ref.child('donors').child(uid).on('value', snapshot => {
            const donor = snapshot.val();
            if (donor) {
                const donorBloodType = donor.donorBloodType;
                this.setState({ donorBloodType });
            }
        });
        //getting/fetching donors list
        ref.child('donors').on('value', snapshot => {
            const donors = snapshot.val();
            const donorsList = [];
            for (let key in donors) {
                const { firstName, donorBloodType, gender, cell, user, uid } = donors[key]
                donorsList.push(
                    new Donors(firstName, donorBloodType, gender, cell, user, uid)
                );
                this.setState({ donorsList });
            }
        })
    }

    getBloodType = blood => {
        const { donorsList } = this.state;
        let getDonors = [];
        switch (blood) {
            case 'O-': {
                donorsList.forEach(val => {
                    switch(val.donorBloodType) {
                        case 'O-': {
                            getDonors.push(val);
                            break;
                        }
                        default: {
                            return null;
                        }
                    }
                })
                break;
            }
            case 'O+': {
                donorsList.forEach(val => {
                    switch(val.donorBloodType) {
                        case 'O+':
                        case 'O-': {
                            getDonors.push(val);
                            break;
                        }
                        default: {
                            return null;
                        }
                    }
                })
                break;
            }
            case 'A-': {
                donorsList.forEach(val => {
                    switch(val.donorBloodType) {
                        case 'A-':
                        case 'O-': {
                            getDonors.push(val);
                            break;
                        }
                        default: {
                            return null;
                        }
                    }
                })
                break;
            }
            case 'A+': {
                donorsList.forEach(val => {
                    switch(val.donorBloodType) {
                        case 'A-':
                        case 'A+':
                        case 'O-':
                        case 'O+': {
                            getDonors.push(val);
                            break;
                        }
                        default: {
                            return null;
                        }
                    }
                })
                break;
            }
            case 'B-': {
                donorsList.forEach(val => {
                    switch(val.donorBloodType) {
                        case 'B-':
                        case 'O-': {
                            getDonors.push(val);
                            break;
                        }
                        default: {
                            return null;
                        }
                    }
                })
                break;
            }
            case 'B+': {
                donorsList.forEach(val => {
                    switch(val.donorBloodType) {
                        case 'B-':
                        case 'B+':
                        case 'O-':
                        case 'O+': {
                            getDonors.push(val);
                            break;
                        }
                        default: {
                            return null;
                        }
                    }
                })
                break;
            }
            case 'AB-': {
                donorsList.forEach(val => {
                    switch(val.donorBloodType) {
                        case 'A-':
                        case 'B-':
                        case 'AB-':
                        case 'O-': {
                            getDonors.push(val);
                            break;
                        }
                        default: {
                            return null;
                        }
                    }
                })
                break;
            }
            default: {
                getDonors = donorsList;
            }
        }
        this.setState({ getDonors });
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
        const { ref, profile, donorBloodType } = this.state;
        const { user, uid, firstName, gender, cell } = profile;
        if (donorBloodType === '') {
            ref.child('donors').child(uid).remove();
        }
        else {
            ref.child('donors').child(uid).set({ user, uid, firstName, gender, cell, donorBloodType });
        }
        this.setState({
            isDonor: false
        });
        this.getData();
    }

    getDonorBloodType = donorBloodType => {
        this.setState({ donorBloodType });
    }

    handleChange = ev => {
        const { name, value } = ev.target;
        this.setState({
            [name]: value,
        });
    }

    render() {
        const { classes } = this.props;
        const { displayName, isLoading, bloodTypes, open, error, getDonors, isDonor, donorBloodType, donorsList } = this.state;
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
                                <div className={classes.become}>
                                    <BecomeDonor
                                        types={bloodTypes}
                                        donor={donorBloodType}
                                        getType={this.getDonorBloodType}
                                    />
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        onClick={this.becomeDonor}
                                    >
                                        Update
                                    </Button>
                                    <br />
                                </div>
                                : ''}
                            <Button
                                onClick={this.checkDonor}
                                variant='outlined'
                                color='secondary'
                                size='small'
                            >
                                Become a Donor
                            </Button>
                        </div>
                        <div className={classes.newBox}>
                            <NativeSelects
                                bloodType={bloodTypes}
                                getType={this.getBloodType}
                            />
                        </div>
                        <div>
                            <DonorsList
                                data={getDonors.length > 0 ? getDonors : donorsList}
                            />
                        </div>
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
        marginTop: theme.spacing.unit * 2,
        display: 'block',
    },
    become: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.unit,
        width: 175,
        height: 'fit-content',
    }
});

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(style)(Dashboard);