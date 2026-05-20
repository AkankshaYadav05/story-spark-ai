import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import NavListComponent from "./nav_list.component";
import NotificationComponent from "../notification/notification.component";
import { NotificationResponse } from "../../models/notification";
import { socketIo } from "../../socket/socket.oi";

const HeroSectionComponent = () => {
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    []
  );
  useEffect(() => {
    socketIo.on("pushNotification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });
    return () => {
      socketIo.off("pushNotification");
    };
  }, []);
  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <NavListComponent
        setShowNotification={setShowNotification}
        newNotify={notifications.length}
      />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-8 shadow-sm cursor-pointer hover:bg-slate-700/50 transition-colors">
          <span className="flex h-2.5 w-2.5 rounded-full bg-blue-400 animate-pulse"></span>
          <span className="text-sm font-semibold text-slate-300 tracking-wide">StorySparkAI v2.0 is live</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Ignite Your Imagination With <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm pb-2">
            AI-Driven Storytelling
          </span>
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed mb-10">
          Create, edit, and generate engaging multiple story variations from a single prompt. 
          Perfect for writers, creators, and enthusiasts exploring the future of fiction.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/stories" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-95 flex items-center justify-center gap-2 group">
              Start Writing for Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </Link>
          <Link to="/explore" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:bg-slate-700/60 text-slate-200 rounded-xl font-bold text-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2">
              Explore Stories
            </button>
          </Link>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature Card 1 */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 group cursor-pointer">
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-3">Infinite Variations</h3>
            <p className="text-slate-400 leading-relaxed">
              Generate multiple unique branches of your story from a single starting prompt. Explore every creative possibility.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 group cursor-pointer">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/30 transition-colors">
              <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-3">AI Co-Writer</h3>
            <p className="text-slate-400 leading-relaxed">
              Stuck on a paragraph? Let our advanced AI models suggest the next perfect sentence to keep your momentum going.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 group cursor-pointer">
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
              <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-3">Community Driven</h3>
            <p className="text-slate-400 leading-relaxed">
              Publish your stories, gather likes, and interact with other creators in a thriving, collaborative ecosystem.
            </p>
          </div>

        </div>
      </div>

      {showNotification && (
        <NotificationComponent
          notifications={notifications}
          showNotification={showNotification}
          setShowNotification={setShowNotification}
        />
      )}
    </div>
  );
};

export default HeroSectionComponent;
