import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AllIncidentsScreen from '../screens/AllIncidentsScreen'
import { IconButton, useTheme } from 'react-native-paper'
import RoadIncidentsScreen from '../screens/RoadIncidentsScreen'
import SettingsScreen from '../screens/SettingsScreen'

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
    const theme = useTheme()

    return (
        <Stack.Navigator 
            initialRouteName='AllIncidents'
            screenOptions={{
                headerTintColor: theme.colors.onBackground,
                headerStyle: {
                    backgroundColor: theme.colors.background
                },
            }}
        >
            <Stack.Screen 
                name='AllIncidents' 
                component={AllIncidentsScreen} 
                options={{ 
                    title: 'TrafficTracer'
                }}
            />
            <Stack.Screen 
                name='RoadIncidents' 
                component={RoadIncidentsScreen}
            />
            <Stack.Screen 
                name='Settings'
                component={SettingsScreen}
                options={{
                    title: 'Einstellungen'
                }}
            />
        </Stack.Navigator>
    )
}