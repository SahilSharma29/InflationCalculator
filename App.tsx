import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import Crashes from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';

type Props = {};

const App = (props: Props) => {
  useEffect(() => {
    checkPreviousVersion();
  }, []);

  const checkPreviousVersion = async () => {
    const didCrash = await Crashes.hasCrashedInLastSession();
    if (didCrash) {
      const report = await Crashes.lastSessionCrashReport();
      // console.log('report', report);
      Alert.alert('Sorry about that crash, we are working on it');
    }
  };
  const sendTrackEvent = () => {
    Analytics.trackEvent('Calculate Inflation');
  };
  return (
    <SafeAreaView>
      <Button title="Calculate Inflation" onPress={sendTrackEvent} />
      {/* <Button
        title="Crash"
        onPress={() => {
          Crashes.generateTestCrash();
        }}
      /> */}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({});
