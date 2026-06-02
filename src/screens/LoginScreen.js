import { SafeAreaView, Text, TextInput, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { InfoBox } from '../components/InfoBox';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAppTheme } from '../theme/AppThemeContext';

export function LoginScreen({
  usuario,
  contrasena,
  onUsuarioChange,
  onContrasenaChange,
  onLogin,
  onCreateAccount,
  onClearData,
}) {
  const { colors, styles } = useAppTheme();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.loginHero}>
        <Text style={styles.brand}>PitStop</Text>
        <Text style={styles.heroTitle}>Tu control de combustible, al dia.</Text>
        <Text style={styles.heroCopy}>
          Guarda cargas, revisa consumo y separa tus registros por usuario.
        </Text>
      </View>

      <View style={styles.authPanel}>
        <Text style={styles.panelTitle}>Acceso</Text>
        <Text style={styles.panelSubtitle}>Inicia sesion o crea una cuenta local.</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={usuario}
          onChangeText={onUsuarioChange}
          autoCapitalize="none"
          placeholderTextColor={colors.muted}
        />

        <TextInput
          style={styles.input}
          placeholder="Contrasena"
          value={contrasena}
          onChangeText={onContrasenaChange}
          secureTextEntry
          placeholderTextColor={colors.muted}
        />

        <AppButton title="Iniciar sesion" onPress={onLogin} />
        <AppButton title="Crear cuenta" onPress={onCreateAccount} variant="secondary" />
        <AppButton title="Borrar datos locales" onPress={onClearData} variant="danger" />

        <InfoBox>
          Los usuarios y registros se guardan localmente en este dispositivo.
        </InfoBox>

        <ThemeToggle />
      </View>
    </SafeAreaView>
  );
}
