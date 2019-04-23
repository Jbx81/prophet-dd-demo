import React, {Component} from 'react'
import PortfolioDataTable from '../PortfolioDataTable'
import {Button, Modal, Transition} from 'semantic-ui-react'

class PortfolioModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }
  show = size => () => this.setState({size, open: true})
  close = () => this.setState({open: false})
  render() {
    const {open, size} = this.state
    return (
      <div>
        <h4>
          {' '}
          List of portfolio value{' '}
          <Button
            onClick={this.show('tiny')}
            id="help-btn"
            icon="question circle outline icon"
          />{' '}
        </h4>
        <div>
          <Transition.Group
            open={open}
            transition="horizontal-flip"
            duration={1000}
          >
            {open && (
              <Modal size={size} open={open} onClose={this.close}>
                <Modal.Header>What is a portfolio?</Modal.Header>
                <Modal.Content>
                  <p>
                    Definition: a range of investments held by a person or
                    organization.
                  </p>
                  <p>
                    You start with cash of $100,000, which decreases per stock
                    bought.{' '}
                  </p>
                  <p>
                    Once you buy stock, the amount of stock you bought and the
                    total price is displayed here.
                  </p>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    onClick={this.close}
                    positive
                    icon="checkmark"
                    labelPosition="right"
                    content="Got it!"
                  />
                </Modal.Actions>
              </Modal>
            )}
          </Transition.Group>
        </div>
      </div>
    )
  }
}

const PortfolioList = () => {
  return (
    <div className="portfoliolist">
      <PortfolioModal />
      <PortfolioDataTable />
    </div>
  )
}
/*


*/

export default PortfolioList
