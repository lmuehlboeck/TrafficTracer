import { FlatList } from 'react-native'
import IncidentDetails from './IncidentDetails'

export default function IncidentsList(props) {
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