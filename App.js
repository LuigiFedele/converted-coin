import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TextInput,TouchableOpacity, Keyboard } from 'react-native';

import { PickerItem } from './src/Picker';
import { api } from './src/services/api';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState([]);
  const [selectionCoin, setSelectionCoin] = useState(null);
  const [currencyB, setCurrencyB] = useState("");

  const [valueCurrency, setValueCurrency] = useState(null);
  const [valueConverted, setValueConverted] = useState(0);
  

  useEffect( ()=> {
    async function loadCurrency(){
      const response = await api.get('all');
      let arrayCurrency = [];
      Object.keys(response.data).map(( key ) => {
        arrayCurrency.push({ 
          key: key,
          label: key, 
          value: key 
        });
      })
      setCurrency(arrayCurrency)
      setSelectionCoin(arrayCurrency[0].key)
      setLoading(false);
    }

    loadCurrency();
  }, [])
  
  async function convert(){
    if(currencyB === 0 || currencyB === "" || selectionCoin === null){
      return;
    }

    const response = await api.get(`/all/${selectionCoin}--BRL`)
    console.log(response.data[selectionCoin].ask);

    let result = (response.data[selectionCoin].ask * parseFloat(currencyB))

    setValueConverted(`${result.toLocaleString("pt-BR", {style: "currency", currency: "BRL" })}`)
    setValueCurrency(currencyB)

    Keyboard.dismiss();
  }

  if(loading){
    return(
      <View style={{flex:1, justifyContent:'center', alignItems:'center' , backgroundColor:'#101215'}}>
        <ActivityIndicator color={'#fff'} size={"large"}/>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.selection}>
        <Text style={styles.title}>Selecione a sua moeda</Text>
        <PickerItem 
          currency={currency}
          selectionCoin={selectionCoin}
          onChange={ (coin) => setSelectionCoin(coin)}
        />
      </View>

      <View style={styles.areaValue}>
        <Text style={styles.title}>Digite um valor para converter em (R$)</Text>
        <TextInput
          placeholder='Ex. 1.50'
          style={styles.input}
          keyboardType='numeric'
          value={currencyB}
          onChangeText={(value) => setCurrencyB(value)}
        />
      </View>

      <TouchableOpacity style={styles.buttonArea}
        onPress={convert}
      >
        <Text style={styles.buttonText}>Converter</Text>
      </TouchableOpacity>

      {valueConverted !== 0 && (
              <View style={styles.resultArea}>
              <Text style={styles.convertedValue}>
                {valueCurrency} {selectionCoin}
              </Text>
              <Text style={{fontSize: 18, margin:8, color:'#000', fontWeight:'500'}}>
                corresponde a
              </Text>
              <Text style={styles.convertedValue}>
                {valueConverted}
              </Text>
      
            </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#101215',
    paddingTop:40,
    alignItems:'center',
  },
  selection:{
    width:'90%',
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 8,
    marginBottom: 1,
  },
  title:{
    fontSize: 20,
    color: '#000',
    fontWeight: '500',
    paddingTop: 5,
    paddingLeft:5,
  },
  areaValue:{
    width: '90%',
    backgroundColor: '#f9f9f9',
    paddingTop:8,
    paddingBottom:8,
  },
  input:{
    width: '100%',
    padding:8,
    fontSize:18,
    color:'#000',
  },
  buttonArea:{
    width: '90%',
    backgroundColor: '#fb4b57',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  buttonText:{
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultArea:{
    width: '90%',
    backgroundColor: '#f9f9f9',
    marginTop:34,
    borderRadius:8,
    alignItems: 'center',
    justifyContent: 'center',
    padding:24,
  },
  convertedValue:{
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold',
  }
});
