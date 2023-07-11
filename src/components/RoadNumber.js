import { Text } from "react-native-paper";

export default function RoadNumber(props) {
    const colors = {
        'A': '#0060aa',
        'S': '#0060aa',
        'M': '#0060aa',
        'B': '#2270b8',
        'L': '#2270b8',
        'E': '#6c9f43',
        'R': '#db6160',
        'D': '#db6160',
        'default': '#2270b8'
    }
    const color = colors[props.nr.slice(0,1)] ? colors[props.nr.slice(0,1)] : colors['default']
    const width = props.nr.length > 3 ? 35 + (props.nr.length - 3) * 6 : 35

    return (
        <Text style={{
            backgroundColor: color, 
            color: '#fff', 
            width: width, 
            height: 25, 
            textAlign: 'center', 
            textAlignVertical: 'center',
            marginRight: 10
        }}>
            {props.nr}
        </Text>
    )
}