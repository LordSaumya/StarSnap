import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const supabaseUrl = "https://riashvlmualipdicirlb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYXNodmxtdWFsaXBkaWNpcmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc2MzgwNjIsImV4cCI6MjAwMzIxNDA2Mn0._aTzU3_PMXZdpxI-_gp1JaFMevd080yGYURIubIzibE";
const supabaseClient = createClient(supabaseUrl, supabaseKey);



const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabaseClient.auth.session();
    setUser(session?.user ?? null);
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          {user ? <Redirect to="/account" /> : <SignIn />}
        </Route>
        <Route exact path="/signup">
          {user ? <Redirect to="/account" /> : <SignUp />}
        </Route>
        <Route exact path="/account">
          {user ? <AccountPage user={user} /> : <Redirect to="/login" />}
        </Route>
        <Route path="*">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
