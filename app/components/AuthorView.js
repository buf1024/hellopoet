
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native'
import PropTypes from 'prop-types'
import {WinWidth, WinPadding} from '../constants/appConsts'
import * as appAct from '../store/actions/app'
import {myTheme} from '../constants/appThemes'

class AuthorView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      authors: this.props.authors ? this.props.authors : [],
      desc: this.props.authors ? this.props.authors[0].desc : '',
      index: 0,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.authors.length > 0) {
      this.setState({index: 0, desc: nextProps.authors[0].desc})
    }
  }
  onAuthor(index) {
    this.setState({desc: this.props.authors[index].desc, index})
  }
  render() {
    const {authors} = this.props
    const theme = myTheme(this.props.settings.theme, this.props.settings.nightMode)

    return (
      <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: theme.backgroundColor}}
        >
          {
            authors.map((it, index) => {
              return <TouchableOpacity activeOpacity={0.5}
                key={index}
                style={{margin: 1,}}
                onPress={() => this.onAuthor(index)}>
                <Text style={[{color: theme.color},
                  styles.name,
                  this.state.index === index ?
                    {color: theme.backgroundColor, backgroundColor: theme.borderColor, borderColor: theme.color}:
                    {color: theme.backgroundColor, backgroundColor: theme.color, borderColor: theme.backgroundColor}
                    ]}>{it.name}</Text>
              </TouchableOpacity>
            })
          }
        </ScrollView>
        <ScrollView showsVerticalScrollIndicator={false}
                    style={styles.descScroll}>
          <Text style={[styles.desc,
            {
              backgroundColor: theme.backgroundColor,
              color: theme.color
            }]}>{this.state.desc}</Text>
        </ScrollView>
      </View>
    )
  }
}
AuthorView.propTypes = {
  authors: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: WinWidth,
  //  backgroundColor: 'white',
    paddingLeft: WinPadding,
    paddingRight: WinPadding,
    paddingBottom: 3,
    paddingTop: 3,
  },
  name: {
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderStyle: 'solid',
  //  borderColor: '#9c9c9c'
  },
  selected: {
  //  backgroundColor: '#1c262a',
  //  color: '#6e6e6e',
  },
  descScroll: {
    height: 200,
    marginTop: 3,
    marginBottom: 3,
  },
  desc: {
    fontSize: 16,
    width: WinWidth - WinPadding*2
  },
})

const mapStateToProps = (state) => {
  return {
    settings: state.app.settings
  }
}

export default connect(mapStateToProps, {
  updateSettings: appAct.updateSettings
})(AuthorView)


