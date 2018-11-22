import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class NativeSelects extends Component {
    state = {
        blood: '',
        labelWidth: 0,
    };
    
    componentDidMount() {
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        });
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
        this.props.getType(event.target.value);
    };

    render() {
        const { classes, bloodType } = this.props;
        return (
            <div className={classes.root}>
                <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    >
                    <InputLabel
                        ref={ref => {
                            this.InputLabelRef = ref;
                        }}
                        htmlFor="outlined-blood-native-simple"
                    >
                        Type
                  </InputLabel>
                    <Select
                        native
                        value={this.state.blood}
                        onChange={this.handleChange('blood')}
                        input={
                            <OutlinedInput
                                name="blood"
                                labelWidth={this.state.labelWidth}
                                id="outlined-blood-native-simple"
                            />
                        }
                    >
                        {bloodType.map((value, index) => {
                            return(
                                <option
                                    value={value}
                                    key={index}
                                    >
                                    {value}
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
        minWidth: 100,
    },
});

NativeSelects.propTypes = {
classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NativeSelects);