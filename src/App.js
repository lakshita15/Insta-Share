import logo from './logo.svg';
import './App.css';
import AuthProvider from './Context/AuthProvider';
import SignUp from './Components/SignUp/SignUp';
import SignIn from './Components/SignIn/SignIn';
import { BrowserRouter as Router, Switch,Route} from "react-router-dom"
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import Feed from './Components/Feed/Feed';
import Profile from './Components/Profile/Profile';
import User from './Components/UserProfile/User';
import Chat from './Components/Chat/Chat';
// 1. Wrap in router
function App() {
  return (
<Router>
    <AuthProvider>
  <Switch>
      <PrivateRoute exact path='/' component={Feed}></PrivateRoute>
      <PrivateRoute path='/profile' component={Profile}></PrivateRoute>
      <PrivateRoute exact path='/chat' component={Chat} />
      <Route path='/login' component={SignIn}></Route>
      <Route path='/SignUp' component={SignUp}></Route>
      <Route path='/user' component={User}></Route>
  </Switch>
    </AuthProvider>
</Router>
  );
}

export default App;
