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

function Donors(firstName, donorBloodType, gender, cell, user, uid, lastDonate) {
    this.firstName = firstName;
    this.donorBloodType = donorBloodType;
    this.gender = gender;
    this.cell = cell;
    this.user = user;
    this.uid = uid;
    this.lastDonate = lastDonate;
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
                const { donorBloodType, lastDonate } = donor
                this.setState({ donorBloodType, lastDonate });
            }
        });
        //getting/fetching donors list
        ref.child('donors').on('value', snapshot => {
            const donors = snapshot.val();
            const donorsList = [];
            for (let key in donors) {
                const { firstName, donorBloodType, gender, cell, user, uid, lastDonate } = donors[key]
                donorsList.push(
                    new Donors(firstName, donorBloodType, gender, cell, user, uid, lastDonate)
                );
                this.setState({ donorsList, });
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
        const { profile } = this.state;
        const { dob } = profile;
        const thisYear = new Date().getFullYear();
        const age = new Date(dob).getFullYear();
        const ageLimit = thisYear - age;
        if (ageLimit >= 18 && ageLimit <= 60) {
            this.setState({
                isDonor: true
            });
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
        const { ref, profile, donorBloodType, lastDonate } = this.state;
        const { user, uid, firstName, gender, cell } = profile;
        const lastDonateDate = new Date(lastDonate).getTime();
        const currentDate = new Date().getTime();
        const donorLastDate = Math.floor((currentDate - lastDonateDate) / (1000 * 60 * 60 * 24));
        if (donorBloodType === '') {
            ref.child('donors').child(uid).remove();
            this.setState({
                isDonor: false,
                lastDonate: '',
            })
        }
        else {
            if (donorLastDate >= 180 || lastDonate === '') {
                ref.child('donors').child(uid).set({
                    user, uid, firstName, gender, cell, donorBloodType, lastDonate
                });
                this.setState({
                    isDonor: false,
                })
            }
            else {
                this.setState({
                    open: true,
                    message: `A donor must have passed 180 days since last blood donation but you have passed only ${donorLastDate}`,
                })
            }
        }
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
                                        align='justify'
                                        color='textPrimary'
                                    >
                                        If you love/want to donate your blood
                                    </Typography>
                                    <Button
                                        style={{ marginTop: 15 }}
                                        onClick={this.checkDonor}
                                        variant='outlined'
                                        color='secondary'
                                        size='small'
                                    >
                                        Click Here
                                    </Button>
                                    {isDonor ?
                                        <div className={classes.become}>
                                            <TextField
                                                margin='normal'
                                                fullWidth={true}
                                                label='Last Donation Date'
                                                InputLabelProps={{ shrink: true }}
                                                variant='outlined'
                                                type='date'
                                                name='lastDonate' value={lastDonate}
                                                onChange={this.handleChange} />
                                            <div className={classes.newFlexBox}>
                                                <BecomeDonor
                                                    types={bloodTypes}
                                                    donor={donorBloodType}
                                                    getType={this.getDonorBloodType}
                                                />
                                                <Button
                                                    style={{ marginTop: 20 }}
                                                    variant='contained'
                                                    color='primary'
                                                    size='small'
                                                    onClick={this.becomeDonor}
                                                >
                                                    Update
                                                </Button>
                                            </div>
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
        marginTop: theme.spacing.unit * 2,
    },
    newFlexBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexBoxes: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        margin: theme.spacing.unit,
    },
    flexBox1: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 225,
        maxWidth: 225,
        minHeight: 275,
        maxHeight: 'fit-content',
        paddingBottom: theme.spacing.unit * 2,
        paddingTop: theme.spacing.unit,
        margin: theme.spacing.unit,
    },
    flexBox2: {
        flex: 1,
        maxWidth: 'fit-content',
        margin: theme.spacing.unit,
    },
    flexBox3: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'fit-content',
        maxHeight: 'fit-content',
        minWidth: 185,
        maxWidth: 185,
        textAlign: 'center',
        padding: theme.spacing.unit * 3,
        margin: theme.spacing.unit,
    }
});

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(style)(Dashboard);