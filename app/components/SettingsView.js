
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Switch,
  Slider
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import {WinWidth, WinPadding} from '../constants/appConsts'
import * as appAct from '../store/actions/app'
import {myTheme} from '../constants/appThemes'

class SettingView extends Component {
  constructor(props) {
    super(props)

  }
  componentWillReceiveProps(nextProps) {

  }
  onFontSize(fontSize) {
    this.props.updateSettings({fontSize})
  }

  onTheme(theme) {
    this.props.updateSettings({theme})
  }
  onNightMode(nightMode) {
    this.props.updateSettings({nightMode})
  }
  onFontStyle() {
    const settings = this.props.settings
    let fontStyle = ''
    if (settings.fontStyle === 'zh-CHS') {
      fontStyle = 'zh-CHT'
    } else {
      fontStyle = 'zh-CHS'
    }

    this.props.updateSettings({fontStyle})
  }
  onReadMode() {
    const settings = this.props.settings
    this.props.updateSettings({readMode: !settings.readMode})
  }
  render() {
    const settings = this.props.settings
    const theme = myTheme(this.props.settings.theme, this.props.settings.nightMode)
    return (
      <View style={[
        styles.container,
        {
          backgroundColor: theme.backgroundColor
        }]}>
        <View style={styles.rowContainer}>
          <Text style={[styles.title, {color: theme.color}]}>字号</Text>
          <TouchableOpacity activeOpacity={0.5} onPress={() => this.onFontStyle()}>
            <Text style={[{color: theme.color}, styles.fontStyleText, settings.fontStyle === 'zh-CHS' ? styles.fontStyleUnchecked : styles.fontStyleChecked]}>
              {settings.fontStyle === 'zh-CHS' ? '简' : '繁'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} style={{marginTop: 5}}
                            onPress={() => this.onFontSize(settings.fontSize > 10 ? settings.fontSize - 1: 10)}>
            <Icon name="minus"  style={[styles.fontSizeText, {color: theme.color}]} />
          </TouchableOpacity>
          <Slider style={styles.flex1}
                  onValueChange={(fontSize) => this.onFontSize(fontSize)}
                  step={1}
                  maximumValue={30}
                  minimumValue={10}
                  value={settings.fontSize}
                  thumbTintColor="#eb253f"
                  minimumTrackTintColor="#eb253f"
                  maximumTrackTintColor="#eb253f"
          />
          <TouchableOpacity activeOpacity={0.5} style={{marginTop: 5}}
                            onPress={() => this.onFontSize(settings.fontSize < 30 ? settings.fontSize + 1: 30)}>
            <Icon name="plus" style={[styles.fontSizeText, {color: theme.color}]} />
          </TouchableOpacity>
        </View>
        <View  style={styles.rowContainer}>
          <Text style={[styles.title, {color: theme.color}]}>主题</Text>
          <Text style={styles.flex1} />
          {
            settings.themes.map((it, index) => {
              return (
                <TouchableOpacity activeOpacity={0.5} key={index}
                                  onPress={() => this.onTheme(it)}
                                  style={[styles.themeText, {backgroundColor: it}]}>
                  {
                    it === settings.theme ? <Icon name="check" style={styles.themeCheck} /> : <View />
                  }
                </TouchableOpacity>
              )
            })
          }
        </View>
        <View  style={styles.rowContainer}>
          <Text style={[styles.title, {color: theme.color}]}>夜间模式</Text>
          <Text style={styles.flex1} />
          <Switch
            thumbTintColor={theme.backgroundColor}
            onTintColor={theme.color}
            onValueChange={(value) => this.onNightMode(value)}
            value={settings.nightMode}/>
        </View>
        <View style={styles.rowBottom}>
          <Text style={[styles.title, {color: theme.color}]}>阅读模式</Text>
          <Text style={styles.flex1} />
          <TouchableOpacity activeOpacity={0.5} onPress={() => this.onReadMode()}>
            <Text style={[{color: theme.color}, styles.fontStyleText, {width: 120}, settings.readMode? styles.fontStyleUnchecked : styles.fontStyleChecked]}>
              {settings.readMode ? '全文阅读' : '单句背诵'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: WinWidth,
 //   backgroundColor: 'white',
    padding: WinPadding,
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  flex1: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    paddingTop: 3,
    paddingBottom: 3,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  fontStyleText: {
    width: 50,
    fontSize: 18,
    paddingTop: 3,
    paddingBottom: 3,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginLeft: 30,
    marginRight: 10,
  },
  fontStyleChecked: {
    color: '#eb253f',
    borderColor: '#eb253f'
  },
  fontStyleUnchecked: {
    borderColor: '#9c9c9c'
  },
  fontSizeText: {
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  themeText: {
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#9c9c9c',
    borderRadius: 15,
    marginLeft: 10,
  },
  themeCheck: {
    width: 30,
    height: 30,
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  rowBottom: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10
  }
})

const mapStateToProps = (state) => {
  return {
    settings: state.app.settings
  }
}

export default connect(mapStateToProps, {
  updateSettings: appAct.updateSettings
})(SettingView)


