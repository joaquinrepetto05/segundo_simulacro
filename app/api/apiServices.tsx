// Devolver todos los planetas
export const getPlanets = async () => {
    const URL = "https://segundo-simulacro.loca.lt/planets";
    try {
        const response = await fetch(URL, {
            headers: {
                "bypass-tunnel-reminder": true,
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Datos de la API:", data);
            return data;
        } else {
            console.log("Error getting info");
            return [];
        }
    } catch (error) {
        console.error(error);
    }
};

// Devolver el planeta por ID
export const getPlanetById = async (id: string) => {
    const URL = `https://segundo-simulacro.loca.lt/planets/${id}`;
    try {
        const response = await fetch(URL, {
            headers: {
                "bypass-tunnel-reminder": true,
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.log("Error getting info");
            return [];
        }
    } catch (error) {
        console.error(error);
    }
};

// Agregar un nuevo planeta
export const addPlanet = async (planet: { name: string, description: string, image: string }) => {
    const URL = "https://segundo-simulacro.loca.lt/planets";
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'bypass-tunnel-reminder': 'true',
            },
            body: JSON.stringify(planet),
        });

        if (response.ok) {
            return true;
        } else {
            console.log('Error al agregar el planeta');
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
        return false;
    }
};


// Eliminar planeta por ID
export const deletePlanetById = async (id: string) => {
    const URL = `https://segundo-simulacro.loca.lt/planets/${id}`;
    try {
        const response = await fetch(URL, {
            method: 'DELETE',
            headers: {
                'bypass-tunnel-reminder': 'true',
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return true;
        } else {
            console.log('Error al eliminar el planeta');
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
        return false;
    }
};

// Actualizar planeta por ID
export const updatePlanet = async (id: string, updatedPlanet: { description: string, moon_names: string[] }) => {
    const URL = `https://segundo-simulacro.loca.lt/planets/${id}`;
    try {
      const response = await fetch(URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true',
        },
        body: JSON.stringify(updatedPlanet),
      });
  
      if (response.ok) {
        return true;
      } else {
        console.log('Error al actualizar el planeta');
        return false;
      }
    } catch (error) {
      console.error('Error de red:', error);
      return false;
    }
  };  