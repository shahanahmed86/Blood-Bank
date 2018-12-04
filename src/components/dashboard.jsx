//React Component
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Material-UI
import { withStyles } from '@material-ui/core/styles';
import { Button, CircularProgress, Paper, Typography, TextField } from '@material-ui/core';

//Firebase
import * as firebase from 'firebase';

//Custom Component
import PrimarySearchAppBar from '../containers/appbar';
import NativeSelects from '../containers/select';
import BecomeDonor from '../containers/become';
import PositionedSnackbar from '../containers/snackbar';
import DonorsList from '../containers/list';
import Profile from './profile';

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
            message: '',
            open: false,
            donorsList: [],
            bloodTypes: ['', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'O-', 'O+'],
            isDonor: false,
            isDonorType: '',
            donorBloodType: '',
            blood: '',
            isProfile: false,
            lastDonate: '',
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
        //become a donor
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
        this.setState({ blood });
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
                    message: error.message,
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
        const { lastDonate, profile } = this.state;
        const { dob } = profile;
        const thisYear = new Date().getFullYear();
        const age = new Date(dob).getFullYear();
        const currentDate = new Date().getTime();
        const lastDonationDate = new Date(lastDonate).getTime();
        const qualityDonor = Math.floor((currentDate - lastDonationDate) / (1000 * 60 * 60 * 24 * 30));
        const ageLimit = thisYear - age;
        if (ageLimit >= 18 && ageLimit <= 60) {
            if (qualityDonor >= 6) {
                this.setState({
                    isDonor: true
                });
            }
            else {
                this.setState({
                    isDonor: false,
                    open: true,
                    message: `A donor must have passed six months of period since last donation of blood`
                })
            }
        }
        else {
            this.setState({
                isDonor: false,
                open: true,
                message: `A donor age must between 18 to 45 years in order to donate but your current age is ${ageLimit}`
            })
        }
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

    onClickOnProfile = () => {
        this.setState(state => ({ isProfile: !state.isProfile }));
    }

    render() {
        const { classes } = this.props;
        const {
            displayName,
            isLoading,
            bloodTypes,
            open,
            message,
            isDonor,
            donorBloodType,
            donorsList,
            blood,
            isProfile,
            uid,
            lastDonate,
        } = this.state;
        return (
            <div>
                {isLoading ?
                    <div className={classes.motherContainer} >
                        <CircularProgress />
                    </div >
                    :
                    <div className={classes.container}>
                        <PrimarySearchAppBar
                            onSignOut={this.onSignOutHandler}
                        />
                        <div className={classes.flexBoxes}>
                            <Paper className={classes.flexBox1}>
                                <div className={classes.newBox}>
                                    <Typography
                                        style={{ padding: 10 }}
                                        align='center'
                                        variant='h6'
                                        color='textPrimary'
                                    >
                                        Welcome
                                    </Typography>
                                    <Typography
                                        align='center'
                                        color='primary'
                                        variant='title'>
                                        {displayName}
                                    </Typography>
                                    <br />
                                    <Button
                                        mini={true}
                                        color='primary'
                                        variant='outlined'
                                        size='small'
                                        onClick={this.onClickOnProfile}
                                    >
                                        {isProfile ? 'Donors List' : 'Profile'}
                                    </Button>
                                </div>
                                <Typography
                                    style={{ padding: 15 }}
                                    align='justify'
                                    color='textPrimary'
                                >
                                    If there is an emergency that you required a blood for your loved one then select the blood type.
                                </Typography>
                                <div className={classes.newBox}>
                                    <NativeSelects
                                        bloodType={bloodTypes}
                                        getType={this.getBloodType}
                                    />
                                </div>
                            </Paper>
                            <div className={classes.flexBox2}>
                                {isProfile ? (
                                    <Profile
                                        uid={uid}
                                        onClickOnProfile={this.onClickOnProfile}
                                    />
                                ) : (
                                        donorsList.length > 0 ? (
                                            <DonorsList
                                                data={donorsList}
                                                type={blood}
                                            />
                                        ) : ''
                                    )}
                            </div>
                            <Paper className={classes.flexBox3}>
                                <div>
                                    <Typography
                                        style={{ padding: 10 }}
                                        align='justify'
                                        color='textPrimary'
                                    >
                                        If you love/want to donate your blood
                                    </Typography>
                                    <TextField
                                        margin='normal'
                                        label='Last Donation Date'
                                        InputLabelProps={{ shrink: true }}
                                        variant='outlined'
                                        type='date'
                                        name='lastDonate' value={lastDonate}
                                        onChange={this.handleChange} />
                                    <Button
                                        onClick={this.checkDonor}
                                        variant='outlined'
                                        color='secondary'
                                        size='small'
                                    >
                                        Click Here
                                    </Button>
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
                                        </div>
                                        : ''}
                                </div>
                            </Paper>
                        </div>
                    </div>
                }
                <PositionedSnackbar
                    open={open}
                    close={this.handleCloseMessage}
                    message={message}
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
        minHeight: '95vh',
    },
    newBox: {
        textAlign: 'center',
    },
    become: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexBoxes: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        minHeight: '85vh',
    },
    flexBox1: {
        flex: 1.25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 275,
        maxWidth: 275,
        minHeight: 210,
        maxHeight: 'fit-content',
        margin: theme.spacing.unit,
        paddingBottom: theme.spacing.unit * 2,
        paddingTop: theme.spacing.unit,
    },
    flexBox2: {
        flex: 4,
        maxWidth: 'fit-content',
        margin: theme.spacing.unit,
    },
    flexBox3: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 280,
        maxHeight: 280,
        minWidth: 250,
        maxWidth: 250,
        margin: theme.spacing.unit,
        textAlign: 'center',
        paddingBottom: theme.spacing.unit,
    }
});

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(style)(Dashboard);