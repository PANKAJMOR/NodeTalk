import { useState, useEffect } from 'react';

const AuthImagePattern = ({ title, subtitle }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [clickedMessage, setClickedMessage] = useState(null);
  const [phoneHover, setPhoneHover] = useState(false);
  const [particleSpeed, setParticleSpeed] = useState(1);

  const messages = [
    { text: "Hey! How's it going? 👋", delay: 0, fullText: "Hey! How's it going? Hope you're having a great day!" },
    { text: "Just finished that project we talked about", delay: 2000, fullText: "Just finished that project we talked about. It turned out amazing!" },
    { text: "Want to grab coffee later? ☕️", delay: 4000, fullText: "Want to grab coffee later? I know this great new place downtown ☕️" },
    { text: "Sounds perfect! See you at 3 📅", delay: 6000, fullText: "Sounds perfect! See you at 3pm. Can't wait to catch up! 📅" }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPosition = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      };
      setMousePosition(newPosition);
      
      // Adjust particle speed based on mouse movement
      const speed = Math.sqrt(Math.pow(newPosition.x - mousePosition.x, 2) + Math.pow(newPosition.y - mousePosition.y, 2));
      setParticleSpeed(1 + speed * 0.1);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mousePosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, isHovering ? 4000 : 2000); // Slower when hovering

    return () => clearInterval(interval);
  }, [isHovering]);

  const handleMessageClick = (index) => {
    setClickedMessage(index);
    setTimeout(() => setClickedMessage(null), 2000);
  };

  const handlePhoneClick = () => {
    // Restart animation
    setCurrentMessageIndex(0);
  };

  return (
    <div 
      className="hidden lg:flex items-center justify-center relative overflow-hidden min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 transition-all duration-500"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Interactive Background Orbs */}
      <div className="absolute inset-0">
        <div 
          className={`absolute w-72 h-72 bg-purple-500/20 rounded-full blur-3xl transition-all duration-1000 ${
            isHovering ? 'animate-pulse scale-110' : 'animate-pulse'
          }`}
          style={{
            left: `${20 + mousePosition.x * 0.1}%`,
            top: `${10 + mousePosition.y * 0.1}%`,
            transform: `translate(-50%, -50%) ${isHovering ? 'rotate(10deg)' : 'rotate(0deg)'}`
          }}
        />
        <div 
          className={`absolute w-96 h-96 bg-blue-500/15 rounded-full blur-3xl transition-all duration-1000 ${
            isHovering ? 'animate-pulse scale-125' : 'animate-pulse'
          }`}
          style={{
            right: `${10 + mousePosition.x * 0.15}%`,
            bottom: `${15 + mousePosition.y * 0.1}%`,
            transform: `translate(50%, 50%) ${isHovering ? 'rotate(-15deg)' : 'rotate(0deg)'}`
          }}
        />
        <div 
          className={`absolute w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl transition-all duration-1000 ${
            isHovering ? 'animate-pulse scale-105' : 'animate-pulse'
          }`}
          style={{
            left: `${60 + mousePosition.x * 0.08}%`,
            top: `${70 + mousePosition.y * 0.12}%`,
            transform: `translate(-50%, -50%) ${isHovering ? 'rotate(5deg)' : 'rotate(0deg)'}`
          }}
        />
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-white/20 rounded-full transition-all duration-500 ${
              isHovering ? 'animate-bounce scale-150' : 'animate-bounce'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${(3 + Math.random() * 4) / particleSpeed}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-xs text-center px-6">
        {/* Interactive Phone Mockup */}
        <div className="mb-8 relative">
          <div 
            className={`mx-auto w-48 h-64 bg-gray-900/50 backdrop-blur-lg rounded-2xl p-3 border border-white/10 shadow-2xl transition-all duration-500 cursor-pointer ${
              phoneHover ? 'scale-105 shadow-purple-500/25 border-purple-500/30' : 'hover:scale-102'
            }`}
            onMouseEnter={() => setPhoneHover(true)}
            onMouseLeave={() => setPhoneHover(false)}
            onClick={handlePhoneClick}
          >
            <div className="w-full h-full bg-gray-800/50 rounded-xl p-3 relative overflow-hidden">
              {/* Interactive Status Bar */}
              <div className="flex justify-between items-center mb-3 text-white/60 text-xs">
                <span className={`transition-colors duration-300 ${phoneHover ? 'text-purple-300' : ''}`}>
                  9:41
                </span>
                <div className="flex space-x-1">
                  <div className={`w-3 h-1 bg-white/60 rounded-full transition-all duration-300 ${
                    phoneHover ? 'bg-green-400 animate-pulse' : ''
                  }`}></div>
                  <div className={`w-4 h-1 bg-white/80 rounded-full transition-all duration-300 ${
                    phoneHover ? 'bg-blue-400 animate-pulse' : ''
                  }`}></div>
                </div>
              </div>

              {/* Interactive Messages */}
              <div className="space-y-2 h-36 overflow-hidden">
                {messages.slice(0, 3).map((msg, index) => (
                  <div
                    key={index}
                    className={`transform transition-all duration-1000 cursor-pointer ${
                      index <= currentMessageIndex
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-4 opacity-0'
                    }`}
                    onClick={() => handleMessageClick(index)}
                  >
                    <div className={`max-w-32 p-2 rounded-xl text-xs transition-all duration-300 ${
                      index % 2 === 0
                        ? `bg-blue-500 text-white ml-auto rounded-br-sm hover:bg-blue-400 ${
                            clickedMessage === index ? 'scale-110 bg-blue-400' : ''
                          }`
                        : `bg-gray-600 text-white mr-auto rounded-bl-sm hover:bg-gray-500 ${
                            clickedMessage === index ? 'scale-110 bg-gray-500' : ''
                          }`
                    }`}>
                      {clickedMessage === index 
                        ? msg.fullText.split(' ').slice(0, 6).join(' ') + '...'
                        : msg.text.split(' ').slice(0, 3).join(' ') + '...'
                      }
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Typing Indicator */}
              <div className="absolute bottom-2 left-2">
                <div className={`flex space-x-1 bg-gray-600 rounded-full px-2 py-1 transition-all duration-300 ${
                  phoneHover ? 'bg-purple-600 scale-110' : ''
                }`}>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Text Content */}
        <div className="relative">
          <h2 className={`text-2xl font-bold text-white mb-4 leading-tight transition-all duration-500 ${
            isHovering ? 'scale-105' : ''
          }`}>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-blue-300 transition-all duration-300">
              {title}
            </span>
          </h2>
          <p className={`text-sm text-gray-300 leading-relaxed mb-6 transition-all duration-500 ${
            isHovering ? 'text-gray-200' : ''
          }`}>
            {subtitle}
          </p>

          {/* Interactive Feature Points */}
          <div className="space-y-2">
            {[
              { icon: '⚡', text: 'Real-time messaging', color: 'from-yellow-400 to-orange-400' },
              { icon: '🔒', text: 'Secure & private', color: 'from-green-400 to-emerald-400' }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-2 p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <span className="text-lg group-hover:scale-125 transition-transform duration-300">
                  {feature.icon}
                </span>
                <span className="text-white/80 text-xs group-hover:text-white transition-colors duration-300">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Decorative Elements */}
        <div 
          className={`absolute -top-10 -left-10 w-20 h-20 border border-purple-500/20 rounded-full transition-all duration-300 ${
            isHovering ? 'border-purple-400/40 scale-110' : ''
          }`}
          style={{ 
            animation: `spin ${isHovering ? '15s' : '20s'} linear infinite`
          }}
        ></div>
        <div 
          className={`absolute -bottom-10 -right-10 w-16 h-16 border border-blue-500/20 rounded-full transition-all duration-300 ${
            isHovering ? 'border-blue-400/40 scale-110' : ''
          }`}
          style={{ 
            animation: `spin ${isHovering ? '10s' : '15s'} linear infinite reverse`
          }}
        ></div>
      </div>
    </div>
  );
};

export default AuthImagePattern;
