import React, { useState, useEffect } from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, TextInput, KeyboardAvoidingView, Platform, Picker } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

interface IGBEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string;
}

const Home: React.FC = () => {
  const navigation = useNavigation();

  // Dados Provenientes do IBGE
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => { // Api do IBGE para pegar as UFs
    axios.get<IGBEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map((uf) => uf.sigla).sort();
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => { // Api do IBGE para pegar as cidades
    if (uf === '0') {
      return;
    }

    axios.get<IBGECityResponse[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`
    )
      .then(response => {
        const cities = response.data.map(city => city.nome).sort()
        setCities(cities);
      });
  }, [uf]);

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf,
      city,
    })
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
          </View>
        </View>

        <View style={styles.footer}>

          <RNPickerSelect
            onValueChange={setUf}
            placeholder={{
              label: 'Selecione um estado',
              value: null
            }}
            style={{
              placeholder: { color: '#6C6C80' },
              inputAndroid: { color: '#6C6C80' },
              viewContainer: {
                height: 60,
                backgroundColor: '#FFF',
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 24,
                justifyContent: 'center',
              }
            }}
            items={ufs.map(uf => {
              return { label: uf, value: uf }
            })}
          />

          <RNPickerSelect
            onValueChange={setCity}
            placeholder={{
              label: 'Selecione uma cidade',
              value: null
            }}
            style={{
              placeholder: { color: '#6C6C80' },
              inputAndroid: { color: '#6C6C80' },
              viewContainer: {
                height: 60,
                backgroundColor: '#FFF',
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 24,
                justifyContent: 'center',
              },
              headlessAndroidContainer: { height: 200 }
            }}
            items={cities.map(city => {
              return { label: city, value: city }
            })}
          />

          {/* <TextInput
            style={styles.input}
            placeholder="Digite a UF"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={2}
            value={uf}
            onChangeText={setUf}
          /> */}



          {/* <TextInput
            style={styles.input}
            placeholder="Digite a Cidade"
            autoCorrect={false}
            value={city}
            onChangeText={setCity}
          /> */}

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>
              Entrar
          </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});