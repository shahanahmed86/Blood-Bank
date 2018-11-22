import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

function SimpleTable(props) {
    const { classes, data } = props;
    console.log(data);
    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Serial</TableCell>
                        <TableCell>Donor's Name</TableCell>
                        <TableCell>Blood Group</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>request</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((value, ind) => {
                        return (
                            <TableRow key={ind}>
                                <TableCell>{ind + 1}</TableCell>
                                <TableCell component="th" scope="row">{value.name}</TableCell>
                                <TableCell>{value.bloodType}</TableCell>
                                <TableCell>{value.contact}</TableCell>
                                <TableCell>
                                    <Button
                                        variant='outlined'
                                        size='small'
                                        color='primary'
                                        disabled={false}
                                    >
                                        Request
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}

const styles = theme => ({
    root: {
        width: 'fit-content',
        marginTop: theme.spacing.unit * 2,
        overflowX: 'auto',
    },
    table: {
        maxWidth: 100,
    },
});

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
};

export default withStyles(styles)(SimpleTable);