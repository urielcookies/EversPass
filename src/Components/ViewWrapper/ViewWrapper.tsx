import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import DeviceInfo from 'react-native-device-info';

type Props = {
  children: ReactNode,
	notchProtection?: boolean,
}

const ViewWrapper = (props: Props) => {
	const { children, notchProtection } = props;
  const theme = useTheme();
	const safeAreaInsets = useSafeAreaInsets()

	// const hasNotch = DeviceInfo.hasNotch();
	const notchSettings = notchProtection
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
