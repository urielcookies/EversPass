import { Linking, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomDrawer from '../BottomDrawer/BottomDrawer';
import { PassCodeType } from '../../Configs/interfaces/PassCodeData';

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

  return (
		<BottomDrawer
			handleCloseBottomSheet={closeDrawer}
			height={0.65}>
			<View style={styles.bottomDrawerContent}>
				<View style={styles.bottomDrawerTitle}>
					<Text style={styles.bottomDrawerTitleText} variant="headlineSmall">UPDATE</Text>
				</View>

				<View style={styles.bottomDrawerOptions}>
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

					<TouchableWithoutFeedback onPress={gotoTestScreen}>
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

					<TouchableWithoutFeedback onPress={gotoTestScreen}>
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
		height: '10%',
		// backgroundColor: 'yellow'
	},
	bottomDrawerTitleText: {
		fontSize: 25,
		fontWeight: 'bold',
	},
	bottomDrawerOptions: {
		justifyContent: "space-evenly",
		height: '90%',
		// backgroundColor: 'red'
	},
	bottomDrawerOption: {
    flexDirection: 'row',
  },
		bottomDrawerOptionIcons: {
			color: colors.onSecondaryContainer,
  },
	bottomDrawerOptionFont: {
		fontSize: 22.5
	},
	divider: {
		// color: colors.onSecondaryContainer,
		color: 'red'
	}
});

const formatUrl = (url: string) => {
  if (!/^https?:\/\//i.test(url)) {
    return `http://${url}`;
  }
  return url;
};

export default CreatePassDrawer;
