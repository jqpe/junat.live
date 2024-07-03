import { Stack } from 'expo-router'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Index() {
  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: 'Home Page' }} />

      <View>
        <Text>Junat.live</Text>
      </View>
    </SafeAreaView>
  )
}
