import { useEffect, useState, useContext } from 'react'
import { FlatList, View } from 'react-native'
import { Checkbox, Switch, Text, TextInput, TouchableRipple, useTheme } from 'react-native-paper'
import { crud } from '../database/CRUD'
import { darkTheme, lightTheme } from '../styles/themes'
import { AppContext } from '../App'
import { useIsFocused } from '@react-navigation/native'

const styles = require('../styles/styles')

export default function SettingsScreen({ navigator }) {
    const focused = useIsFocused()
    const { theme, setTheme } = useContext(AppContext)
    const [darkMode, setDarkMode] = useState(theme.dark)
    const [apiKey, setApiKey] = useState(null)
    const [bboxes, setBboxes] = useState([])

    const toggleDarkMode = () => setDarkMode(!darkMode)

    const updateApiKey = key => {
        setApiKey(key)
        crud.setSetting('api-key', key)
    }

    const toggleBbox = bbox => {
        crud.updateBbox(bbox.id, !bbox.enabled, bbox.description, bbox.bbox)
        setBboxes(bboxes.map(b => b.id == bbox.id ? {...b, enabled: !bbox.enabled} : b))
    }

    useEffect(() => {
        crud.setSetting('dark-mode', darkMode ? 1 : 0).then(() => {
            setTheme(darkMode ? darkTheme : lightTheme)
        })
    }, [darkMode])

    useEffect(() => {
        crud.getSetting('api-key').then(key => setApiKey(key))
        crud.getBboxes().then(bboxes => setBboxes(bboxes))
    }, [focused])

    return (
        <View style={styles.bodyContainer}>
            <Text variant='bodyLarge' style={{marginVertical: 10, color: theme.colors.primary}}>Allgemein</Text>
            <View>
                <TouchableRipple
                    onPress={toggleDarkMode}
                    rippleColor={theme.colors.secondaryContainer}
                    style={{height: 50}}>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                            <Switch value={darkMode} onValueChange={toggleDarkMode} />
                            <Text variant='bodyLarge' style={{marginHorizontal: 10}}>Dark Mode</Text>
                        </View>
                </TouchableRipple>
                <TextInput 
                    style={{marginVertical: 5}}
                    label='API-Key'
                    mode='outlined'
                    value={apiKey}
                    onChangeText={text => updateApiKey(text)}
                />
            </View>
            <Text variant='bodyLarge' style={{marginVertical: 10, color: theme.colors.primary}}>Bounding Boxes</Text>
            <FlatList
                style={{flexGrow: 0}}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => <BboxEntry 
                                            bbox={item} 
                                            onToggle={toggleBbox}
                                        />}
                keyExtractor={(item) => item.id}
                data={bboxes}
            />
        </View>
    )
}

export function BboxEntry(props) {
    const theme = useTheme()

    return (
        <TouchableRipple
            onPress={() => props.onToggle(props.bbox)}
            rippleColor={theme.colors.secondaryContainer}
            style={{height: 50}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <Checkbox status={props.bbox.enabled ? 'checked' : 'unchecked'} />
                    <Text variant='bodyLarge' style={{marginHorizontal: 10}}>{props.bbox.description}</Text>
                </View>
        </TouchableRipple>
    )
}