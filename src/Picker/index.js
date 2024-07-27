import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export function PickerItem(props) {

  let currencyItem = props.currency.map (( item,index ) => {
    return <Picker.Item value={item.key} key={index} label={item.key} />
  })

 return (
  <Picker
    selectedValue={props.selectionCoin}
    onValueChange={ ( value ) => props.onChange(value) }
  >
    {currencyItem}
  </Picker>
  );
}