import { StyleSheet, Text, View, Image, SafeAreaView, ActivityIndicator, Button, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getPlanetById, deletePlanetById, updatePlanet } from './api/apiServices';

export default function Details() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newDescription, setNewDescription] = useState('');
  const [newMoonName, setNewMoonName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPlanet = async () => {
      if (!id) return;
      const data = await getPlanetById(id);
      setPlanet(data);
      setNewDescription(data.description);
      setLoading(false);
    };

    fetchPlanet();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este planeta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            const success = await deletePlanetById(id);
            if (success) {
              Alert.alert('Eliminado', 'El planeta ha sido eliminado correctamente', [
                {
                  text: 'OK',
                  onPress: () => {
                    router.replace('/');
                  },
                },
              ]);
            } else {
              Alert.alert('Error', 'No se pudo eliminar el planeta');
            }
          },
        },
      ]
    );
  };

  const handleAddMoon = () => {
    if (newMoonName.trim()) {
      setPlanet((prevPlanet) => ({
        ...prevPlanet,
        moon_names: [...prevPlanet.moon_names, newMoonName.trim()],
        moons: prevPlanet.moons + 1,
      }));
      setNewMoonName('');
    }
  };

  const handleRemoveMoon = (moonToRemove) => {
    setPlanet((prevPlanet) => {
      const updatedMoons = prevPlanet.moon_names.filter((moon) => moon !== moonToRemove);
      return {
        ...prevPlanet,
        moon_names: updatedMoons,
        moons: updatedMoons.length,
      };
    });
  };

  const handleUpdatePlanet = async () => {
    const updatedPlanet = { ...planet, description: newDescription };
    const success = await updatePlanet(id, updatedPlanet);
    if (success) {
      Alert.alert('Actualizado', 'El planeta ha sido actualizado correctamente');
    } else {
      Alert.alert('Error', 'No se pudo actualizar el planeta');
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!planet) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.error}>Planeta no encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={{ uri: planet.image }} style={styles.planetImage} />
        <Text style={styles.planetName}>{planet.name}</Text>

        {isEditing ? (
          <TextInput
            style={styles.input}
            value={newDescription}
            onChangeText={setNewDescription}
            placeholder="Editar descripción"
          />
        ) : (
          <Text style={styles.description}>{planet.description}</Text>
        )}

        <Text style={styles.moons}>
          Lunas: {planet.moons} ({planet.moon_names?.join(', ')})
        </Text>

        {isEditing && (
          <>
            <TextInput
              style={styles.input}
              value={newMoonName}
              onChangeText={setNewMoonName}
              placeholder="Agregar luna"
            />
            <Button title="Agregar Luna" onPress={handleAddMoon} />

            <View style={styles.moonList}>
              {planet.moon_names?.map((moon, index) => (
                <View key={index} style={styles.moonItem}>
                  <Text>🌕 {moon}</Text>
                  <Button title="Eliminar" onPress={() => handleRemoveMoon(moon)} color="red" />
                </View>
              ))}
            </View>
          </>
        )}

        {isEditing ? (
          <Button title="Actualizar Planeta" onPress={handleUpdatePlanet} />
        ) : (
          <Button title="Editar Planeta" onPress={() => setIsEditing(true)} />
        )}

        <Button title="Eliminar Planeta" color="red" onPress={handleDelete} />

        <Text style={styles.backText} onPress={() => router.replace('/')}>
          Volver al inicio
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  container: { alignItems: 'center', marginTop: 20 },
  planetImage: { width: 200, height: 200, borderRadius: 100, marginBottom: 20 },
  planetName: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  moons: { fontSize: 16, fontStyle: 'italic', textAlign: 'center' },
  error: { fontSize: 20, color: 'red', textAlign: 'center' },
  backText: { fontSize: 18, color: '#007bff', marginTop: 20, textDecorationLine: 'underline' },
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
  moonList: { marginTop: 10 },
  moonItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
});
