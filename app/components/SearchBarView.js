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

class SearchBarView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      placeholder: this.props.placeholder,
      progress: this.props.progress,
      text: ''
    }
  }

  onChangeText(text) {
    this.setState({text})
    this.props.onTextChg(text)
  }
  onClearText() {
    this.setState({text: ''})
    this.props.onTextChg('')
  }
  onBlur() {
    if (this.props.onBlur) {
      this.props.onBlur()
    }
  }
  onBack() {
    if (this.props.onBack) {
      this.setState({text: ''})
      this.props.onBack()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.placeholder !== nextProps.placeholder) {
      this.setState({placeholder: nextProps.placeholder})
    }
    if (this.state.progress !== nextProps.progress) {
      this.setState({progress: nextProps.progress})
    }
    if (typeof(nextProps.searchText) === 'string') {
      if (this.state.text !== nextProps.searchText) {
        this.setState({text: nextProps.searchText})
      }
    }
  }
  render() {
    const theme = myTheme(this.props.settings.theme, this.props.settings.nightMode)

    return (
      <View  {...this.props} style={{padding: WinPadding}} >
        <View style={[styles.flexRow, styles.height]}>
          <TouchableOpacity activeOpacity={0.5} style={styles.height} onPress={() => this.onBack()}>
            <Icon name="arrow-left" style={[styles.leftArrow, {color: theme.color}]}/>
          </TouchableOpacity>
          <View style={styles.textContainer}>
          <TextInput underlineColorAndroid="transparent"
                     returnKeyType="search"
                     placeholder={this.state.placeholder}
                     value={this.state.text}
                     onChangeText={(text) => this.onChangeText(text)}
                     onBlur={() => this.onBlur()}
                     placeholderTextColor={theme.color}
                     style={[styles.textInput, {color: theme.color}]} />
            {
              this.state.text.length > 0 ?
                <TouchableOpacity activeOpacity={0.5} onPress={() => this.onClearText()}
                                  style={[styles.flex1, styles.height]}>
                  <Icon style={[styles.textClear, {color: theme.color}]} name="x-circle" />
                </TouchableOpacity>
                : <View style={styles.flex1} />
            }
          </View>
        </View>
        <Progress.Bar
          style={styles.progress}
          borderWidth={0}
                      color={'rgb(39, 139, 54)'}
                      progress={this.props.progress} height={1}
                      width={WinWidth - WinPadding*2}
                      borderRadius={0} />
        {this.props.children}
      </View>
    )
  }
}
SearchBarView.propTypes = {
  placeholder: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
  onTextChg: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  searchText: PropTypes.string,
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },
  flexRow: {
    flexDirection: 'row'
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
  },
  textContainer: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'rgb(39, 139, 54)',
    borderStyle: 'solid'
  },
  textInput: {
    flex: 9,
    padding: 0,
    height: 30,
  },
  textClear: {
    height: 30,
    lineHeight: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
//    color: '#9c9c9c',
    fontSize: 15
  },
  progress: {
    marginTop: 5,
  }
})
const mapStateToProps = (state) => {
  return {
    settings: state.app.settings
  }
}
export default connect(mapStateToProps)(SearchBarView)