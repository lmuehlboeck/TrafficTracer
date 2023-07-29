import { createContext, useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { PaperProvider } from "react-native-paper"
import { darkTheme, lightTheme } from "./styles/themes"
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './navigations/AppNavigator'
import { db } from './database/Database'
import { crud } from './database/CRUD'
import { defaultBboxes } from './constants'

export const AppContext = createContext(null)

export default function App() {
    const [theme, setTheme] = useState(lightTheme)
    
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
                    direction TEXT,
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