import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import injectSheet from 'react-jss';

const styles = {
  pair: {
    margin: '4px 0'
  },
  input: {
    marginRight: '4px'
  }
};

/**
 * A custom Ant form control built as it shown in the official documentation
 * https://ant.design/components/form/#components-form-demo-customized-form-controls
 * Based on built-in Tag https://ant.design/components/tag/#components-tag-demo-control
 */
class AlternativeCodes extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component
    if ('value' in nextProps) {
      return { pairs: nextProps.value };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      pairs: props.value
    };
  }

  onKeyChange = ({ e, index }) => {
    const pairs = [...this.state.pairs];
    pairs[index] = pairs[index] || {};
    pairs[index].code = e.target.value;
    this.triggerChange(pairs);
  };

  onValueChange = ({ e, index }) => {
    const pairs = [...this.state.pairs];
    pairs[index] = pairs[index] || {};
    pairs[index].description = e.target.description;
    this.triggerChange(pairs);
  };

  addPair = () => {
    if (this.state.newCode && this.state.newDescription) {
      const pairs = [...this.state.pairs, { code: this.state.newCode, description: this.state.newDescription }];
      this.setState({newCode: undefined, newDescription: undefined});
      this.triggerChange(pairs);
    }
  }

  removePair = (index) => {
    const pairs = [...this.state.pairs];
    pairs.splice(index, 1);
    this.triggerChange(pairs);
  }

  triggerChange = pairs => {
    // Should provide an event to pass value to Form
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(pairs);
    }
  };

  render() {
    const { pairs, newCode, newDescription } = this.state;
    const { classes, labelKey, labelValue } = this.props;

    return (
      <React.Fragment>
        {pairs && pairs.map((pair, index) => {
          return <div className={classes.pair} key={index}>
            <Input
              className={classes.input}
              type="text"
              placeholder={labelKey || 'Code'}
              value={pair.code}
              onChange={e => this.onKeyChange({ e, code: pair.code, index })}
              style={{ width: 100 }}
            />
            <Input
              className={classes.input}
              type="text"
              placeholder={labelValue || 'Description'}
              value={pair.description}
              onChange={e => this.onValueChange({ e, description: pair.description, index })}
              style={{ width: 200 }}
            />
            <Button onClick={e => this.removePair(index)}>Remove</Button>
          </div>
        })}
        <div className={classes.pair}>
          <Input
            className={classes.input}
            type="text"
            value={newCode}
            placeholder={labelKey || 'Code'}
            onChange={e => this.setState({ newCode: e.target.value })}
            style={{ width: 100 }}
          />
          <Input
            className={classes.input}
            type="text"
            value={newDescription}
            placeholder={labelValue || 'Description'}
            onChange={e => this.setState({ newDescription: e.target.value })}
            style={{ width: 200 }}
          />
          <Button onClick={this.addPair}>Add</Button>
        </div>
      </React.Fragment>
    );
  }
}

AlternativeCodes.propTypes = {
  // labelKey: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired, // text label
  // labelValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired, // text label
  value: PropTypes.oneOfType([PropTypes.array]), // value passed from form field decorator
  onChange: PropTypes.func.isRequired, // callback to been called on any data change
};

export default injectSheet(styles)(AlternativeCodes);