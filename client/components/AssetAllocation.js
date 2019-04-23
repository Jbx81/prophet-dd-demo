import React, {Component, useState, useEffect} from 'react'
import {getPortfolio} from '../store/assetallocation'
import {getStockPriceForAssetAllocation} from '../store/chart'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {RadialChart} from 'react-vis'
import {Button, Modal, Transition, SemanticCOLORS} from 'semantic-ui-react'

const myPalette = [
  '#cc00ff',
  '#330099',
  '#cc66cc',
  '#663399',
  '#ff99ff',
  '#660099',
  '#330066',
  '#990061',
  '72054a',
  '782258',
  '78222b',
  'ae1865'
]

const AssetAllocationModal = (props, initialOpen = false, size = 'tiny') => {
  const [open, setOpen] = useState(initialOpen)
  const show = () => setOpen(true)
  //original incase not working const show = size => () => this.setState({size, open: true})
  const close = () => setOpen(false)
  return (
    <div>
      <h4>
        Portfolio Allocation{' '}
        <Button onClick={show} id="help-btn" icon="question circle outline" />{' '}
      </h4>
      <div>
        <Transition.Group
          open={open}
          transition="horizontal-flip"
          duration={1000}
        >
          {open === true && (
            <Modal size={size} open={open} onClose={close}>
              <Modal.Header>
                This section contains a graphical division of your portfolio
              </Modal.Header>
              <Modal.Content>
                <p>
                  This pie chart graph will automatically calculate and display
                  how your initial cash was divided between your bought stocks.
                </p>
              </Modal.Content>
              <Modal.Actions>
                <Button
                  onClick={close}
                  positive
                  circular={true}
                  icon="checkmark"
                  labelPosition="left"
                  content="Gang Gang"
                />
              </Modal.Actions>
            </Modal>
          )}
        </Transition.Group>
      </div>
    </div>
  )
}

const AssetAllocation = (
  props,
  initialInterval = 0,
  initialUser = 0,
  initialPortfolio = []
) => {
  const [intervalId, setIntervalId] = useState(initialInterval)
  const [currentUser, setCurrentUser] = useState(initialUser)
  const [portfolio, setPortfolio] = useState(initialPortfolio)
  const intervalFunc = async () => {
    const callBack = (func, userId) => {
      func(userId)
    }
    props.getPortfolio(currentUser)
    const currentInterval = setInterval(() => {
      callBack(props.getPortfolio, props.userId)
    }, 50000)
    await setIntervalId(currentInterval)
  }
  useEffect(async () => {
    setPortfolio(props.portfolio)
    setCurrentUser(props.userId)
    await intervalFunc()
    return () => {
      clearInterval(intervalId)
    }
  }, [])
  let myData
  if (props.portfolio.length) {
    myData = props.portfolio.reduce((accum, val) => {
      accum.push({angle: val[1]})
      return accum
    }, [])
  } else {
    myData = [{angle: 0}, {angle: 0}, {angle: 100}]
  }
  return (
    <div>
      <AssetAllocationModal />
      <RadialChart
        animation
        colorType="category"
        colorDomain={[0, 1, 2, 3, 4, 5, 6]}
        colorRange={myPalette}
        className="templateAssetAllocation"
        data={myData}
        width={300}
        height={300}
      />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    portfolio: state.assetallocation.portfolio,
    userId: state.user.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getPortfolio: userId => dispatch(getPortfolio(userId)),
    getStockPriceForAssetAllocation: ticker =>
      dispatch(getStockPriceForAssetAllocation(ticker))
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AssetAllocation)
)
