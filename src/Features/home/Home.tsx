import { Link } from 'react-router-dom'; // Adicione esta linha

export function Home() { // Note o 'export' aqui
  return (
    <div>
      <h1>Databaker</h1>
      <Link to="/login">Ir para Login</Link>
        <br />
     
    </div>
  );
}

// Exporte como padrão se preferir
export default Home;
