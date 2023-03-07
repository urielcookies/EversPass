import { ReactNode } from 'react';
import { Dimensions, Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MD3Colors } from "react-native-paper/lib/typescript/types";

interface Props {
  handleCloseBottomSheet: () => void;
  height: number;
  children: ReactNode
}

const BottomDrawer = (props: Props) => {
  const { children, handleCloseBottomSheet, height } = props;

  const { colors } = useTheme();
  const styles = themeStyle(colors);
  const windowHeight = Dimensions.get('window').height;

	return (
    <Modal
      visible
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseBottomSheet}>
      <TouchableWithoutFeedback onPressOut={handleCloseBottomSheet}>
        <View style={styles.centeredView}>
          <View style={[styles.bottomSheet, { height: windowHeight * height }]}>
						<TouchableWithoutFeedback>{ children }</TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const themeStyle = (colors: MD3Colors) => StyleSheet.create({
  centeredView: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: colors.secondaryContainer,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
		padding: 25,
    bottom: 0,
    borderWidth: 1,
  }
});

export default BottomDrawer;
