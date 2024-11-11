import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import TranspBgrViewProps from '../../RenderProps/TranspBgrView';
import ViewWrapper from '../../Components/ViewWrapper/ViewWrapper';


const Login = () => {
  const { colors } = useTheme();
  const styles = themeStyle(colors);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const navigate = () => {
    navigation.navigate('registration');
  };

  return (
    <ViewWrapper>
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text variant="displayMedium" style={styles.title}>EversPass</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text variant="headlineLarge" style={styles.title}>Login</Text>
        <TranspBgrViewProps paddingVertical={5} />
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="grey"
        />
        <TranspBgrViewProps paddingVertical={5} />
        <Button
          mode="contained"
          onPress={() => {}}>
          Continue
        </Button>

        <TranspBgrViewProps paddingVertical={30} />
        <View style={styles.createAccountView}>
          <Text variant="titleSmall">
            New to EversPass?{' '}
            <TouchableWithoutFeedback onPress={navigate}>
              <Text style={styles.createAccountLink}>Create Account</Text>
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
    flex: 0.25, // Adjust this value to control the space for the logo
    justifyContent: 'flex-end', // Align the logo at the bottom of its container
    alignItems: 'center',
    paddingBottom: 10, // Space between logo and the main content
  },
  contentContainer: {
    flex: 0.5, // Adjust this value to control the space for main content
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
  createAccountView: {
    alignItems: 'center',
  },
  createAccountLink: {
    color: colors.onPrimaryContainer,
  },
});

export type RootStackParamList = {
  login: undefined; // undefined becuase login component requires no props
  registration: undefined;
};

export default Login;
