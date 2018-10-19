import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import DynamicForm from './views/components/FormikForm';

const Tools = props => {
  const { handleUndoClick, handleRedoClick } = props;
  return (
    <div>
      <h3>Tools Component</h3>
      <button onClick={handleUndoClick}>undo</button>
      <button onClick={handleRedoClick}>redo</button>
    </div>
  );
};

class App extends Component {
  state = {
    formStateHistory: [],
    formCurrentStateIdx: 2,
    formInitialValues: {
      brokerName: ['name'],
      address: ['address']
    }
  };

  componentDidMount() {
    const { formStateHistory, formInitialValues } = this.state;

    formStateHistory.push(formInitialValues);
    formStateHistory.push({ brokerName: ['name', 'name.2'], address: [] });
    formStateHistory.push({
      brokerName: ['name', 'name.2', 'name.3'],
      address: ['address']
    });
    formStateHistory.push({
      brokerName: ['name', 'name.2', 'name.3'],
      address: ['address', 'address.2']
    });

    this.setState({
      formStateHistory,
      formCurrentStateIdx: formStateHistory.length - 1
    });
  }

  _undoHandler = () => {
    this.setState(({ formCurrentStateIdx }) => ({
      formCurrentStateIdx:
        formCurrentStateIdx > 0 ? formCurrentStateIdx - 1 : formCurrentStateIdx
    }));
  };

  _redoHandler = () => {
    this.setState(({ formCurrentStateIdx, formStateHistory }) => ({
      formCurrentStateIdx:
        formCurrentStateIdx < formStateHistory.length - 1
          ? formCurrentStateIdx + 1
          : formCurrentStateIdx
    }));
  };

  _getCurrentFormState = () => {
    const {
      formStateHistory,
      formInitialValues,
      formCurrentStateIdx
    } = this.state;

    return formCurrentStateIdx < 0
      ? formInitialValues
      : formStateHistory[formCurrentStateIdx];
  };

  _rememberState = values => {
    const { formStateHistory, formCurrentStateIdx } = this.state;

    const newHistory = [...formStateHistory.slice(0, formCurrentStateIdx + 1)];
    newHistory.push(values);
    this.setState({
      formStateHistory: newHistory,
      formCurrentStateIdx: formCurrentStateIdx + 1
    });
  };

  _onClickPlusIcon = (fieldName, value) => {
    const newCurrentState = JSON.parse(
      JSON.stringify(this._getCurrentFormState())
    );
    newCurrentState[fieldName].push(value);
    this._rememberState(newCurrentState);
  };

  render() {
    const { formCurrentStateIdx, formStateHistory } = this.state;
    const style = {
      border: '1px solid #ededed',
      padding: '20px',
      margin: '10px'
    };

    return (
      <div className="App">
        <div style={style}>
          <h3>Info</h3>
          <div>Current history pointer idx:</div>
          <div>{formCurrentStateIdx}</div>
          <div>Current history length</div>
          <div>{formStateHistory.length}</div>
          <div>Current form state</div>
          <div>{JSON.stringify(this._getCurrentFormState())}</div>
        </div>

        <div style={style}>
          <Tools
            handleUndoClick={this._undoHandler}
            handleRedoClick={this._redoHandler}
          />
        </div>

        <div style={style}>
          <h3>Form Component</h3>
          <DynamicForm
            initialValues={this._getCurrentFormState()}
            handleRememberState={this._rememberState}
            handleOnClickPlusIcon={this._onClickPlusIcon}
          />
        </div>
      </div>
    );
  }
}

export default App;
