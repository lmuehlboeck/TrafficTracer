import { FlatList, View } from 'react-native'
import IncidentDetails from './IncidentDetails'
import { Text, useTheme } from 'react-native-paper'

export default function IncidentsList(props) {
    const theme = useTheme()

    return (
        <FlatList
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => <IncidentDetails {...item} />}
            keyExtractor={item => item.id}
            data={props.data}
        />
    )
}