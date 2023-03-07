import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode
	// PASS A BOOLEAN TO KNOW TO USE NOTCH SETTINGSS!!!!!
}

const ViewWrapper = ({children}: Props) => {
  const theme = useTheme();
	const safeAreaInsets = useSafeAreaInsets()

	const hasNotch = DeviceInfo.hasNotch();
	const notchSettings = hasNotch
	? {
		paddingTop: safeAreaInsets.top,
		// paddingBottom: safeAreaInsets.bottom,
		paddingLeft: safeAreaInsets.left,
		paddingRight: safeAreaInsets.right,
	}
	: {};

	const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
			...notchSettings
    },
  });
  return <View style={styles.container}>{children}</View>
}

export default ViewWrapper;
