

// ErrorBoundary.jsx (or inline in Layout/AppProviders)

import React from "react";



/**

 * Minimal error boundary that prevents provider failures from taking down the app.

 * Renders children anyway via a fallback that returns children.

 */

export class ErrorBoundary extends React.Component {

  constructor(props) {

    super(props);

    this.state = { hasError: false, error: null };

  }



  static getDerivedStateFromError(error) {

    return { hasError: true, error };

  }



  componentDidCatch(error, info) {

    // No global side-effects: do not log unless a logger is injected.

    if (typeof this.props.onError === "function") {

      try {

        this.props.onError(error, info);

      } catch {

        // swallow

      }

    }

  }



  render() {

    if (this.state.hasError) {

      // Degrade gracefully: keep rendering the app.

      return typeof this.props.fallback === "function"

        ? this.props.fallback({ error: this.state.error, children: this.props.children })

        : this.props.children;

    }

    return this.props.children;

  }

}



/**

 * SafeProvider: wraps any provider component so that if it throws, we still render children.

 * Architecture rule: providers degrade gracefully to no-op.

 */

export function SafeProvider({ Provider, providerProps, children, name = "Provider", onError }) {

  const Fallback = ({ children: innerChildren }) => innerChildren;

  return (

    <ErrorBoundary

      onError={(err, info) => onError?.({ name, err, info })}

      fallback={({ children: innerChildren }) => <Fallback>{innerChildren}</Fallback>}

    >

      {Provider ? <Provider {...(providerProps ?? {})}>{children}</Provider> : children}

    </ErrorBoundary>

  );

}

2) No-op Providers (Guaranteed Rendering)

// noopProviders.js

import React from "react";



/**

 * No-op Firebase provider: does NOT initialize Firebase.

 * Use this when Firebase is unavailable or initialization fails.

 */

export function NoopFirebaseProvider({ children }) {

  return <>{children}</>;

}



/**

 * No-op AI provider: does NOT initialize any model/client.

 */

export function NoopAIProvider({ children }) {

  return <>{children}</>;

}

3) AppProviders Wrapper (Firebase + AI are Optional)

// AppProviders.jsx

import React from "react";

import { SafeProvider } from "./ErrorBoundary";

import { NoopFirebaseProvider, NoopAIProvider } from "./noopProviders";



/**

 * IMPORTANT:

 * - No global side effects on import.

 * - Do NOT initialize Firebase/AI at module scope.

 * - Lazily select real providers at runtime; if anything fails, fall back to no-op.

 */

export default function AppProviders({ children, providers }) {

  // `providers` is injected (dependency inversion) to avoid direct coupling.

  // Example shape:

  // providers = { FirebaseProvider, AIProvider, firebaseProps, aiProps, onProviderError }



  const onProviderError = providers?.onProviderError;



  const FirebaseProvider = providers?.FirebaseProvider ?? NoopFirebaseProvider;

  const AIProvider = providers?.AIProvider ?? NoopAIProvider;



  return (

    <SafeProvider

      name="FirebaseProvider"

      Provider={FirebaseProvider}

      providerProps={providers?.firebaseProps}

      onError={onProviderError}

    >

      <SafeProvider

        name="AIProvider"

        Provider={AIProvider}

        providerProps={providers?.aiProps}

        onError={onProviderError}

      >

        {children}

      </SafeProvider>

    </SafeProvider>

  );

}

4) Fixed Layout Component (Syntax + Rendering)

// Layout.jsx

import React from "react";

import { Link } from "react-router-dom";

import { createPageUrl } from "@/utils";

import {

  LayoutDashboard,

  Briefcase,

  FileText,

  Sparkles,

  User,

  Menu,

  X,

  BarChart3,

} from "lucide-react";

import { Button } from "@/components/ui/button";



export default function Layout({ children, currentPageName }) {

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);



  const navigation = [

    { name: "Home", page: "Home", icon: LayoutDashboard },

    { name: "Dashboard", page: "Dashboard", icon: BarChart3 },

    { name: "Projects", page: "Projects", icon: Briefcase },

    { name: "Reports", page: "Reports", icon: FileText },

    { name: "Skill Mapping", page: "SkillMapping", icon: Sparkles },

    { name: "Profile", page: "Profile", icon: User },

  ];



  const isActive = (pageName) => currentPageName === pageName;



  return (

    <div className="min-h-screen bg-slate-50">

      {/* Navigation */}

      <nav className="bg-slate-900 border-b border-slate-800">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-16">

            <div className="flex items-center space-x-8">

              <Link to={createPageUrl("Home")} className="flex items-center space-x-3">

                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">

                  <Sparkles className="w-5 h-5 text-white" />

                </div>

                <span className="text-xl font-bold text-white">SCRE</span>

              </Link>



              {/* Desktop Navigation */}

              <div className="hidden md:flex items-center space-x-1">

                {navigation.map((item) => {

                  const Icon = item.icon;

                  const active = isActive(item.page);



                  return (

                    <Link

                      key={item.page}

                      to={createPageUrl(item.page)}

                      className={[

                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",

                        active

                          ? "bg-slate-800 text-white"

                          : "text-slate-300 hover:bg-slate-800 hover:text-white",

                      ].join(" ")}

                    >

                      <Icon className="w-4 h-4 mr-2" />

                      {item.name}

                    </Link>

                  );

                })}

              </div>

            </div>



            {/* Mobile menu button */}

            <div className="md:hidden">

              <Button

                variant="ghost"

                size="icon"

                onClick={() => setMobileMenuOpen((v) => !v)}

                className="text-slate-300 hover:text-white hover:bg-slate-800"

                aria-label="Toggle navigation menu"

              >

                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}

              </Button>

            </div>

          </div>

        </div>



        {/* Mobile Navigation */}

        {mobileMenuOpen && (

          <div className="md:hidden border-t border-slate-800">

            <div className="px-2 pt-2 pb-3 space-y-1">

              {navigation.map((item) => {

                const Icon = item.icon;

                const active = isActive(item.page);



                return (

                  <Link

                    key={item.page}

                    to={createPageUrl(item.page)}

                    onClick={() => setMobileMenuOpen(false)}

                    className={[

                      "flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors",

                      active

                        ? "bg-slate-800 text-white"

                        : "text-slate-300 hover:bg-slate-800 hover:text-white",

                    ].join(" ")}

                  >

                    <Icon className="w-5 h-5 mr-3" />

                    {item.name}

                  </Link>

                );

              })}

            </div>

          </div>

        )}

      </nav>



      {/* Main Content */}

      <main>{children}</main>



      {/* Footer */}

      <footer className="bg-white border-t border-slate-200 mt-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <div className="flex flex-col md:flex-row items-center justify-between">

            <p className="text-sm text-slate-600">© 2025 Skill Conversion Risk Engine. Powered by AI.</p>

            <div className="flex items-center space-x-6 mt-4 md:mt-0">

              <a href="#" className="text-sm text-slate-600 hover:text-slate-900">

                Documentation

              </a>

              <a href="#" className="text-sm text-slate-600 hover:text-slate-900">

                Support

              </a>

              <a href="#" className="text-sm text-slate-600 hover:text-slate-900">

                Privacy

              </a>

            </div>

          </div>

        </div>

      </footer>

    </div>

  );

}

5) Integration Example (Ensures Render if ALL Providers Fail)

// main.jsx (example) — no global side effects on import

import React from "react";

import ReactDOM from "react-dom/client";

import AppProviders from "./AppProviders";

import App from "./App";



// Real providers are injected at runtime; if they throw, SafeProvider keeps rendering App.

const providers = {

  FirebaseProvider: undefined, // supply your real FirebaseProvider here

  AIProvider: undefined,       // supply your real AIProvider here

  firebaseProps: undefined,

  aiProps: undefined,

  onProviderError: ({ name, err }) => {

    // Optional: forward to your logger (do not crash)

    // console.error(`[${name}] failed`, err);

  },

};



ReactDOM.createRoot(document.getElementById("root")).render(

  <React.StrictMode>

    <AppProviders providers={providers}>

      <App />

    </AppProviders>

  </React.StrictMode>

);
