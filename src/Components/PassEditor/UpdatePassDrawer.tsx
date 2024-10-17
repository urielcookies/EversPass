import { Linking, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';

import BottomDrawer from '../BottomDrawer/BottomDrawer';
import { PassCodeType } from '../../Configs/interfaces/PassCodeData';
import { forEach, isEmpty, isEqual } from 'lodash';

type Props = {
	closeDrawer: any,
	gotoTestScreen: any,
  data: PassCodeType,
}

const CreatePassDrawer = (props: Props) => {
	const { closeDrawer, data, gotoTestScreen } = props;

	const { colors } = useTheme();
  const styles = themeStyle(colors);

  const launchWebsiteHandler = () => {
    const url = data.passData.website;
    if (url) {
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(formatUrl(url));
        } else {
          console.log("Don't know how to open URI: " + url);
        }
      });
    }
  };

  const copyField = (field: string) => {
    Clipboard.setString(data.passData[field]);
  };

  const baseHeights: Record<SecurityType, number> = {
    PASSWORD: 0.40,
    CREDITCARD: 0.45,
    PERSONALINFO: 0.25,
    SECURENOTE: 0.25,
  };

  const additionalFields = ['website', 'note'];

  const calculateCustomHeight = (formData: PassCodeType) => {
    // Default to 0.25 if securityType is not found
    let customHeight = baseHeights[formData.securityType] || 0.25;

    forEach(additionalFields, (field) => {
      if (!isEmpty(formData.passData[field])) {
        customHeight += 0.05;
      }
    });

    return customHeight;
  };

  return (
		<BottomDrawer
			handleCloseBottomSheet={closeDrawer}
			height={calculateCustomHeight(data)}>
			<View style={styles.bottomDrawerContent}>
				<View style={styles.bottomDrawerTitle}>
					<Text style={styles.bottomDrawerTitleText} variant="headlineSmall">UPDATE</Text>
				</View>

				<View style={styles.bottomDrawerOptions}>
          {isEqual(data.securityType, 'PASSWORD') && (
            <>
              <TouchableWithoutFeedback onPress={() => copyField('username')}>
                <View style={styles.bottomDrawerOption}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    style={styles.bottomDrawerOptionIcons}
                    size={25} />
                  <Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                    &nbsp;Copy Username
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={() => copyField('password')}>
                <View style={styles.bottomDrawerOption}>
                  <MaterialCommunityIcons
                    name="asterisk"
                    style={styles.bottomDrawerOptionIcons}
                    size={25} />
                  <Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                    &nbsp;Copy Password
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <Divider bold />
            </>
          )}

          {isEqual(data.securityType, 'CREDITCARD') && (
            <>
              <TouchableWithoutFeedback onPress={() => copyField('cardholder')}>
                <View style={styles.bottomDrawerOption}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    style={styles.bottomDrawerOptionIcons}
                    size={25} />
                  <Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                    &nbsp;Copy Cardholder Name
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={() => copyField('cardNumber')}>
                <View style={styles.bottomDrawerOption}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    style={styles.bottomDrawerOptionIcons}
                    size={25} />
                  <Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                    &nbsp;Copy Card Number
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={() => copyField('CVV')}>
                <View style={styles.bottomDrawerOption}>
                  <MaterialCommunityIcons
                    name="asterisk"
                    style={styles.bottomDrawerOptionIcons}
                    size={25} />
                  <Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                    &nbsp;Copy CVC / CVV
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <Divider bold />
            </>
          )}

          {!isEmpty(data.passData.website) && (
            <>
              <TouchableWithoutFeedback onPress={launchWebsiteHandler}>
                <View style={styles.bottomDrawerOption}>
                  <MaterialCommunityIcons
                    name="arrow-top-right-bold-box-outline"
                    style={styles.bottomDrawerOptionIcons}
                    size={25} />
                  <Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                    &nbsp;Launch Website
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <Divider bold />
            </>
          )}

          {!isEmpty(data.passData.note) && (
            <>
              <TouchableWithoutFeedback onPress={() => copyField('note')}>
                <View style={styles.bottomDrawerOption}>
                  <MaterialCommunityIcons
                    name="note-edit-outline"
                    style={styles.bottomDrawerOptionIcons}
                    size={25} />
                  <Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                    &nbsp;Copy Notes
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <Divider bold />
            </>
          )}

					<TouchableWithoutFeedback onPress={gotoTestScreen}>
						<View style={styles.bottomDrawerOption}>
							<MaterialCommunityIcons
								name="pencil-outline"
								style={styles.bottomDrawerOptionIcons}
								size={25} />
							<Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                &nbsp;Edit
              </Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback onPress={gotoTestScreen}>
						<View style={styles.bottomDrawerOption}>
							<MaterialCommunityIcons
								name="paperclip"
								style={styles.bottomDrawerOptionIcons}
								size={25} />
							<Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                &nbsp;Attach File
              </Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback onPress={gotoTestScreen}>
						<View style={styles.bottomDrawerOption}>
							<MaterialCommunityIcons
								name="delete-outline"
								style={styles.bottomDrawerOptionIcons}
								size={25} />
							<Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                &nbsp;Move to Trash
              </Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</View>
		</BottomDrawer>
	);
};

const themeStyle = (colors: MD3Colors) => StyleSheet.create({
	bottomDrawerContent: {
		height: '100%',
		justifyContent: "space-between",
		// backgroundColor: 'blue',
	},
	bottomDrawerTitle: {
		height: '15%',
		// backgroundColor: 'yellow'
	},
	bottomDrawerTitleText: {
		fontSize: 25,
		fontWeight: 'bold',
	},
	bottomDrawerOptions: {
		justifyContent: 'space-evenly',
		height: '85%',
		// backgroundColor: 'red',
	},
	bottomDrawerOption: {
    flexDirection: 'row',
  },
		bottomDrawerOptionIcons: {
			color: colors.onSecondaryContainer,
  },
	bottomDrawerOptionFont: {
		fontSize: 20,
	},
	divider: {
		// color: colors.onSecondaryContainer,
		// color: 'red',
	}
});

const formatUrl = (url: string) => {
  if (!/^https?:\/\//i.test(url)) {
    return `http://${url}`;
  }
  return url;
};

// Define the type for the keys of baseHeights
type SecurityType = 'PASSWORD' | 'CREDITCARD' | 'PERSONALINFO' | 'SECURENOTE';

// Define the PassCodeType interface
interface PassCodeType {
  securityType: SecurityType;
  passData: {
    [key: string]: any;
  };
}

export default CreatePassDrawer;
