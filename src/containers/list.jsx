import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function SimpleTable(props) {
    const { classes, data } = props;
    if (data.length > 0) {
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
                        {data.map((value, ind) => {
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