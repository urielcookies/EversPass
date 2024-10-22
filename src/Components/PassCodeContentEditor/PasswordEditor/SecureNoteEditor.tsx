import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useFormikContext } from 'formik';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import CommonField from '../CommonField';
import CustomFieldEditor from '../CustomFieldEditor';
import TranspBgrViewProps from '../../../RenderProps/TranspBgrView';
import { SecureNoteData } from '../../../Configs/interfaces/PassCodeData';

const SecureNoteEditor: React.FC = () => {
  const { values } = useFormikContext<SecureNoteData>();

  const { colors } = useTheme();
  const styles = themeStyle(colors);

  return (
    <View style={styles.content}>

      <CommonField
        keyName="title"
        type="simple"
        value={values.title} />

      <TranspBgrViewProps paddingVertical={10} />

      <Text style={styles.transpBgrView} variant="titleMedium">
        Secure Note Details
      </Text>

      <TranspBgrViewProps paddingVertical={5} />

      <CommonField
        customStyles={styles.noteHeight}
        passData
        keyName="note"
        type="note"
        value={values.passData.note} />

      <TranspBgrViewProps paddingVertical={5} />
      <CommonField
        passData
        keyName="website"
        type="simple"
        title="Website / App Name"
        keyboardType="url"
        value={values.passData.website} />

      <TranspBgrViewProps paddingVertical={5} />
      <CustomFieldEditor customFields={values.passData.customFields}/>
      <TranspBgrViewProps paddingVertical={5} />
    </View>
  );
};

const themeStyle = (colors: MD3Colors) =>
  StyleSheet.create({
    content: {
      backgroundColor: colors.onPrimary,
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 7.5,
      marginBottom: 7.5,
    },
    transpBgrView: {
      backgroundColor: colors.background,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
    },
    noteHeight: {
      height: 200,
      maxHeight: 750,
    },
  });

export default SecureNoteEditor;
