import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  StyleSheet,
  RefreshControl
} from 'react-native'
import HeaderBarView from '../components/HeaderBarView'
import Icon from 'react-native-vector-icons/Feather'
import GestureView from '../components/GestureView'
import showToast from '../utils/showToast'
import {delBookmark, getBookmarks} from '../store/db'
import {WinWidth, WinPadding} from '../constants/appConsts'
import * as appAct from '../store/actions/app'
import {myTheme} from '../constants/appThemes'

class BookmarkPage extends Component {

  constructor(props) {
    super(props)
    this.pageSize = 25
    this.offset = 0
    this.state = {
      refreshing: false,
      poets: []
    }
  }

  componentWillReceiveProps(nextProps) {

  }

  componentDidMount() {
    this.getNextBookmarks()
  }

  getNextBookmarks() {
    let poets = getBookmarks(this.offset * this.pageSize, (this.offset + 1) * this.pageSize)
    if (poets.length > 0) {
      this.state.poets = this.state.poets.concat(poets)
      this.setState({poets: this.state.poets})

      this.offset += 1
    }
    return poets
  }

  getDateStr(date) {
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let day = date.getDate()

    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()

    return '' + year + '-' + (month < 10 ? '0' + month : month) + '-' + day + ' ' +
      (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' +
      (seconds < 10 ? '0' + seconds : seconds)
  }
  showMore() {
    this.setState({refreshing: true})
    let poets = this.getNextBookmarks()
    if (poets.length <= 0) {
      showToast('已经全部加载，无更多数据！')
    }
    this.setState({refreshing: false})
  }
  onItemSlideRight(poet) {
    if (poet.showDel) {
      poet.showDel = false
      this.setState({poets: this.state.poets})
    }
  }
  onItemSlideLeft(poet) {
    if (!poet.showDel) {
      poet.showDel = true
      this.setState({poets: this.state.poets})
    }
  }
  onDelBookmark(poet) {
    delBookmark(poet.id)
    let index = this.state.poets.findIndex((it) => {
      return it.id === poet.id
    })
    if (index >= 0) {
      this.state.poets.splice(index, 1)
      this.setState({poets: this.state.poets})
    }
  }
  onPoet(poet) {
    this.props.updateContext({poetId: poet.id})
    this.props.navigation.goBack()
  }
  getItemView(poet) {
    const width = poet.showDel ? 20: 25
    let {title, content} = poet
    const lenTitle = Math.round(title.length * 1.5)
    const lenCont = width - lenTitle
    if (lenCont > 0) {
      if (content.length > lenCont) {
        const start = Math.floor((content.length - lenCont) / 2)
        content = content.substring(start, start + lenCont)
      }
    } else {
      content = ''
    }
    const theme = myTheme(this.props.app.settings.theme, this.props.app.settings.nightMode)

    return <GestureView
      onSlideRight={(evt) => this.onItemSlideRight(poet)}
      onSlideLeft={(evt) => this.onItemSlideLeft(poet)}
      key={poet.id}
      style={[styles.itemView, {backgroundColor: theme.backgroundColor, borderColor: theme.borderColor}]}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.itemButton}
        onPress={() => this.onPoet(poet)}>
        <Text style={[styles.itemTitle, {color: theme.color}]}>{title}</Text>
        <View style={[styles.itemContentContainer, {backgroundColor: theme.backgroundColor}]}>
          <Text style={[styles.itemContent, {color: theme.color}]}>... {content} ...</Text>
          <Text style={[styles.itemDate, {color: theme.color}]}>{this.getDateStr(poet.date)}</Text>
        </View>
      </TouchableOpacity>
      {
        poet.showDel ? <View style={styles.itemDelContainer}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => this.onDelBookmark(poet)}>
            <Icon name="trash-2" style={styles.itemDelText} />
        </TouchableOpacity>
        </View> : <View />
      }
    </GestureView>
  }
  getNoDataView() {
    const theme = myTheme(this.props.app.settings.theme, this.props.app.settings.nightMode)
    return <View style={{
      flex: 1, justifyContent: 'center', alignItems: 'center',
      backgroundColor: theme.backgroundColor
    }}>
      <Icon name="cloud-drizzle" style={{fontSize: 30, color: theme.color}} />
      <Text  style={{
        marginTop: 10,
        fontSize: 20,
        color: theme.color
      }}>~~查无收藏数据~~</Text>
    </View>
  }
  render() {
    const theme = myTheme(this.props.app.settings.theme, this.props.app.settings.nightMode)

    return <View
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <StatusBar hidden/>
      <HeaderBarView navigation={this.props.navigation} />
      {
        this.state.poets.length > 0 ?
          <ScrollView showsVerticalScrollIndicator={false} refreshControl={
            <RefreshControl
              colors={['#d4c396', '#bed0e2', '#c7eac7', '#e0e0e0', '#ffb1a3']}
              refreshing={this.state.refreshing}
              onRefresh={() => this.showMore()}
            />
          }>
            {
              this.state.poets.map((it) => {
                return this.getItemView(it)
              })}
            <TouchableOpacity activeOpacity={0.5} style={styles.flex1} onPress={() => this.showMore()}>
              <Text style={[styles.moreText, {color: theme.color}]}>更多</Text>
            </TouchableOpacity>
          </ScrollView>
          : this.getNoDataView()
      }
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemView: {
    width: WinWidth - WinPadding*2,
    height: 50,
//    borderColor: '#9c9c9c',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  itemButton: {
    flex: 1,
    flexDirection: 'row'
  },
  itemTitle: {
    height: 50,
    lineHeight: 50,
    fontSize: 18,
    margin: 3,
    marginLeft: 0,
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  itemContentContainer: {
    height: 50,
    marginLeft: 8,
  },
  itemContent: {
    height: 30,
    lineHeight: 30,
    fontSize: 12,
    padding: 0,
  },
  itemDate: {
    height: 10,
    lineHeight: 10,
    padding: 0,
    fontSize: 8
  },
  itemDelContainer: {
    height: 44,
    width: 50,
    marginTop: 3,
    marginBottom: 3,
    backgroundColor: '#e3393c'
  },
  itemDelText: {
    textAlignVertical: 'center',
    textAlign: 'center',
    height: 44,
    lineHeight: 44,
    color: '#fff',
    fontSize: 20,
  },
  moreText: {
    flex: 1,
    height: 40,
    lineHeight: 40,
    fontSize: 18,
    margin: 3,
    marginLeft: 8,
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  flex1: {
    flex: 1
  }
})
const mapStateToProps = (state) => {
  return {
    app: state.app
  }
}
export default connect(mapStateToProps, {
  updateContext: appAct.updateContext
})(BookmarkPage)
