import React, {Component} from 'react';
import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Dimensions,
} from 'react-native';

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 150 : 163;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(
        // iOS has negative initial scroll value because content inset...
        Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
      ),
      refreshing: false,
    };
  }

  _renderScrollViewContent() {
    const data = Array.from({length: 30});
    return (
      <View style={styles.scrollViewContent}>
        {[...Array(10)].map((_, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.paragraph}>
              Hello, I'm John Doe! I'm a passionate developer exploring the
              world of React Native
            </Text>
          </View>
        ))}
      </View>
    );
  }

  render() {
    // Because of content inset the scroll value will be negative on iOS so bring
    // it back to 0.
    const scrollY = Animated.add(
      this.state.scrollY,
      Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
    );
    const headerTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const textOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0.5, 1],
      extrapolate: 'clamp',
    });
    const imageTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    const titleScale = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const titleTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [-10, -20, -40],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.fill}>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="rgba(0, 0, 0, 0.251)"
        />
        <Animated.ScrollView
          style={styles.fill}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
            {useNativeDriver: true},
          )}
          contentInset={{
            top: HEADER_MAX_HEIGHT,
          }}
          contentOffset={{
            y: -HEADER_MAX_HEIGHT,
          }}>
          {this._renderScrollViewContent()}
        </Animated.ScrollView>
        <Animated.View
          pointerEvents="none"
          style={[styles.header, {transform: [{translateY: headerTranslate}]}]}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Animated.Image
              style={[
                styles.backgroundImage,
                {
                  transform: [{scale: imageTranslate}],
                },
              ]}
              source={require('./assets/user.png')}
            />
            <Animated.View
              style={[
                styles.bar,
                {
                  opacity: textOpacity,
                  transform: [{translateX: titleTranslate}],
                },
              ]}>
              <Text style={styles.title}>Hi, John Doe</Text>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#EDEFEC',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
    borderBottomWidth: 1,
    borderColor: '#848784',
  },
  backgroundImage: {
    top: 180,
    left: 20,
    right: 0,
    height: 100,
    width: 100,
    resizeMode: 'cover',
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 15 : 20,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
  },
  title: {
    color: '#848784',
    fontSize: 18,
  },
  scrollViewContent: {
    paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
  },
  row: {
    height: 40,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  paragraph: {
    fontSize: 16,
    color: '#848784',
    textAlign: 'center',
  },
});
