import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

interface TranspBgrViewProps {
  children?: ReactNode;
  paddingVertical?: number
}

const TranspBgrView: React.FC<TranspBgrViewProps> = ({ children, paddingVertical }) => {
  const { colors } = useTheme();
  const styles = themeStyle(colors, paddingVertical);

  return (
    <View style={styles.viewsBackground}>
      {children}
    </View>
  );
};

const themeStyle = (colors: MD3Colors, paddingVertical: number | undefined) => StyleSheet.create({
  viewsBackground: {
    backgroundColor: colors.background,
    paddingVertical: paddingVertical || 0,
  }
});

export default TranspBgrView;
