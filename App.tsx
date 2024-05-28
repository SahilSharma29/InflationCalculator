import React, {useState, useEffect} from 'react';
import Crashes from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App: React.FC = () => {
  const [inflationRate, setInflationRate] = useState<number>(0.0);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.0);
  const [amount, setAmount] = useState<number>(0.0);
  const [timeInYears, setTimeInYears] = useState<number>(1);
  const [afterInflation, setAfterInflation] = useState<number>(0.0);
  const [atRiskFree, setAtRiskFree] = useState<number>(0.0);
  const [atRiskFreeAfterInflation, setAtRiskFreeAfterInflation] =
    useState<number>(0.0);
  const [difference, setDifference] = useState<number>(0);

  useEffect(() => {
    checkPreviousSession();
  }, []);

  const calculateInflationImpact = (
    value: number,
    inflationRate: number,
    time: number,
  ): number => {
    return value / Math.pow(1 + inflationRate, time);
  };

  const calculate = () => {
    const afterInflationValue = calculateInflationImpact(
      amount,
      inflationRate / 100,
      timeInYears,
    );
    const atRiskFreeValue =
      amount * Math.pow(1 + riskFreeRate / 100, timeInYears);
    const atRiskFreeAfterInflationValue = calculateInflationImpact(
      atRiskFreeValue,
      inflationRate / 100,
      timeInYears,
    );
    const differenceValue = atRiskFreeAfterInflationValue - afterInflationValue;

    setAfterInflation(afterInflationValue);
    setAtRiskFree(atRiskFreeValue);
    setAtRiskFreeAfterInflation(atRiskFreeAfterInflationValue);
    setDifference(differenceValue);
  };

  const checkPreviousSession = async () => {
    const didCrash = await Crashes.hasCrashedInLastSession();
    if (didCrash) {
      const report = await Crashes.lastSessionCrashReport();
      alert("Sorry about that crash, we're working on a solution");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Current inflation rate"
        style={styles.textBox}
        keyboardType="decimal-pad"
        onChangeText={text => setInflationRate(parseFloat(text))}
      />
      <TextInput
        placeholder="Current risk free rate"
        style={styles.textBox}
        keyboardType="decimal-pad"
        onChangeText={text => setRiskFreeRate(parseFloat(text))}
      />
      <TextInput
        placeholder="Amount you want to save"
        style={styles.textBox}
        keyboardType="decimal-pad"
        onChangeText={text => setAmount(parseFloat(text))}
      />
      <TextInput
        placeholder="For how long (in years) will you save?"
        style={styles.textBox}
        keyboardType="decimal-pad"
        onChangeText={text => setTimeInYears(parseFloat(text))}
      />
      <Button
        title="Calculate inflation"
        onPress={() => {
          calculate();
          Analytics.trackEvent('calculate_inflation', {
            Internet: 'WiFi',
            GPS: 'Off',
          });
        }}
      />
      <Text style={styles.label}>
        {timeInYears} years from now you will still have ${amount} but it will
        only be worth ${afterInflation}.
      </Text>
      <Text style={styles.label}>
        But if you invest it at a risk free rate you will have ${atRiskFree}.
      </Text>
      <Text style={styles.label}>
        Which will be worth ${atRiskFreeAfterInflation} after inflation.
      </Text>
      <Text style={styles.label}>A difference of: ${difference}.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginHorizontal: 16,
  },
  label: {
    marginTop: 10,
  },
  textBox: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
