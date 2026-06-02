import { Text, TouchableOpacity } from 'react-native';

import { useAppTheme } from '../theme/AppThemeContext';

export function AppButton({ title, onPress, variant = 'primary' }) {
  const { styles } = useAppTheme();
  const buttonStyles = {
    primary: {
      button: styles.button,
      text: styles.buttonText,
    },
    secondary: {
      button: styles.secondaryButton,
      text: styles.secondaryButtonText,
    },
    danger: {
      button: styles.dangerButton,
      text: styles.dangerButtonText,
    },
    back: {
      button: styles.backButton,
      text: styles.backButtonText,
    },
  };
  const variantStyles = buttonStyles[variant] ?? buttonStyles.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      style={variantStyles.button}
      onPress={onPress}
    >
      <Text style={variantStyles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
