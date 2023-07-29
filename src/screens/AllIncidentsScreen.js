import { View, ToastAndroid } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import RoadsList from '../components/RoadsList'
import { useEffect, useState } from 'react'
import { crud } from '../database/CRUD'
import { roadDirections } from '../constants'

const styles = require('../styles/styles')

export default function AllIncidentsScreen({ navigation }) {
    const [refreshing, setRefreshing] = useState(false)
    const [roads, setRoads] = useState([])

    const apiUrl = (key, bbox) => `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${key}&bbox=${bbox}&fields={incidents{properties{id,iconCategory,events{description},roadNumbers,from,to,length,delay,tmc{direction}}}}&language=de-DE&categoryFilter=1,2,5,6,10,11,14`

    const onRefresh = async () => {
        setRefreshing(true)
        await crud.clearIncidents()
        const bboxes = await crud.getBboxes(true)
        const key = await crud.getSetting('api-key')
        if(!key) {
            ToastAndroid.show('Bitte definieren Sie einen API-Key in den Einstellungen!', ToastAndroid.LONG)
            setRefreshing(false)
            return
        }
        for(const bbox of bboxes) {
            try {
                const response = await fetch(apiUrl(key, bbox.bbox))
                if(!response.ok) {
                    ToastAndroid.show('Fehler: Möglicherweise ungültiger API-Key!', ToastAndroid.LONG)
                    setRefreshing(false)
                    return
                }
                const data = await response.json()
                if('incidents' in data) {
                    for(const incident of data.incidents) {
                        const fromSplit = incident.properties.from.split(/[\(\)//]+/).filter(Boolean)
                        const toSplit = incident.properties.to.split(/[\(\)//]+/).filter(Boolean)
                        if(fromSplit.length > 2) {
                            const roadName = fromSplit[fromSplit.length-2].trim()
                            const roadNr = fromSplit[fromSplit.length-1].trim()
                            if(roadNr.length <= 6) {
                                const directionObj = roadDirections.find(r => r.nr === roadNr && r.name === roadName)
                                const direction = incident.properties.tmc && directionObj ? directionObj[incident.properties.tmc.direction] : undefined
                                await crud.createIncident(
                                    incident.properties.id,
                                    incident.properties.iconCategory,
                                    { name: roadName, nr: roadNr },
                                    fromSplit[0].trim(),
                                    toSplit[0].trim(),
                                    direction,
                                    incident.properties.length,
                                    incident.properties.delay,
                                    incident.properties.events.map(e => e.description)
                                )
                            }
                        }
                    }
                }
            } catch(err) {
                ToastAndroid.show('Fehler: Möglicherweise keine Internet-Verbindung!', ToastAndroid.LONG)
            }
        }
        loadIncidents()
    }

    const loadIncidents = () => {
        setRefreshing(true)
        crud.getRoads().then(roads => {
            const autobahnen = roads.filter(r => r.nr.startsWith('A'))
            const schnellstrassen = roads.filter(r => r.nr.startsWith('S'))
            const landesstrassen = roads.filter(r => r.nr.startsWith('B') || r.nr.startsWith('L'))
            const andere = roads.filter(r => !r.nr.startsWith('A') && !r.nr.startsWith('S') && !r.nr.startsWith('B') & !r.nr.startsWith('L'))
            const roadsWithSections = []
            if(autobahnen.length > 0)
                roadsWithSections.push({
                    title: 'Autobahnen',
                    data: autobahnen
                })
            if(schnellstrassen.length > 0)
                roadsWithSections.push({
                    title: 'Schnellstraßen',
                    data: schnellstrassen
                })
            if(landesstrassen.length > 0)
                roadsWithSections.push({
                    title: 'Bundes-/Landesstraßen',
                    data: landesstrassen
                })
            if(andere.length > 0)
                roadsWithSections.push({
                    title: 'Andere Straßen',
                    data: andere
                })
            setRoads(roadsWithSections)
            setRefreshing(false)
        })
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton icon='cog' size={22} onPress={() => navigation.navigate('Settings')} />
            )
        })
    }, [navigation])

    useEffect(() => {
        loadIncidents()
    }, [])

    return (
        <View style={styles.bodyContainer}>
            <RoadsList roads={roads} nav={navigation} refreshing={refreshing} onRefresh={onRefresh} />
        </View>
    )
}