import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, SafeAreaView, TouchableOpacity, Modal, TextInput, Button, Platform, } from 'react-native';
import { useEffect, useState } from 'react';
import { getPlanets, addPlanet } from './api/apiServices';
import { Link } from 'expo-router';

export default function Home() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlanet, setNewPlanet] = useState({ name: '', description: '', image: '', moons: 0, moon_names: [] });
  const [moonName, setMoonName] = useState('');
  const [isSortedByMoons, setIsSortedByMoons] = useState(false);

  const fetchPlanets = async () => {
    setLoading(true);
    const data = await getPlanets();
    setPlanets(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  const handleAddPlanet = async () => {
    if (newPlanet.name && newPlanet.description && newPlanet.image) {
      const success = await addPlanet(newPlanet);
      if (success) {
        fetchPlanets();
        setModalVisible(false);
        setNewPlanet({ name: '', description: '', image: '', moons: 0, moon_names: [] });
      } else {
        alert('Error al agregar el planeta.');
      }
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  const handleAddMoon = () => {
    if (moonName.trim()) {
      setNewPlanet((prev) => ({
        ...prev,
        moon_names: [...prev.moon_names, moonName.trim()],
        moons: prev.moon_names.length + 1,
      }));
      setMoonName('');
    }
  };

  const toggleSortOrder = () => {
    if (isSortedByMoons) {
      fetchPlanets();
    } else {
      const sortedPlanets = [...planets].sort((a, b) => b.moons - a.moons);
      setPlanets(sortedPlanets);
    }
    setIsSortedByMoons(!isSortedByMoons);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.pageTitle}>NASA - Oficial</Text>

      <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
        <Text style={styles.sortButtonText}>
          {isSortedByMoons ? 'Orden Original' : 'Ordenar por Lunas'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addButton, platformStyles.addButton]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={platformStyles.addButtonText}>+ {Platform.OS === 'android' ? 'Nuevo Planeta' : 'Crear Planeta'}</Text>
      </TouchableOpacity>

      <FlatList
        data={planets}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: '/details',
              params: { id: item.id },
            }}
            style={styles.card}
          >
            <Image source={{ uri: item.image }} style={styles.planetImage} />
            <Text style={styles.planetName}>{item.name}</Text>
          </Link>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Nuevo Planeta</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del planeta"
              placeholderTextColor="#555"
              value={newPlanet.name}
              onChangeText={(text) => setNewPlanet({ ...newPlanet, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              placeholderTextColor="#555"
              value={newPlanet.description}
              onChangeText={(text) => setNewPlanet({ ...newPlanet, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="URL de la imagen"
              placeholderTextColor="#555"
              value={newPlanet.image}
              onChangeText={(text) => setNewPlanet({ ...newPlanet, image: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Nombre de la luna"
              placeholderTextColor="#555"
              value={moonName}
              onChangeText={setMoonName}
            />
            <Button title="Agregar Luna" onPress={handleAddMoon} />
            {newPlanet.moon_names.length > 0 && (
              <View style={styles.moonList}>
                {newPlanet.moon_names.map((moon, index) => (
                  <Text key={index} style={styles.moonItem}>
                    - {moon}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.modalButtons}>
              <Button title="Agregar" onPress={handleAddPlanet} />
              <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const platformStyles = StyleSheet.create({
  addButton: {
    alignSelf: Platform.OS === 'android' ? 'flex-start' : 'flex-end',
    backgroundColor: Platform.OS === 'android' ? 'blue' : 'green',
  },
  addButtonText: {
    color: Platform.OS === 'android' ? 'white' : 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  sortButton: {
    alignSelf: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  flatListContainer: { paddingHorizontal: 5 },
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: '85%',
  },
  planetImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
  planetName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  moonList: { marginTop: 10 },
  moonItem: { fontSize: 14, color: '#333' },
});
