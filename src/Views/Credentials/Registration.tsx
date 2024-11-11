import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import TranspBgrViewProps from '../../RenderProps/TranspBgrView';
import ViewWrapper from '../../Components/ViewWrapper/ViewWrapper';


const Registration = () => {
  const { colors } = useTheme();
  const styles = themeStyle(colors);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const navigate = () => {
    navigation.navigate('login');
  };

  return (
    <ViewWrapper>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text variant="displayMedium" style={styles.title}>EversPass</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text variant="headlineLarge" style={styles.title}>Create Account</Text>
          <TranspBgrViewProps paddingVertical={5} />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="grey"
          />
          <TextInput
            autoCapitalize="none"
            secureTextEntry
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="grey"
          />
          <TranspBgrViewProps paddingVertical={5} />
          <Button
            mode="contained"
            onPress={() => {}}>
            Sign Up
          </Button>

          <TranspBgrViewProps paddingVertical={30} />
          <View style={styles.loginView}>
            <Text variant="titleSmall">
              Already have an account?{' '}
              <TouchableWithoutFeedback onPress={navigate}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableWithoutFeedback>
            </Text>
          </View>
        </View>
      </View>
    </ViewWrapper>
  );
};

const themeStyle = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1116',
  },
  logoContainer: {
    flex: 0.25,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  contentContainer: {
    flex: 0.5,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    textAlign: 'center',
    color: 'white',
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.onPrimary,
    color: colors.onPrimaryContainer,
    borderRadius: 5,
  },
  loginView: {
    alignItems: 'center',
  },
  loginLink: {
    color: colors.onPrimaryContainer,
  },
});

export type RootStackParamList = {
  login: undefined; // undefined becuase login component requires no props
  registration: undefined;
};

export default Registration;
