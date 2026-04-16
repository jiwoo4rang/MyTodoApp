import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Input({ onSubmit, helperLabel }) {
  const [value, setValue] = useState('');
  const isDisabled = value.trim().length === 0;

  const handleSubmit = () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    onSubmit(trimmedValue);
    setValue('');
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder={'\uc608: \uc7a5\ubcf4\uae30, \uc6b4\ub3d9\ud558\uae30, \uba54\uc77c \ub2f5\uc7a5\ud558\uae30'}
          placeholderTextColor="#94a3b8"
          value={value}
          onChangeText={setValue}
          onSubmitEditing={handleSubmit}
          maxLength={30}
          returnKeyType="done"
        />
        <Pressable
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isDisabled}
        >
          <Text style={styles.buttonText}>{'\ucd94\uac00'}</Text>
        </Pressable>
      </View>
      <Text style={styles.helperText}>
        {helperLabel
          ? `${helperLabel} \uae30\uc900, \ucd5c\ub300 30\uc790\uae4c\uc9c0 \uc785\ub825\ud560 \uc218 \uc788\uc5b4\uc694.`
          : '\ucd5c\ub300 30\uc790\uae4c\uc9c0 \uc785\ub825\ud560 \uc218 \uc788\uc5b4\uc694.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ffd2e5',
    shadowColor: '#d37aa6',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff8fb',
    borderWidth: 1,
    borderColor: '#ffd4e5',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#6d4254',
    fontFamily: 'GowunDodum_400Regular',
  },
  button: {
    backgroundColor: '#ff8fbc',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: '#ff8fbc',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonDisabled: {
    backgroundColor: '#f7bfd7',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'GowunDodum_400Regular',
  },
  helperText: {
    marginTop: 10,
    fontSize: 13,
    color: '#9a7484',
    fontFamily: 'GowunDodum_400Regular',
  },
});
