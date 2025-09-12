import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";

export default function CustomerLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navigation tetap di atas */}
      <Navigation />

      {/* Main content area dengan scroll */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col">
          {/* Content area */}
          <div className="flex-1">
            <Outlet />
          </div>
          
          {/* Footer di dalam scrollable area */}
          <footer className="bg-white shadow-inner py-8 text-center text-gray-600 text-sm border-t border-gray-200 mt-12 flex-shrink-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Radar Banjarmasin</span>
                  <span>•</span>
                  <span>© {new Date().getFullYear()} All rights reserved.</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}