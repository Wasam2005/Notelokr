import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Platform } from 'react-native';

export const KEYPAD_LAYOUT = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['clear', '0', 'back'],
];

export function renderPinDots(pin, dotStyle, dotFilledStyle, containerStyle) {
  return (
    <View style={containerStyle}>
      {[...Array(4)].map((_, i) => (
        <View
          key={i}
          style={[dotStyle, pin[i] ? dotFilledStyle : null]}
        />
      ))}
    </View>
  );
}

export function renderKeypad(
  layout,
  handleKeyPress,
  loading = false,
  rowStyle,
  keyStyle,
  keyTextStyle
) {
  return layout.map((row, i) => (
    <View key={i} style={rowStyle}>
      {row.map((key) => {
        const isBackspace = key === 'back';
        const isClear = key === 'clear';

        const isSpecial = isBackspace || isClear;
        const combinedStyle = Array.isArray(keyStyle)
          ? keyStyle
          : [keyStyle];

        // Add extra styling for backspace
 const baseKeyStyle = {
  width: 64,
  height: 64,
  backgroundColor: '#1c1c1e',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 32,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 2,
};

const styledKey = [
  baseKeyStyle,
  ...combinedStyle,
  isBackspace && {
    // Only add extra adjustments here if necessary
    tintColor: 'white', // if using icon
  },
];

   return (
          <TouchableOpacity
            key={key}
            style={styledKey}
            onPress={() => handleKeyPress(key)}
            disabled={loading}
          >
            {isBackspace ? (
      <Ionicons name="backspace-outline" size={28} color="#ffffff" />

            ) : (
              <Text
                style={[
                  keyTextStyle,
                  isClear && { color: '#888', fontWeight: 'bold' },
                ]}
              >
                {isClear ? 'C' : key}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  ));
}
