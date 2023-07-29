import { useTheme, Text, TouchableRipple, Divider } from 'react-native-paper'
import { SectionList, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import RoadNumber from './RoadNumber'

export default function RoadsList(props) {
    const theme = useTheme()

    return (
        <SectionList
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => <RoadEntry road={item} nav={props.nav} />}
            renderSectionHeader={({section: {title}}) => <Text variant='titleMedium' style={{marginVertical: 15, color: theme.colors.primary}}>{title}</Text>}
            keyExtractor={item => item.id}
            sections={props.roads}
            refreshing={props.refreshing}
            onRefresh={props.onRefresh}
            ListEmptyComponent={() => (
                <View>
                    <Text style={{color: theme.colors.outline, textAlign: 'center'}}>Keine Meldungen gefunden</Text>
                    <Text style={{color: theme.colors.outline, textAlign: 'center'}}>Zum aktualisieren herunterziehen</Text>
                </View>
            )}
        />
    )
}

export function RoadEntry(props) {
    const theme = useTheme()

    return(
        <TouchableRipple
            onPress={() => props.nav.navigate('RoadIncidents', {road: props.road})}
            rippleColor={theme.colors.primaryContainer}>
                <View style={{height: 50}}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 5}}>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                            <RoadNumber nr={props.road.nr} />
                            <Text variant='bodyLarge'>{props.road.name}</Text>
                        </View>
                        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                            <Text variant='bodyLarge'>{props.road.number_incidents}</Text>
                            <Icon name='chevron-right' size={32} color={theme.colors.onBackground} />
                        </View>
                    </View>
                    <Divider />
                </View>
        </TouchableRipple>
    )
}