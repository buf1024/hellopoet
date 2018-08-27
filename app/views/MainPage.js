import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Clipboard,
  ScrollView,
  BackHandler,
  Platform,
  StyleSheet
} from 'react-native'
import * as Progress from 'react-native-progress'
import {DrawerActions} from 'react-navigation'
import Icon from 'react-native-vector-icons/Feather'
import GestureView from '../components/GestureView'
import SettingsView from '../components/SettingsView'
import AuthorView from '../components/AuthorView'
import {WinPadding, WinWidth} from '../constants/appConsts'
import showToast from '../utils/showToast'
import * as appAct from '../store/actions/app'
import * as db from '../store/db'
import {myTheme} from '../constants/appThemes'


class MainPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      readMode: true,
      poetId: 0,
      poet: {
        title: '',
        authors: [],
        content: [],
        contents: [],
        showPoet: [],
        readIndex: -1
      },
      bkDisabledGesture: false,
      disabledGesture: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const {app} = nextProps
    const {context, db, settings} = app
    if (context.poetId !== this.state.poetId && db.shijing.min > 0) {
      this.setState({poetId: context.poetId})
      this.props.navigation.dispatch(DrawerActions.closeDrawer())
      this.getPoet(context.poetId)
    }
    if (settings.readMode !== this.state.readMode) {
      let {poet} = this.state
      if (poet.contents.length > 0) {
        let showPoet = []
        let readIndex = -1
        showPoet.push(poet.title)
        if (settings.readMode) {
          showPoet.push({authors: poet.authors})
          showPoet = showPoet.concat(poet.contents)
        }
        poet.showPoet = showPoet
        poet.readIndex = readIndex
        if (this.state.bkDisabledGesture) {
          if (!settings.readMode) {
            this.setState({disabledGesture: false})
          } else {
            this.setState({disabledGesture: this.state.bkDisabledGesture})
          }
        }

        this.setState({poet, readMode: settings.readMode})
      }
    }
    if (context.showSettings || context.showSearch || context.showAuthor) {
      if (this.state.bkDisabledGesture) {
        this.setState({disabledGesture: false})
      }
    }
  }
  onBackPress() {
    let lastTime = Date.now()
    if (!this.props.navigation.isFocused()) {
      return false
    }
    if (this.lastTime === undefined || lastTime - this.lastTime > 3000) {
      this.lastTime = lastTime
      showToast('再按一次返回键退出程序')
    } else {
      const {context} = this.props.app
      db.updateLastPoetId(context.poetId)
      this.props.resetApplication()
      BackHandler.exitApp()
    }
    return true
  }
  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress.bind(this))
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress.bind(this))
    }
  }
  componentDidMount() {
  }

  getPoet(poetId) {
    let poet = db.getPoetById(poetId)
    if (poet) {
      let title = poet.title
      let authors = [{name: '诗经', desc: '诗经'}]
      if (poet.author) {
        authors = db.getAuthorByPoetIdName(poetId, poet.author)
        if (authors.length <= 0) {
          authors = [{name: '未知', desc: '查无记录'}]
        }
      }
      let content = poet.content
      let tmpContents = content.split('。')
        .filter(text => text.length > 0)
        .map(text => text.endsWith('？') || text.endsWith('！') ? text : text + '。')
      let contents = []
      tmpContents.forEach(text => {
        if (text.indexOf('？') > 0) {
          let tmpTexts = text.split('？')
            .filter(txt => txt.length > 0)
            .map(txt => txt.endsWith('。') || txt.endsWith('！') ? txt : txt + '？')
          if (tmpTexts.length > 0) {
            contents = contents.concat(tmpTexts)
          }
          return
        }
        if (text.indexOf('！') > 0) {
          let tmpTexts = text.split('！')
            .filter(txt => txt.length > 0)
            .map(txt => txt.endsWith('。') || txt.endsWith('？') ? txt : txt + '！')
          if (tmpTexts.length > 0) {
            contents = contents.concat(tmpTexts)
          }
          return
        }
        contents.push(text)
      })

      let showPoet = []
      let readIndex = -1
      showPoet.push(title)
      if (this.props.app.settings.readMode) {
        showPoet.push({authors})
        showPoet = showPoet.concat(contents)
      }
      this.setState({
        poet: {
          title,
          authors,
          content,
          contents,
          showPoet,
          readIndex
        },
        bkDisabledGesture: false,
        disabledGesture: false
      })
    }
  }

  onSlideRight(evt) {
    if (evt.x === 'L') {
      this.props.navigation.toggleDrawer()
      return
    }
    const {context, db} = this.props.app
    if (context.poetId <= db.poetTang.min) {
      showToast('已经是最前一首')
      return
    }
    this.props.updateContext({poetId: context.poetId - 1})
  }

  onSlideLeft() {
    const {context, db} = this.props.app
    if (context.poetId >= db.shijing.max) {
      showToast('已经是最后一首')
      return
    }
    this.props.updateContext({poetId: context.poetId + 1})
  }

  onSlideUp() {
    const {context} = this.props.app
    if (context.showSearch) {
      if (this.state.readMode && this.state.bkDisabledGesture) {
        this.setState({disabledGesture: this.state.bkDisabledGesture})
      }
      this.props.updateContext({showSearch: false})
      return
    }
    if (!context.showSettings) {
      this.props.updateContext({showSettings: true})
    }
  }

  onSlideDown() {
    const {context} = this.props.app
    if (context.showSettings || context.showAuthor) {
      if (this.state.readMode && this.state.bkDisabledGesture) {
        this.setState({disabledGesture: this.state.bkDisabledGesture})
      }
      if (context.showSettings) {
        this.props.updateContext({showSettings: false})
      }
      if (context.showAuthor) {
        this.props.updateContext({showAuthor: false})
      }
      return
    }
    if (!context.showSearch) {
      this.props.updateContext({showSearch: true})
    }
  }

  onPress() {
    if (!this.props.app.settings.readMode) {
      let {poet} = this.state
      if (poet.readIndex === -1) {
        poet.showPoet.push({authors: poet.authors})
        poet.readIndex += 1
      } else {
        if (poet.readIndex < poet.contents.length) {
          this.state.poet.showPoet.push(poet.contents[poet.readIndex])
          poet.readIndex += 1
        } else {
          poet.showPoet = []
          poet.readIndex = -1
          poet.showPoet.push(poet.title)
        }
      }
      this.setState({poet})
    }
  }

  onLongPress() {
    Clipboard.setString(this.state.poet.title + '\n' +
      '    作者：' + this.state.poet.authors[0].name + '\n' +
      this.state.poet.content)
    showToast('诗词已经复制到剪切板')
  }

  onDoublePress() {
  }

  onSearchFocus() {
    this.props.updateContext({showSearch: false})
    this.props.navigation.navigate({
      routeName: 'SearchPage',
      key: 'SearchPage'
    })
  }

  onLayout(layout) {
    if (this.state.bkDisabledGesture) {
      return
    }
    if (layout.y <= 0) {
      let disabledGesture = true
      if (this.props.app.context.showSearch ||
        this.props.app.context.showSettings ||
        this.props.app.context.showAuthor ||
        !this.state.readMode
      ) {
        disabledGesture = false
      }
      this.setState({disabledGesture, bkDisabledGesture: true})
    } else {
      this.setState({disabledGesture: false, bkDisabledGesture: false})
    }
  }

  onShowAuthor() {
    this.props.updateContext({
      showSearch: false,
      showSettings: false,
      showAuthor: true,
      disabledGesture: !this.state.readMode ?
        this.state.disabledGesture : this.state.bkDisabledGesture
    })
  }

  getWaitView() {
    const theme = myTheme(this.props.app.settings.theme, this.props.app.settings.nightMode)
    return <View style={[styles.container, {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor
    }]}>
      <StatusBar hidden/>
      <Progress.Circle
        style={{margin: 10}}
        size={60}
        borderWidth={0}
        color={'rgb(39, 139, 54)'}
        progress={this.props.app.context.init}/>
      <Text style={{color: theme.color}}>{this.props.app.context.initMsg}</Text>
    </View>
  }

  render() {
    const theme = myTheme(this.props.app.settings.theme, this.props.app.settings.nightMode)
    if (this.props.app.context.init < 1) {
      return this.getWaitView()
    }
    return <View style={[
      styles.container,
      {backgroundColor: theme.backgroundColor}
    ]}>
      <StatusBar hidden/>
      <GestureView
        onSlideRight={(evt) => this.onSlideRight(evt)}
        onSlideLeft={(evt) => this.onSlideLeft(evt)}
        onSlideDown={(evt) => this.onSlideDown(evt)}
        onSlideUp={(evt) => this.onSlideUp(evt)}
        onPress={(evt) => this.onPress(evt)}
        onDoublePress={(evt) => this.onDoublePress(evt)}
        onLongPress={(evt) => this.onLongPress(evt)}
        disabledGesture={this.state.disabledGesture}
        style={[styles.gestureContainer,
          {borderRadius: 0}, {...StyleSheet.absoluteFillObject}]}>
        <ScrollView
          contentContainerStyle={{
            flex: this.state.disabledGesture ? 0 : 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          showsVerticalScrollIndicator={false}>
          {
            this.state.poet.showPoet.map((line, index) => {
              if (line.authors) {
                return <View key={index} style={styles.authorContainer}>
                  <Text style={[
                    {
                      fontSize: this.props.app.settings.fontSize - 2,
                      color: theme.color
                    },
                    styles.authorText]}>作者：</Text>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => this.onShowAuthor()}>
                    <Text style={[
                      styles.authorBtn,
                      {
                        fontSize: this.props.app.settings.fontSize - 4,
                        color: theme.color,
                        borderColor: theme.borderColor
                      }]}>{line.authors[0].name}</Text>
                  </TouchableOpacity>
                </View>
              }
              return <Text
                onLayout={index === 0 ? (event) => this.onLayout(event.nativeEvent.layout) : () => {
                }}
                style={[
                  {
                    fontSize: this.props.app.settings.fontSize,
                    color: theme.color
                  },
                  styles.poetText]}
                key={index}>{line}</Text>
            })
          }
        </ScrollView>
      </GestureView>
      {
        this.props.app.context.showSearch ?
          <View style={styles.searchContainer}>
            <Icon name="search" style={styles.searchButton}/>
            <TextInput style={styles.searchInput}
                       underlineColorAndroid="transparent"
                       placeholder="搜索作者/诗词"
                       onFocus={() => this.onSearchFocus()}
            />
          </View>
          : <View/>
      }
      {
        this.props.app.context.showSearch ?
          <GestureView onSlideUp={() => this.onSlideUp()}
                       onPress={() => this.onSlideUp()}
                       style={styles.blurView}/>
          : <View/>
      }
      {
        this.props.app.context.showSettings ? <SettingsView/> : <View/>
      }
      {
        this.props.app.context.showAuthor ? <AuthorView authors={this.state.poet.authors}/> : <View/>
      }
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gestureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchContainer: {
    position: 'absolute',
    left: 40,
    top: 10,
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: '#fff',
    opacity: 0.6,
    zIndex: 1000
  },
  searchButton: {
    fontSize: 20,
    height: 30,
    lineHeight: 30,
    textAlign: 'center',
    paddingLeft: 5
  },
  searchInput: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderColor: 'gray',
    padding: 0,
    height: 30,
    lineHeight: 30,
    textAlign: 'left',
    paddingLeft: 5,
    width: 250
  },
  blurView: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2a2a2a',
    zIndex: 500,
    opacity: 0.3
  },
  authorContainer: {
    width: WinWidth - WinPadding * 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  authorText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: 3,
    paddingBottom: 3
  },
  authorBtn: {
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 1,
    borderWidth: 1,
    borderRadius: 3,
    borderStyle: 'solid'
//    borderColor: '#9c9c9c'
  },
  poetText: {
    width: WinWidth - WinPadding * 2,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: 3,
    paddingBottom: 3
  }
})
const mapStateToProps = (state) => {
  return {
    app: state.app
  }
}
export default connect(mapStateToProps, {
  updateContext: appAct.updateContext,
  resetApplication: appAct.resetApplication
})(MainPage)
