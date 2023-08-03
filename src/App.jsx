import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import UserList from "./components/UserList";

function App() {
  const [users, setUsers] = useState([]);
  const [showColors, setShowColors] = useState(false);
  const [sortByCountry, setSortByCountry] = useState(false);
  const [filterCountry, setFilterCountry] = useState(null);
  const originalUsers = useRef([]);

  // useRef => se usa para guardar un valor que queremos que se comparta entre renderizados pero que al cambiar, no vuelva a renderizar el componente

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const toggleSortByCountry = () => {
    setSortByCountry((prevState) => !prevState);
  };

  const handleDelete = (email) => {
    const filteredUser = users.filter((user) => user.email !== email);
    setUsers(filteredUser);
  };

  const handleReset = () => {
    setUsers(originalUsers.current);
  };

  //Cuando se renderiza por primera vez el componente, originalUsers toma el valor del resultado del llamado de la API, osea que guarda como referencia los usuarios traidos de la api.
  useEffect(() => {
    fetch("https://randomuser.me/api?results=100")
      .then(async (res) => await res.json())
      .then((res) => {
        setUsers(res.results);
        originalUsers.current = res.results;
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // El filtro que se implementará verifica con el valor del input guardado en filterCountry y el uso de un operador ternario, si esta presente el valor pasa a usar un filter y retorna todos los usuarios que incluyan el valor de filterCountry

  const filteredUsers = useMemo(() => {
    return typeof filterCountry === "string" && filterCountry.length > 0
      ? users.filter((user) => {
          return user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase());
        })
      : users;
  }, [users, filterCountry]);

  //Nos aseguramos de filtrar los usuarios primero y luego ordenarlos.

  //Al realizar el ordenamiento de esta forma .sort(), tenemos que saber y tener en cuenta que sort muta el array original, entonces al tratar de devolver users, este será devuelto ya ordenado.

  // Para arreglarlo podemos hacer una copia de users de la siguiente forma [...users]

  // Otra forma es realizar un structuredClone

  /* const sortedUsers = sortByCountry
    ? filteredUsers.toSorted((a, b) => {
        return a.location.country.localeCompare(b.location.country);
      })
    : filteredUsers;
 */

  const sortedUsers = useMemo(() => {
    return sortByCountry
      ? filteredUsers.toSorted((a, b) =>
          a.location.country.localeCompare(b.location.country)
        )
      : filteredUsers;
  }, [filteredUsers, sortByCountry]);

  return (
    <div className="App">
      <h1>Prueba Tecnica react</h1>
      <header>
        <button onClick={toggleColors}>Colorear filas</button>
        <button onClick={toggleSortByCountry}>
          {sortByCountry ? "No ordenar por pais" : "Ordenar por pais"}
        </button>
        <button onClick={handleReset}>Restablecer usuarios</button>
        <input
          type="text"
          placeholder="Filtra por pais"
          onChange={(e) => {
            setFilterCountry(e.target.value);
          }}
        />
      </header>
      <main>
        <UserList
          deleteUser={handleDelete}
          showColors={showColors}
          users={sortedUsers}
        />
      </main>
    </div>
  );
}

export default App;
