import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class SimpleTable extends Component {
    state = {
        getDonors: [],
    }
    
    componentWillReceiveProps(props) {
        this.getData(props);
    }

    componentDidMount() {
        this.getData(this.props);
    }

    getData = props => {
        let getDonors = [];
        const { data, type } = props;
        const donorsList = data;
        const blood = type;
        switch (blood) {
            case 'O-': {
                donorsList.forEach(val => {
                    switch (val.donorBloodType) {
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
                    switch (val.donorBloodType) {
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
                    switch (val.donorBloodType) {
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
                    switch (val.donorBloodType) {
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
                    switch (val.donorBloodType) {
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
                    switch (val.donorBloodType) {
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
                    switch (val.donorBloodType) {
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

    render() {
        const { classes } = this.props;
        const { getDonors } = this.state;
        if (getDonors.length > 0) {
            return (
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Serial</TableCell>
                                <TableCell>Donor's Name</TableCell>
                                <TableCell>Blood Group</TableCell>
                                <TableCell>Gender</TableCell>
                                <TableCell>Cell</TableCell>
                                <TableCell>User</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getDonors.map((value, ind) => {
                                return (
                                    <TableRow key={ind}>
                                        <TableCell>{ind + 1}</TableCell>
                                        <TableCell component="th" scope="row">{value.firstName}</TableCell>
                                        <TableCell>{value.donorBloodType}</TableCell>
                                        <TableCell>{value.gender}</TableCell>
                                        <TableCell>{value.cell}</TableCell>
                                        <TableCell>{value.user}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            );
        }
        else {
            return null;
        }
    }
}

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 2,
        overflowX: 'auto',
    },
    table: {
        minWidth: 50,
    },
});

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
};

export default withStyles(styles)(SimpleTable);