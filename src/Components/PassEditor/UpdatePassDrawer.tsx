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
			height={0.65}>
			<View style={styles.bottomDrawerContent}>
				<View>
					<Text style={styles.bottomDrawerTitle} variant="headlineSmall">UPDATE</Text>
				</View>

				<View style={styles.bottomDrawerOptions}>
					<TouchableWithoutFeedback onPress={gotoTestScreen}>
						<View style={styles.bottomDrawerOption}>
							<MaterialCommunityIcons
								name="form-textbox-password"
								style={styles.bottomDrawerOptionIcons}
								size={25} />
							<Text variant="titleMedium">&nbsp;Password</Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback onPress={gotoTestScreen}>
						<View style={styles.bottomDrawerOption}>
							<MaterialCommunityIcons
								name="note-text-outline"
								style={styles.bottomDrawerOptionIcons}
								size={25} />
							<Text variant="titleMedium">&nbsp;Secure Note</Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback onPress={gotoTestScreen}>
						<View style={styles.bottomDrawerOption}>
							<MaterialCommunityIcons
								name="credit-card-outline"
								style={styles.bottomDrawerOptionIcons}
								size={25} />
							<Text variant="titleMedium">&nbsp;Credit Card</Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback onPress={gotoTestScreen}>
						<View style={styles.bottomDrawerOption}>
							<MaterialCommunityIcons
								name="badge-account-horizontal-outline"
								style={styles.bottomDrawerOptionIcons}
								size={25} />
							<Text variant="titleMedium">&nbsp;Personal Info</Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback onPress={gotoTestScreen}>
						<View style={styles.bottomDrawerOption}>
							<MaterialCommunityIcons
								name="folder-outline"
								style={styles.bottomDrawerOptionIcons}
								size={25} />
							<Text variant="titleMedium">&nbsp;Folder</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</View>
		</BottomDrawer>
	);
};

const themeStyle = (colors: MD3Colors) => StyleSheet.create({
	bottomDrawerContent: {
		// flex: 1,
		height: '90%',
		// backgroundColor: 'blue',
		justifyContent: "space-between"
	},
	bottomDrawerTitle: {
		// height: '20%',
		// width: '90%',
		// backgroundColor: 'yellow'
	},
	bottomDrawerOptions: {
		justifyContent: "space-evenly",
		// flex: 1,
		height: '80%',
		// width: '90%',
		// backgroundColor: 'red'
	},
	bottomDrawerOption: {
    flexDirection: 'row',
		// alignItems: ""
		// justifyContent: "space-evenly"
		// height: '90%',
    // paddingVertical: 8,
    // paddingHorizontal: 16,
  },
		bottomDrawerOptionIcons: {
			color: colors.onSecondaryContainer,
  },
});

export default CreatePassDrawer;
