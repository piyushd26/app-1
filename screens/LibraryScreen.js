import React from 'react';
import {View, Text, StyleSheet, StatusBar, Platform, FlatList, BackHandler} from 'react-native';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import {connect} from 'react-redux';
import Track from '../components/track/track';
import {playTrack, togglePlayerMode} from '../actions';
import connectAlert from '../components/alert/connectAlert.component';

let redirectToPlayer = false;

class LibraryScreen extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    if (redirectToPlayer) {
      this.props.togglePlayerMode();
      return true;
    } else {
      return false;
    }
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  render() {
    const {navigation} = this.props;
    redirectToPlayer = navigation.getParam('redirectToPlayer', false);
    return (
        <View style={{flex: 1, backgroundColor: Colors.backgroundColor, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20}}>
          <Text style={{color: Colors.fontColor, alignSelf: 'center', fontSize: 18}}>Queue</Text>
          <FlatList
              data={this.props.queue}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              style={{flex: 1, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={styles.contentContainer}
              ListEmptyComponent={<View style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: Colors.tabIconDefault}}>Your queue is empty</Text>
              </View>}
          />
        </View>
    );
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => (
      <Track track={item} origin="queue"/>
  );
}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  songInfoContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  contentContainer: {
    paddingTop: 0,
  },
  playButtonContainer: {
    padding: 0,
    margin: 0,
    flex: 0.1,
  },
  smallPlayerContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 5,
  },
  albumArtPlayerContainer: {
    padding: 10,
    flex: 0.3,
  },
  songInfo: {
    padding: 10,
    marginRight: 10,
    flex: 0.6,
  },
});

export default connectAlert(connect(mapStateToProps, {playTrack, togglePlayerMode})(LibraryScreen));
