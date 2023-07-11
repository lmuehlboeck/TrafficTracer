import { createContext, useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { PaperProvider } from "react-native-paper"
import { darkTheme, lightTheme } from "./styles/themes"
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './navigations/AppNavigator'
import { db } from './database/Database'
import { crud } from './database/CRUD'

export const AppContext = createContext(null)

export default function App() {
    const [theme, setTheme] = useState(lightTheme)
    
    const defaultBboxes = [
        {
            id: 1,
            enabled: 1,
            description: 'Wien & NÖ Nord',
            bbox: '15.509949,47.984407,16.888733,48.701838'
        },
        {
            id: 2,
            enabled: 0,
            description: 'NÖ West & OÖ Nord',
            bbox: '13.430786,48.034019,15.501709,48.607490'
        },
        {
            id: 3,
            enabled: 0,
            description: 'OÖ Süd & S Nord',
            bbox: '12.749634,47.602459,14.804077,48.177076'
        },
        {
            id: 4,
            enabled: 0,
            description: 'NÖ Süd, ST Nord & B Nord',
            bbox: '14.960632,47.292271,16.542664,48.021161'
        },
        {
            id: 5,
            enabled: 0,
            description: 'ST Süd',
            bbox: '14.249268,46.732331,16.083984,47.338823'
        },
        {
            id: 6,
            enabled: 0,
            description: 'K & OT',
            bbox: '12.672729,46.502173,14.837036,46.976505'
        },
        {
            id: 7,
            enabled: 0,
            description: 'S Süd',
            bbox: '12.420044,46.991494,13.991089,47.628380'
        },
        {
            id: 8,
            enabled: 0,
            description: 'T Ost',
            bbox: '10.859985,47.013971,12.271729,47.643186'
        },
        {
            id: 9,
            enabled: 0,
            description: 'T West & V',
            bbox: '9.563599,46.965259,10.848999,47.513491'
        },
    ]

    useEffect(() => {
        crud.getSetting('dark-mode').then(v => {
            if(v) setTheme(darkTheme)
        })

        db.transaction(txn => {
            txn.executeSql(
                `CREATE TABLE IF NOT EXISTS incidents (
                    id TEXT PRIMARY KEY NOT NULL,
                    type INTEGER NOT NULL,
                    road_id INTEGER NOT NULL,
                    from_dest TEXT NOT NULL,
                    to_dest TEXT NOT NULL,
                    length INTEGER,
                    delay INTEGER,
                
                    FOREIGN KEY (road_id) REFERENCES roads(id)
                )`, [], () => {}, err => console.log(err)
            )
            txn.executeSql(
                `CREATE TABLE IF NOT EXISTS roads (
                    id INTEGER PRIMARY KEY NOT NULL,
                    nr TEXT,
                    name TEXT
                )`, [], () => {}, err => console.log(err)
            )
            txn.executeSql(
                `CREATE TABLE IF NOT EXISTS descriptions (
                    incident_id TEXT NOT NULL,
                    description TEXT,
                
                    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
                    PRIMARY KEY (incident_id, description)
                )`, [], () => {}, err => console.log(err)
            )
            txn.executeSql(
                `CREATE TABLE IF NOT EXISTS bboxes (
                    id INTEGER PRIMARY KEY NOT NULL,
                    enabled INTEGER DEFAULT 0 NOT NULL,
                    description TEXT,
                    bbox TEXT NOT NULL
                )`, [], () => {}, err => console.log(err)
            )
            txn.executeSql(
                `CREATE TABLE IF NOT EXISTS settings (
                    key TEXT NOT NULL,
                    value_int INTEGER,
                    value_text TEXT
                )`, [], () => {}, err => console.log(err)
            )

            for(const defaultBbox of defaultBboxes) {
                txn.executeSql(
                    `INSERT OR IGNORE INTO bboxes (id,enabled,description,bbox) VALUES (?,?,?,?)`, 
                    [defaultBbox.id, defaultBbox.enabled, defaultBbox.description, defaultBbox.bbox], 
                    () => {}, err => console.log(err)
                )
            }
        })
    }, [])

    return (
        <AppContext.Provider value={{ theme: theme, setTheme }}>
            <PaperProvider theme={theme}>
                <StatusBar backgroundColor={theme.colors.background} barStyle={theme.dark ? 'light-content' : 'dark-content'} />
                <NavigationContainer theme={theme}>
                    <AppNavigator />
                </NavigationContainer>
            </PaperProvider>
        </AppContext.Provider>
    )
}