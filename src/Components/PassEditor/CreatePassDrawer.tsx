import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomDrawer from '../BottomDrawer/BottomDrawer';

type Props = {
	closeDrawer: any,
	gotoTestScreen: any,
}

const CreatePassDrawer = (props: Props) => {
	const { closeDrawer, gotoTestScreen } = props;

	const { colors } = useTheme();
  const styles = themeStyle(colors);

  return (
		<BottomDrawer
			handleCloseBottomSheet={closeDrawer}
			height={0.35}>
			<View style={styles.bottomDrawerContent}>
				<View style={styles.bottomDrawerTitle}>
					<Text style={styles.bottomDrawerTitleText} variant="headlineSmall">Add New</Text>
				</View>

				<View style={styles.bottomDrawerOptions}>
					<TouchableWithoutFeedback onPress={gotoTestScreen}>
						<View style={styles.bottomDrawerOption}>
							<MaterialCommunityIcons
								name="form-textbox-password"
								style={styles.bottomDrawerOptionIcons}
								size={25} />
							<Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>&nbsp;Password</Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback onPress={gotoTestScreen}>
						<View style={styles.bottomDrawerOption}>
							<MaterialCommunityIcons
								name="note-text-outline"
								style={styles.bottomDrawerOptionIcons}
								size={25} />
							<Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>&nbsp;Secure Note</Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback onPress={gotoTestScreen}>
						<View style={styles.bottomDrawerOption}>
							<MaterialCommunityIcons
								name="credit-card-outline"
								style={styles.bottomDrawerOptionIcons}
								size={25} />
							<Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>&nbsp;Credit Card</Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback onPress={gotoTestScreen}>
						<View style={styles.bottomDrawerOption}>
							<MaterialCommunityIcons
								name="badge-account-horizontal-outline"
								style={styles.bottomDrawerOptionIcons}
								size={25} />
							<Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>&nbsp;Personal Info</Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback onPress={gotoTestScreen}>
						<View style={styles.bottomDrawerOption}>
							<MaterialCommunityIcons
								name="folder-outline"
								style={styles.bottomDrawerOptionIcons}
								size={25} />
							<Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>&nbsp;Folder</Text>
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
		// backgroundColor: 'blue'
	},
	bottomDrawerTitle: {
		height: '20%',
		// backgroundColor: 'yellow'
	},
	bottomDrawerTitleText: {
		fontSize: 25,
		fontWeight: 'bold',
	},
	bottomDrawerOptions: {
		justifyContent: "space-evenly",
		height: '80%',
		// backgroundColor: 'red'
	},
	bottomDrawerOption: {
    flexDirection: 'row'
  },
		bottomDrawerOptionIcons: {
			color: colors.onSecondaryContainer
  },
	bottomDrawerOptionFont: {
		fontSize: 22.5
	},
});

export default CreatePassDrawer;
