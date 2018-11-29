//React Basic Component
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Material-UI Components
import {
    withStyles,
    TextField,
    Paper,
    Typography,
    Button,
    CircularProgress,
    InputLabel,
    FormControl,
    Select,
    OutlinedInput
} from '@material-ui/core';

//firebase & its components
import * as firebase from 'firebase';
import './config';

//Custom Tags
import PositionedSnackbar from '../containers/snackbar';

class Profile extends Component {
    state = {
        isLoading: false,
        open: false,
        message: '',
        firstName: '',
        lastName: '',
        fatherName: '',
        dob: '',
        cell: '',
        gender: '',
        ref: firebase.database().ref(),
    }

    handleChange = ev => {
        const { name, value } = ev.target;
        this.setState({
            [name]: value,
        });
    }

    handleCloseMessage = () => {
        this.setState({
            open: false,
        })
    }

    onSaveProfile = () => {
        this.setState({
            isLoading: true,
        });
    }

    render() {
        const {
            isLoading, open, message, firstName, lastName, fatherName, dob, cell, gender
        } = this.state;
        const { classes } = this.props;
        return (
            <div className={classes.motherContainer}>
                {isLoading ?
                    <CircularProgress />
                    :
                    <Paper
                        className={classes.root}
                        elevation={5}>
                        <Typography
                            align='center'
                            color='secondary'
                            variant='h4'>
                            PROFILE
                        </Typography>
                        <TextField
                            margin='normal'
                            fullWidth={true}
                            label='First Name'
                            placeholder='Please Enter'
                            variant='outlined'
                            type='text'
                            name='firstName' value={firstName}
                            onChange={this.handleChange} />
                        <TextField
                            margin='normal'
                            fullWidth={true}
                            label='Last Name'
                            placeholder='Please Enter'
                            variant='outlined'
                            type='text'
                            name='lastName' value={lastName}
                            onChange={this.handleChange} />
                        <TextField
                            margin='normal'
                            fullWidth={true}
                            label='Father Name'
                            placeholder='Please Enter'
                            variant='outlined'
                            type='text'
                            name='fatherName' value={fatherName}
                            onChange={this.handleChange} />
                        <TextField
                            margin='normal'
                            fullWidth={true}
                            label='Date of Birth'
                            InputLabelProps={{ shrink: true }}
                            variant='outlined'
                            type='date'
                            name='dob' value={dob}
                            onChange={this.handleChange} />
                        <TextField
                            margin='normal'
                            fullWidth={true}
                            label='Phone Number'
                            variant='outlined'
                            type='text'
                            name='cell' value={cell}
                            onChange={this.handleChange} />
                        <FormControl
                            variant='outlined'
                            fullWidth={true}
                            margin='normal'
                        >
                            <InputLabel
                                htmlFor="filled-gender-native-simple"
                            >
                                Gender
                            </InputLabel>
                            <Select
                                native
                                value={gender}
                                onChange={this.handleChange}
                                input={
                                    <OutlinedInput
                                        labelWidth={55}
                                        name="gender"
                                        id="filled-gender-native-simple"
                                    />}
                            >
                                <option value="" />
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                            </Select>
                        </FormControl>
                        <Button
                            color='primary'
                            fullWidth={true}
                            size='large'
                            onClick={this.onSaveProfile}
                            variant='contained'
                        >
                            Save                            
                        </Button>
                    </Paper>
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

const styles = theme => ({
    motherContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
    },
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        width: 350,
    },
});

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);