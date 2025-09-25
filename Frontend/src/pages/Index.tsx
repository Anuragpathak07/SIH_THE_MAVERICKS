import { useState } from "react";
import { SignIn } from "@/components/auth/SignIn";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignIn = () => {
    setIsLoggedIn(true);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <Dashboard onBackToHome={handleSignOut} />;
  }

  return <SignIn onSignIn={handleSignIn} />;
};

export default Index;
