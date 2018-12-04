import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class BecomeDonor extends React.Component {
    state = {
        blood: '',
        labelWidth: 0,
    }

    componentDidMount() {
        const { donor } = this.props;
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
            blood: donor ? donor : '',
        });
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
        this.props.getType(event.target.value);
    };

    render() {
        const { classes, types } = this.props;
        return (
            <div className={classes.root}>
                <FormControl className={classes.formControl}>
                    <InputLabel
                        ref={ref => { this.InputLabelRef = ref }}
                        htmlFor="blood-native"
                    >
                        Blood
                    </InputLabel>
                    <Select
                        native
                        value={this.state.blood}
                        onChange={this.handleChange('blood')}
                        name="blood"
                        inputProps={{
                            id: 'blood-native',
                        }}
                    >
                        {types.map((val, ind) => {
                            return (
                                <option key={ind}>
                                    {val}
                                </option>
                            );
                        })}
                    </Select>
                </FormControl>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 75,
    },
});

BecomeDonor.propTypes = {
    classes: PropTypes.object.isRequired,
    types: PropTypes.array.isRequired,
    donor: PropTypes.string.isRequired,
    getType: PropTypes.func.isRequired,
};

export default withStyles(styles)(BecomeDonor);