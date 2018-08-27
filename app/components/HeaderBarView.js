import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native'

import PropTypes from 'prop-types'
import * as Progress from 'react-native-progress'
import Icon from 'react-native-vector-icons/Feather'
import {WinPadding, WinWidth} from '../constants/appConsts'
import {myTheme} from '../constants/appThemes'

class HeaderBarView extends Component {
  constructor(props) {
    super(props)
  }

  onBack() {
    this.props.navigation.goBack()
  }

  render() {
    const theme = myTheme(this.props.settings.theme, this.props.settings.nightMode)

    return (
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={0.5} style={styles.height} onPress={() => this.onBack()}>
            <Icon name="arrow-left" style={[styles.leftArrow, {color: theme.color}]}/>
          </TouchableOpacity>
          {/*<View style={styles.textContainer}>*/}
            {/**/}
          {/*</View>*/}
        </View>
    )
  }
}
HeaderBarView.propTypes = {
  navigation: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 30,
    padding: WinPadding,
    alignSelf: 'flex-start'
  },
  height: {
    height: 30
  },
  leftArrow: {
    fontSize: 20,
    height: 30,
    lineHeight: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 10,
//    color: '#000'
  }
})
const mapStateToProps = (state) => {
  return {
    settings: state.app.settings
  }
}
export default connect(mapStateToProps)(HeaderBarView)