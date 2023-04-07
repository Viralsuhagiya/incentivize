import React from 'react'
import { FormSpy } from 'react-final-form'

class AutoSave extends React.Component {
  constructor(props) {
    super(props)
    this.state = { values: props.values, submitting: false }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active && this.props.active !== nextProps.active) {
      // blur occurred for the field name coming in active
      this.save(this.props.active)
    }
  }

  save = async blurredField => {
    if (this.promise) {
      await this.promise
    }
    const { values, setFieldData, save } = this.props
    // values have changed
    this.setState({ submitting: true, values })
    setFieldData&&setFieldData(blurredField, { saving: true })
    this.promise = save()
    await this.promise
    delete this.promise
    this.setState({ submitting: false })
    setFieldData&&setFieldData(blurredField, { saving: false })
  }

  render() {
    // This component doesn't have to render anything, but it can render
    // submitting state.
    return null
  }
}

export default props => (
  <FormSpy
    {...props}
    subscription={{ active: true, values: true }}
    component={AutoSave}
  />
)
