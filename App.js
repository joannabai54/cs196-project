import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  PanResponder,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';

const AVATAR_IMAGES = {
  tabbycat: require('./assets/avatars/tabbycat.png'),
  dinosaur: require('./assets/avatars/dinosaur.png'),
  chick: require('./assets/avatars/chick.png'),
  fox: require('./assets/avatars/fox.png'),
  shark: require('./assets/avatars/shark.png'),
}

// FONTS
const customFonts = {
  'ChelseaMarket-Regular': require('./assets/fonts/ChelseaMarket-Regular.ttf'),
  'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  'CenturyGothic': require('./assets/fonts/CenturyGothic.ttf'),
  'CenturyGothicBold': require('./assets/fonts/CenturyGothicBold.ttf'),
  'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
};

const loadFontsAsync = async () => {
  await Font.loadAsync(customFonts);
}

// CLOCK
const getCurrentTime = () => {
  const date = new Date();
  const formattedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  return formattedTime;
};

function HomeScreen({ navigation }) {
  // FONTS
  const [fontsLoaded] = useFonts({
    'ChelseaMarket-Regular': require('./assets/fonts/ChelseaMarket-Regular.ttf'),
    'CenturyGothic': require('./assets/fonts/CenturyGothic.ttf'),
    'CenturyGothicBold': require('./assets/fonts/CenturyGothicBold.ttf'),
    'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const avatarClick = (event, avatarSource) => {
    event.persist()
    navigation.navigate('Calendar Time', { avatar: avatarSource })
  }
  return (
    <View style={styles.homeContainer}>
      <Image style={styles.sun} source={require('./assets/sun.png')}></Image>
      <Text style={styles.header}>Good{'\n'}Morning{'\n'}Joanna{'\n'}{'\n'}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <TouchableOpacity activeOpacity='0.5' style={styles.avatar} onPress={(event) => avatarClick(event, AVATAR_IMAGES['tabbycat'])}>
          <Image
            style={styles.avatar}
            source={AVATAR_IMAGES['tabbycat']}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity='0.5' style={styles.avatar} onPress={(event) => avatarClick(event, AVATAR_IMAGES['dinosaur'])}>
          <Image
            style={styles.avatar}
            source={AVATAR_IMAGES['dinosaur']}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity='0.5' style={styles.avatar} onPress={(event) => avatarClick(event, AVATAR_IMAGES['chick'])}>
          <Image
            style={styles.avatar}
            source={AVATAR_IMAGES['chick']}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

function CalendarScreen({ navigation, route }) {
  // FONTS
  useEffect(() => {
    loadFontsAsync();
  }, []);

  // CLOCK
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // DRAGGABLE AVATAR
  const scrollViewRef = useRef(null);
  const DraggableImage = ({ route }) => {
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 625, y: 25 });

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderGrant: (evt, gestureState) => {
          setDragging(true);
        },
        onPanResponderMove: (evt, gestureState) => {
          setPosition({ x: position.x + gestureState.dx, y: position.y + gestureState.dy });

        },
        onPanResponderRelease: (evt, gestureState) => {
          setDragging(false);
        },
      })
    ).current;

    useEffect(() => {
      if (dragging && scrollViewRef.current) {
        scrollViewRef.current.setNativeProps({
          scrollEnabled: false,
        });
      } else {
        scrollViewRef.current.setNativeProps({
          scrollEnabled: true,
        });
      }
    }, [dragging]);

    return (
      <View
        style={[styles.activityAvatar, { left: position.x, top: position.y }]}
        {...panResponder.panHandlers}
      >
        <Image style={styles.activityAvatar} source={route.params.avatar} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.calendar} ref={scrollViewRef}>
      <DraggableImage route={route} />
      {/* <View style={styles.clock}>
        <Text style={{ fontSize: 38, color: 'white', fontFamily: 'CenturyGothicBold' }}>{currentTime}</Text>
      </View> */}

      <View style={{ flex: 1, left: 40 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.bodyText}>{'\n'}IF IT'S</Text>
          <View style={styles.miniClock}>
            <Text style={{ fontSize: 24, color: 'white', fontFamily: 'CenturyGothicBold' }}>8:45AM</Text>
          </View>
        </View>
        <Text style={styles.bodyText}>THEN IT'S CALENDAR TIME</Text>
      </View>

      <View style={{ flex: 1, marginLeft: 15, marginRight: 15 }}>
        <Image style={{ height: 250, width: '100%', borderRadius: 20 }} source={require('./assets/calendar.png')} />
      </View>
      <View style={{ flex: 4, margin: 10, justifyContent: 'space-between', padding: 20 }}>
        <Text style={styles.bodyText}>DURING CALENDAR TIME...</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, marginLeft: 50 }} >
          <Image style={{ height: 200, width: '30%', borderRadius: 20 }} source={require('./assets/chair.png')} />
          <Text style={styles.taskText}>FIND YOUR SEAT</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, marginLeft: 50 }} >
          <Image style={{ height: 200, width: '30%', borderRadius: 20 }} source={require('./assets/week-days.png')} />
          <Text style={styles.taskText}>SING THE DAYS OF THE{'\n'}WEEK SONG</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, marginLeft: 50 }} >
          <Image style={{ height: 200, width: '30%', borderRadius: 20 }} source={require('./assets/weather.png')} />
          <Text style={styles.taskText}>UPDATE THE WEATHER{'\n'}TRACKER</Text>
        </View>
      </View>

      <View style={{ flex: 1, left: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.bodyText}>{'\n'}IF IT'S</Text>
          <View style={styles.miniClock}>
            <Text style={{ fontSize: 24, color: 'white', fontFamily: 'CenturyGothicBold' }}>9:15AM</Text>
          </View>
        </View>
        <Text style={styles.bodyText}>THEN IT'S STATIONS TIME{'\n'}{'\n'}</Text>
      </View>
    </ScrollView>
  );
};

const Stack = createNativeStackNavigator();

function App() {
  // CLOCK
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen
          name="Calendar Time"
          component={CalendarScreen}
          options={{
            headerTitle: currentTime.toString(),
            headerStyle: {
              backgroundColor: '#FFAC3E',
              height: 96,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 36,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// ReactNative Styles
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 172, 62, 0.8)',
  },
  sun: {
    position: 'absolute',
    width: '85%',
    height: '70%',
    top: 20,
    zIndex: -1,
  },
  header: {
    textAlign: 'center',
    top: 70,
    fontSize: 80,
    lineHeight: 80,
    fontWeight: 'bold',
    fontFamily: 'ChelseaMarket-Regular',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
  },
  avatar: {
    // flex: 1,
    alignSelf: 'center',
    height: 248,
    width: 240
  },
  activityAvatar: {
    height: 188,
    width: 180,
    position: 'absolute',
    zIndex: 2,
  },
  bodyText: {
    color: 'black',
    padding: 10,
    fontFamily: 'CenturyGothicBold',
    lineHeight: 22,
    fontSize: 28,
  },
  taskText: {
    alignSelf: 'center',
    left: 20,
    fontFamily: 'CenturyGothic',
    fontSize: 36
  },
  calendar: {
    backgroundColor: 'rgba(255, 94, 91, 0.25)'
  },
  clock: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 25,
    width: '30%',
    backgroundColor: '#FFAC3E',
    padding: 8,
    borderRadius: 15,
  },
  miniClock: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '15%',
    backgroundColor: '#FFAC3E',
    padding: 5,
    borderRadius: 10,
  }
});

export default App;
