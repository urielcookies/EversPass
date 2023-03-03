import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

type Props = {
  children: ReactNode
}

const ViewWrapper = ({children}: Props) => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
  return <View style={styles.container}>{children}</View>
}

export default ViewWrapper;
