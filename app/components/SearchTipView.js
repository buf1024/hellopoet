import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Feather'
import {WinWidth, WinPadding} from '../constants/appConsts'
import {myTheme} from '../constants/appThemes'

class SearchTipView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: this.props.text
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.text !== nextProps.text) {
      this.setState({text: nextProps.text})
    }
  }
  render() {
    const theme = myTheme(this.props.settings.theme, this.props.settings.nightMode)

    return (
      <View style={[styles.tipRow, {
        backgroundColor: theme.backgroundColor,
        borderColor: theme.borderColor
      }]}>
        <TouchableOpacity activeOpacity={0.5}
          style={styles.tipButton}
          onPress={() => this.props.onTipPress(this.props.text)}>
          <View style={styles.tipContent}>
            <Icon  style={[styles.tipIconSearch, {color: theme.color}]} name="search"/>
            <Text style={[styles.tipText, {color: theme.color}]} >{this.state.text}</Text>
          </View>
          <Icon style={[styles.tipArrow, {color: theme.color}]} name="arrow-up-left"/>
        </TouchableOpacity>
      </View>
    )
  }
}
SearchTipView.propTypes = {
  text: PropTypes.string.isRequired,
  onTipPress: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  tipRow: {
    borderBottomWidth: 1,
 //   borderColor: '#9c9c9c',
    borderStyle: 'solid',
    marginLeft: WinPadding,
    //marginRight: WinPadding,
    height: 40,
  },
  tipButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    height: 40,
    paddingTop: 5,
    paddingBottom: 5
  },
  tipContent: {
    flexDirection: 'row',
//    flex: 9
  },
  tipIconSearch: {
    color: '#9c9c9c',
    height: 30,
    lineHeight: 30,
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  tipText: {
    marginLeft: 10,
    height: 30,
    lineHeight: 30,
    fontSize: 15,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  tipArrow: {
    color: '#9c9c9c',
  //  flex: 1,
    height: 30,
    lineHeight: 30,
    fontSize: 20,
    textAlign: 'right',
    textAlignVertical: 'center'
  }
})
const mapStateToProps = (state) => {
  return {
    settings: state.app.settings
  }
}
export default connect(mapStateToProps)(SearchTipView)