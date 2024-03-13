import Home from "./routes/home/home.component";
import { Routes,Route } from "react-router-dom";
import Navigation from "./routes/navigation/navigation.component";
import Authentication from "./routes/authentication/authentication.component";
import Validate from "./components/validate/validate.component";
const Shop = ()=>{
  return <div><h1>I am shop</h1></div>
}
const App = ()=> {
  return(
    <Routes>
      <Route path='/' element={<Navigation/>}>
        <Route index element={<Home/>}/>
        <Route path='validate' element={<Validate/>}/>
        <Route path='shop' element={<Shop/>}/>
        <Route path='auth' element={<Authentication/>}/>
      </Route>
    </Routes>
  );
};

export default App;
