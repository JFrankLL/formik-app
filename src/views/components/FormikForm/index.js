import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';

class DynamicForm extends React.Component {
  _renderGroup = ({ fieldName, fieldValues }) => {
    return (
      <FieldArray
        name={fieldName}
        render={arrayHelpers => (
          <div>
            {fieldValues && fieldValues.length > 0 ? (
              fieldValues.map((value, index) => (
                <div key={index}>
                  <Field name={`${fieldName}.${index}`} />
                  <button type="button" onClick={() => arrayHelpers.remove(index)}>-</button>
                  <button type="button" onClick={() => arrayHelpers.insert(index, '')}>+</button>
                </div>
              ))
            ) : (
                <button type="button" onClick={() => arrayHelpers.push('')}>{`Add a ${fieldName} field`}</button>
              )}
          </div>
        )}
      />
    );
  };

  _renderFormik = ({ values }) => {
    return (
      <Form>
        {Object.keys(values).map((fieldName, idx) =>
          <div key={idx}>{this._renderGroup({ fieldName, fieldValues: values[fieldName] })}</div>
        )}
        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>
    );
  };

  render() {
    const { initialValues } = this.props;

    return (
      <div>
        <h1>Friend List</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={values =>
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
            }, 500)
          }
          render={this._renderFormik}
        />
      </div>
    );
  }
}

export default DynamicForm;