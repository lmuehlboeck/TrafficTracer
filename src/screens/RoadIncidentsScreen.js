import { useEffect, useState } from 'react'
import { View } from 'react-native'
import IncidentDetails from '../components/IncidentDetails'
import IncidentsList from '../components/IncidentsList'
import RoadNumber from '../components/RoadNumber'
import { Text } from 'react-native-paper'
import { useIsFocused } from '@react-navigation/native'
import { crud } from '../database/CRUD'

const styles = require('../styles/styles')

export default function RoadIncidentsScreen({ route, navigation }) {
    const focused = useIsFocused()
    const [road, setRoad] = useState(route.params.road)
    const [incidents, setIncidents] = useState([])

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <RoadNumber nr={road.nr} />
                    <Text variant='titleMedium'>{road.name}</Text>
                </View>
            )
        })
    }, [navigation])

    useEffect(() => {
        crud.getIncidentsByRoad(road.id).then(incidents => {
            setIncidents(incidents)
        })
    }, [focused])

    return (
        <View style={styles.bodyContainer}>
            <IncidentsList data={incidents} />
        </View>
    )
}