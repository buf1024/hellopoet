import React, {Component} from 'react'
import {
  View,
  PanResponder,
} from 'react-native'
import merge from 'lodash/merge'
import PropTypes from 'prop-types'
import {WinWidth, WinHeight} from '../constants/appConsts'

const LONG_PRESS_TIMEOUT = 600
const DOUBLE_PRESS_TIMEOUT = 300
const DELTA_PRESS_DISTANCE = 10
const DELTA_SLIDE_DISTANCE = 50
const SLIDE_DISTANCE = 6

class GestureView extends Component {
  constructor(props) {
    super(props)
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => !(gestureState.dx === 0 && gestureState.dy === 0),
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (evt, gState) => {gState.grantEvt = evt.nativeEvent},
      onPanResponderMove: (evt, gState) => {},
      onPanResponderRelease: (evt, gState) => {
        gState.releaseEvt = evt.nativeEvent
        this.detectGesture(gState)
      }
    })
    //const {width, height} = Dimensions.get('window')
    const width = WinWidth
    const height = WinHeight
    this.range = {
      x: [{start: 0, end: width/5.0}, {start: width/5.0, end: width/5.0*4}, {start: width/5.0*4, end: width}],
      y: [{start: 0, end: height/5.0}, {start: height/5.0, end: height/5.0*4}, {start: height/5.0*4, end: height}]
    }
    this.handlers = {
      onSlideUp: (evt) => {/*console.log('def onSlideUp, event=%o', evt); this.setState({debug: `def onSlideUp, event=${evt.type}`})*/},
      onSlideDown: (evt) => {/*console.log('def onSlideDown, event=%o', evt); this.setState({debug: `def onSlideDown, event=${evt.type}`})*/},
      onSlideLeft: (evt) => {/*console.log('def OnSlideLeft, event=%o', evt); this.setState({debug: `def OnSlideLeft, event=${evt.type}`})*/},
      onSlideRight: (evt) => {/*console.log('def onSlideRight, event=%o', evt); this.setState({debug: `def onSlideRight, event=${evt.type}`})*/},
      onPress: (evt) => {/*console.log('def onPress, event=%o', evt); this.setState({debug: `def onPress, event=${evt.type}`})*/},
      onLongPress: (evt) => {/*console.log('def onLongPress, event=%o', evt); this.setState({debug: `def onLongPress, event=${evt.type}`})*/},
      onDoublePress: (evt) => {/*console.log('def onDoublePress, event=%o', evt); this.setState({debug: `def onDoublePress, event=${evt.type}`})*/},
    }
    this.handlers = merge({}, this.handlers, this.props)

    this.gState = {
      timestamp: null,
      x0: 0,
      y0: 0,
    }
    this.gEvt = {
      type: [
        ['TL', 'ML', 'BL'],
        ['MT', 'MM', 'MB'],
        ['TR', 'MR', 'BR']
      ],
      id: [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9]
      ],
      x: ['L', 'M', 'R'],
      y: ['U', 'M', 'B']
    }

    // this.state = {
    //   debug: ''
    // }
  }

  getEvt(gs) {
    const x = this.range.x.findIndex(pos => {
      return gs.x0 >= pos.start && gs.x0 < pos.end
    })
    const y = this.range.y.findIndex(pos => {
      return gs.y0 >= pos.start &&  gs.y0 < pos.end
    })
    return {type: this.gEvt.type[x][y], id: this.gEvt.id[x][y], x: this.gEvt.x[x], y: this.gEvt.y[y]}
  }
  detectGesture(gs) {
    if (Math.abs(gs.dx) < DELTA_PRESS_DISTANCE && Math.abs(gs.dy) < DELTA_PRESS_DISTANCE) {
      if (gs.releaseEvt.timestamp - gs.grantEvt.timestamp < LONG_PRESS_TIMEOUT) {
        if (this.gState.timestamp) {
          if (gs.grantEvt.timestamp - this.gState.timestamp < DOUBLE_PRESS_TIMEOUT) {
            if (Math.abs(this.gState.x0 - gs.x0) < DELTA_PRESS_DISTANCE &&
              Math.abs(this.gState.y0 - gs.y0) < DELTA_PRESS_DISTANCE) {
              this.handlers.onDoublePress(this.getEvt(gs))
              this.gState.timestamp = null
              return
            }
          }
        }
        this.handlers.onPress(this.getEvt(gs))
        this.gState.timestamp = gs.grantEvt.timestamp
        this.gState.x0 = gs.x0
        this.gState.y0 = gs.y0
        return
      }
      this.handlers.onLongPress(this.getEvt(gs))
      this.gState.timestamp = null
      return
    }
    if (Math.abs(gs.dx) > SLIDE_DISTANCE && Math.abs(gs.dy) < DELTA_SLIDE_DISTANCE) {
      if (gs.dx > 0) {
        return this.handlers.onSlideRight(this.getEvt(gs))
      }
      return this.handlers.onSlideLeft(this.getEvt(gs))
    }
    if (Math.abs(gs.dy) > SLIDE_DISTANCE && Math.abs(gs.dx) < DELTA_SLIDE_DISTANCE) {
      if (gs.dy > 0) {
        return this.handlers.onSlideDown(this.getEvt(gs))
      }
      return this.handlers.onSlideUp(this.getEvt(gs))
    }
  }

  render() {
    if (this.props.disabledGesture) {
      return <View {...this.props} >
        {this.props.children}
      </View>
    }
    return (
      <View {...this.panResponder.panHandlers} {...this.props} >
        {/*{*/}
          {/*appConf.buildType === 'development' ? <Text style={{*/}
            {/*position: 'absolute',*/}
            {/*right: 0,*/}
            {/*bottom: 0,*/}
            {/*borderStyle: 'solid',*/}
            {/*borderWidth: 1,*/}
            {/*borderColor: 'red'*/}
          {/*}}>{this.state.debug}</Text> : <View />*/}
        {/*}*/}
        {this.props.children}
      </View>
    )
  }
}
GestureView.propTypes = {
  onSlideUp: PropTypes.func,
  onSlideDown: PropTypes.func,
  onSlideLeft: PropTypes.func,
  onSlideRight: PropTypes.func,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  onDoublePress: PropTypes.func,
  disabledGesture: PropTypes.bool,
}

export default GestureView