//React Basic Component
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Material-UI Components
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';

//firebase & its components
import * as firebase from 'firebase';
import './config';

//Custom Tags
import PositionedSnackbar from '../containers/snackbar';

class SignIn extends Component {
  state = {
    isLoading: false,
    isSignIn: true,
    open: false,
    message: '',
    user: '',
    password: '',
    rePassword: '',
    firstName: '',
    lastName: '',
    fatherName: '',
    dob: '',
    cell: '',
    gender: '',
    ref: firebase.database().ref().child('profile'),
  }

  handleChange = ev => {
    const { name, value } = ev.target;
    this.setState({
      [name]: value,
    });
  }

  onSignInChange = () => {
    this.setState(state => ({
      isSignIn: !state.isSignIn
    }));
  }

  handleCloseMessage = () => {
    this.setState({
      open: false,
    })
  }

  onSignUpHandler = () => {
    this.setState({
      isLoading: true,
    });
    let {
      isSignIn, user, password, rePassword, firstName,
      lastName, fatherName, dob, cell, gender, ref
    } = this.state;
    if (!isSignIn) {
      if (password === rePassword) {
        if (password.length >= 6) {
          firebase.auth().createUserWithEmailAndPassword(user, password)
            .then(resp => {
              const uid = resp.user.uid;
              ref.child(uid).set({
                user, firstName, lastName, fatherName, dob, cell, gender, uid,
              });
              user = password = rePassword = firstName = lastName = fatherName = dob = cell = gender = '';
              this.setState({
                isLoading: false,
                isSignIn: true,
                open: true,
                message: 'Email Registered Successfully, please Sign in !',
                user, password, rePassword, firstName, lastName, fatherName, dob, cell, gender,
              });
            })
            .catch(error => {
              this.setState({
                open: true,
                isLoading: false,
                message: error.message,
              });
            })
        }
        else {
          this.setState({
            open: true,
            isLoading: false,
            message: 'Password length must atleast be six (06) character long',
          });
        }
      }
      else {
        this.setState({
          open: true,
          isLoading: false,
          message: 'Confirm password must be identical',
        });
      }
    }
    else {
      firebase.auth().signInWithEmailAndPassword(user, password)
        .then(resp => {
          this.setState({
            isLoading: false,
          });
          this.props.history.replace('/dashboard', resp.user.uid);
        })
        .catch(error => {
          this.setState({
            open: true,
            isLoading: false,
            message: error.message,
          });
        })
    }
  }

  render() {
    const {
      isSignIn, isLoading, open, message, user, password, rePassword, firstName,
      lastName, fatherName, dob, cell, gender
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
              variant='h4'
              children='Blood Bank'
            />
            <Typography
              align='center'
              color='primary'
              variant='h5'
              gutterBottom={true}
              children={isSignIn ? 'Sign In' : 'Sign Up'}
            />
            <TextField
              margin='normal'
              fullWidth={true}
              autoFocus={true}
              label='Email'
              placeholder='Please Enter'
              variant='outlined'
              type='email'
              name='user' value={user}
              onChange={this.handleChange} />
            <br />
            <TextField
              margin='normal'
              fullWidth={true}
              label='Password'
              placeholder='Please Enter'
              variant='outlined'
              type='password'
              name='password' value={password}
              onChange={this.handleChange} />
            {!isSignIn ?
              <div>
                <TextField
                  margin='normal'
                  fullWidth={true}
                  label='Confirm Password'
                  placeholder='Please Enter'
                  variant='outlined'
                  type='password'
                  name='rePassword' value={rePassword}
                  onChange={this.handleChange} />
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
              </div>
              : ''}
            <Button
              className={classes.customSpacing}
              color='primary'
              fullWidth={true}
              size='large'
              onClick={this.onSignUpHandler}
              variant='contained'>
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </Button>
            <div className={classes.flexBox}>
              <Typography
                children={isSignIn ? "Don't have an ID ?" : "Already have an ID ?"}
              />
              <Button
                onClick={this.onSignInChange}
                variant='text'
                size='small'
                color='secondary' >
                {isSignIn ? 'Sign Up' : 'Sign In'}
              </Button>
            </div>
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
  flexBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customSpacing: {
    marginTop: theme.spacing.unit * 1.5,
    marginBottom: theme.spacing.unit,
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
    width: 350,
  },
});

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);