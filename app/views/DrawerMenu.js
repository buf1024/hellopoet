import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import * as appAct from '../store/actions/app'
import showToast from '../utils/showToast'
import {isBookmark, addBookmark, delBookmark, getPoetById} from '../store/db'
import {myTheme} from '../constants/appThemes'

class DrawerMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      poetId: 0,
      isBookmark: false
    }
  }

  onNavigate(page) {
    this.props.navigation.navigate({
      routeName: page,
      key: page
    })
  }
  onReadSettings() {
    const {context} = this.props.app
    this.props.updateContext({showSettings: !context.showSettings, showAuthor: false})
    this.props.navigation.closeDrawer()
  }
  onBookmark() {
    if (this.state.isBookmark) {
      delBookmark(this.state.poetId)
      this.setState({isBookmark: false})
    } else {
      let poet = getPoetById(this.state.poetId)
      if (poet) {
        let bookmark = {
          id: this.state.poetId,
          title: poet.title,
          content: poet.content,
          date: new Date()
        }
        addBookmark(bookmark)
        this.setState({isBookmark: true})
      }
    }
  }
  onPrev() {
    const {context, db} = this.props.app
    if (context.poetId <= db.poetTang.min) {
      showToast('已经是最前一首')
      return
    }
    this.props.updateContext({poetId: context.poetId - 1})
  }
  onNext() {
    const {context, db} = this.props.app
    if (context.poetId >= db.shijing.max) {
      showToast('已经是最后一首')
      return
    }
    this.props.updateContext({poetId: context.poetId + 1})
  }
  onRandom() {
    const {db} = this.props.app
    const min = db.poetSong.min
    const max = db.shijing.max
    const poetId = Math.floor(Math.random() * (max - min)) + min
    this.props.updateContext({poetId})
  }
  componentWillReceiveProps(nextProps) {
    const {context, db} = nextProps.app
    if (context.poetId !== this.state.poetId && db.poetSong.min > 0) {
      this.setState({poetId: context.poetId, isBookmark: isBookmark(context.poetId)})
    }
  }
  render() {
    const theme = myTheme(this.props.app.settings.theme, this.props.app.settings.nightMode)

    return (
      <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <View style={[styles.itemContainer, styles.exMarginTop]}>
          <TouchableOpacity activeOpacity={0.5} style={styles.itemPress} onPress={() => this.onNavigate('BookmarkPage')}>
            <Icon name="bookmark" style={[styles.itemIcon, {color: theme.color}]} />
            <Text style={[styles.itemText, {color: theme.color}]}>我的收藏</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          <TouchableOpacity activeOpacity={0.5} style={styles.itemPress} onPress={() => this.onReadSettings()}>
            <Icon name="settings" style={[styles.itemIcon, {color: theme.color}]} />
            <Text style={[styles.itemText, {color: theme.color}]}>阅读设置</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          <TouchableOpacity activeOpacity={0.5} style={styles.itemPress} onPress={() => this.onNavigate('SearchPage')}>
            <Icon name="search" style={[styles.itemIcon, {color: theme.color}]} />
            <Text style={[styles.itemText, {color: theme.color}]}>诗词搜索</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          <TouchableOpacity activeOpacity={0.5} style={styles.itemPress} onPress={() => this.onNavigate('AboutPage')}>
            <Icon name="info" style={[styles.itemIcon, {color: theme.color}]} />
            <Text style={[styles.itemText, {color: theme.color}]}>关于</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}} />
        <View style={styles.itemContainer}>
          <TouchableOpacity activeOpacity={0.5} style={styles.itemPress} onPress={() => this.onBookmark()}>
            <Icon name="heart" style={[[styles.itemIcon, {color: theme.color}], this.state.isBookmark ? {color: '#eb5a5a'}: {}]} />
            <Text style={[styles.itemText, {color: theme.color}]}>{this.state.isBookmark ? '取消收藏' : '收藏' }</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          <TouchableOpacity activeOpacity={0.5} style={styles.itemPress}>
            <Icon name="share-2" style={[styles.itemIcon, {color: theme.color}]} />
            <Text style={[styles.itemText, {color: theme.color}]}>分享</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          <TouchableOpacity activeOpacity={0.5} style={styles.itemPress} onPress={() => this.onPrev()}>
            <Icon name="skip-back" style={[styles.itemIcon, {color: theme.color}]} />
            <Text style={[styles.itemText, {color: theme.color}]}>前一首</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          <TouchableOpacity activeOpacity={0.5} style={styles.itemPress} onPress={() => this.onNext()}>
            <Icon name="skip-forward" style={[styles.itemIcon, {color: theme.color}]} />
            <Text style={[styles.itemText, {color: theme.color}]}>后一首</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.itemContainer, styles.exMarginBottom]}>
          <TouchableOpacity activeOpacity={0.5} style={styles.itemPress}  onPress={() => this.onRandom()} >
            <Icon name="shuffle" style={[styles.itemIcon, {color: theme.color}]} />
            <Text style={[styles.itemText, {color: theme.color}]}>随机</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
 //  backgroundColor: '#1c262a'
  },
  itemContainer: {
    borderColor: '#181818',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    marginTop: 10,
  },
  itemPress: {
    flexDirection: 'row',
    paddingBottom: 5,
    paddingTop: 5
  },
  itemIcon: {
    marginLeft: 15,
    fontSize: 16,
    //color: '#6e6e6e',
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  itemText: {
    marginLeft: 8,
    fontSize: 15,
    //color: '#6e6e6e',
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  exMarginBottom: {
    marginBottom: 50,
  },
  exMarginTop: {
    marginTop: 50,
  },
})

const mapStateToProps = (state) => {
  return {
    app: state.app
  }
}

export default connect(mapStateToProps, {
  updateContext: appAct.updateContext
})(DrawerMenu)
