import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
//Custom Component

class SignIn extends Component {

  state = {
    user: '',
    password: '',
    isLoading: false,
    isSignIn: true,
    rePassword: '',
    firstName: '',
    lastName: '',
    dob: '',
    cell: '',
    gender: '',
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

  render() {
    const {
      user, password, isSignIn, isLoading, rePassword, firstName,
      lastName, fatherName, dob, cell, gender } = this.state;
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
              BLOOD BANK
              </Typography>
            <Typography
              align='center'
              color='primary'
              variant='h5'
              gutterBottom={true} >
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </Typography>
            <TextField
              margin='normal'
              fullWidth={true}
              autofocus={true}
              required={true}
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
              required={true}
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
                  required={true}
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
                  required={true}
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
                        labelWidth={64}
                        name="gender"
                        id="filled-gender-native-simple"
                      />}
                  >
                    <option value="" />
                    <option value={10}>Male</option>
                    <option value={20}>Female</option>
                  </Select>
                </FormControl>
              </div>
              : ''}
            <Button
              className={classes.customSpacing}
              color='primary'
              fullWidth={true}
              size='large'
              variant='contained'>
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </Button>
            <Typography>
              {isSignIn ? "Don't have an ID ?" : "Already have an ID ?"}
              <Button
                onClick={this.onSignInChange}
                variant='text'
                color='secondary' >
                {isSignIn ? 'Sign Up' : 'Sign In'}
              </Button>
            </Typography>
          </Paper>
        }
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
    // minWidth: '100%',
    minHeight: '100vh',
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