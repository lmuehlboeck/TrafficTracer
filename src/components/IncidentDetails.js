import { View, Image } from 'react-native'
import { Card, Text, useTheme } from 'react-native-paper'

styles = require('../styles/styles')

export default function IncidentDetails(props) {
    const theme = useTheme()

    const signImages = {
        danger: require('../assets/images/danger.png'),
        skidding: require('../assets/images/skidding.png'),
        trafficJam: require('../assets/images/traffic_jam.png'),
        wind: require('../assets/images/wind.png')
    }
    const typeSigns = {
        0: signImages.danger,
        4: signImages.skidding,
        5: signImages.skidding,
        6: signImages.trafficJam,
        7: signImages.trafficJam,
        8: signImages.trafficJam,
        10: signImages.wind,
        11: signImages.skidding,
    }

    return (
        <Card style={{margin: 5}}>
            <Card.Content>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', margin: 5}}>
                    <View style={{width: 60, height: 60}}>
                        <Image 
                            source={typeSigns[props.type] ? typeSigns[props.type] : typeSigns[0]}
                            style={styles.image}
                        />
                    </View>
                    <View style={{flex: 1, marginHorizontal: 20}}>
                        <Text variant='bodyLarge' style={{fontWeight: 'bold'}}>Zwischen {props.from_dest} und {props.to_dest}</Text>
                        <Text variant='bodyLarge'>{Math.round(props.length / 100) / 10} km {props.descriptions.join(', ')}</Text>
                        <Text variant='bodyLarge' style={{color: theme.colors.error, textAlign: 'right'}}>
                            +{props.delay ? props.delay : 'Vorsicht!'} min
                        </Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    )
}