/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DesignAnalyzer from "./components/DesignAnalyzer";
import Showcase from "./components/Showcase";
import LogoGenerator from "./components/LogoGenerator";
import About from "./components/About";
import Footer from "./components/Footer";
import { AuthProvider } from "./lib/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <Navbar />
        <main>
          <Hero />
          <DesignAnalyzer />
          <Showcase />
          <LogoGenerator />
          <About />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
