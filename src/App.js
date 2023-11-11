
import "./App.css";
import ReusableTable from "./components/ReusableTable";

function App() {
  const data = [
    { id: 1, name: "John Doe", age: 30 },
    { id: 2, name: "Jane Doe", age: 25 },
    { id: 3, name: "Peter Parker", age: 20 },
    { id: 4, name: "Clark Kent", age: 35 },
    { id: 5, name: "Bruce Wayne", age: 40 },
    { id: 6, name: "Diana Prince", age: 28 },
  ];

  const columns = [
    { header: "ID", accessorKey: "id", width: 50 ,isVisible: true},
    { header: "Name", accessorKey: "name", width: 50,isVisible: true },
    { header: "Age", accessorKey: "age", width: 50,isVisible: true },
  ];
  return (
    <div className="App">
   
      <ReusableTable data={data} columns={columns}/>
    </div>
  );
}

export default App;
