import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function AppModal({
  visible,
  title = '',
  message = '',
  children = null,
  buttons = [],
  onClose = () => {},
  transparent = true,
  animationType = 'slide',
}) {
  return (
    <Modal transparent={transparent} animationType={animationType} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Title */}
          {title ? <Text style={styles.title}>{title}</Text> : null}

          {/* Message */}
          {message ? <Text style={styles.message}>{message}</Text> : null}

          {/* Custom content */}
          {children && (
            <ScrollView
              style={styles.childrenContainer}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          )}

          {/* Action Buttons */}
          {buttons.map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.button,
                btn.disabled && styles.buttonDisabled,
                btn.style || {},
              ]}
              onPress={btn.onPress}
              disabled={btn.disabled}
            >
              <Text
                style={[
                  styles.buttonText,
                  btn.disabled && styles.buttonTextDisabled,
                ]}
              >
                {btn.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#353434ff', 
    borderRadius: 16,
    padding: 24,
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: '#1e1e1e', // subtle border for definition
    shadowColor: '#00bfff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  childrenContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#00bfff', // bright cyan-blue
  },
  buttonDisabled: {
    backgroundColor: '#333333ff', // darker for black bg
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#fff6f6ff',
  },
  closeButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#060606ff', // darker gray for black bg
    borderWidth: 1,
    borderColor: '#222',
    marginTop: 8,
  },
  closeButtonText: {
    color: '#fffffffe',
    fontSize: 15,
    fontWeight: '600',
  },
});
