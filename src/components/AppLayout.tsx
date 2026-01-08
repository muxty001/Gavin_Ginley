import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AppLayout: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    eventType: "",
    date: "",
    message: "",
  });

  const heroImage = "/gavin.jpg";

  const galleryImages = [
    "/gavin.jpg",
    "/gavin.jpg",
    "/gavin.jpg",
    "/gavin.jpg",
  ];

  useEffect(() => {
    if (isScrolled) setMobileMenuOpen(false);
  }, [isScrolled]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = [
        "hero",
        "about",
        "music",
        "youtube",
        "gallery",
        "signup",
        "contact",
      ];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscriptionStatus("loading");
    setSubscriptionMessage("");

    try {
      const { data, error } = await supabase.functions.invoke(
        "subscribe-email",
        {
          body: { email },
        }
      );

      if (error) {
        throw error;
      }

      if (data.success) {
        setSubscriptionStatus("success");
        setSubscriptionMessage(data.message);
        setEmail("");
      } else {
        setSubscriptionStatus("error");
        setSubscriptionMessage(data.error || "Something went wrong");
      }
    } catch (err: any) {
      setSubscriptionStatus("error");
      setSubscriptionMessage(
        err.message || "Failed to subscribe. Please try again."
      );
    }
  };
  const handleBookingChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // For now: mailto (simple & reliable)
    const mailtoLink = `mailto:management@gavinginley.com?subject=Booking Request&body=
Name: ${bookingData.name}%0D%0A
Email: ${bookingData.email}%0D%0A
Event Type: ${bookingData.eventType}%0D%0A
Event Date: ${bookingData.date}%0D%0A
Message: ${bookingData.message}`;

    window.location.href = mailtoLink;
    setIsBookingOpen(false);
  };

  const resetSubscriptionForm = () => {
    setSubscriptionStatus("idle");
    setSubscriptionMessage("");
    setEmail("");
  };

  const navLinks = [
    { id: "about", label: "About" },
    { id: "music", label: "Music" },
    { id: "booking", label: "Booking" },
    { id: "youtube", label: "YouTube" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Fixed Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-md py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="text-xl font-bold tracking-wider hover:text-purple-400 transition-colors"
          >
            GG
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-sm uppercase tracking-widest transition-colors ${
                  activeSection === link.id
                    ? "text-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <a
            href="https://www.youtube.com/@GavinGinleyOfficial"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm uppercase tracking-widest text-gray-400 hover:text-purple-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          {/* Mobile Menu Button */}
          {/* <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button> */}
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-6 pt-4 flex flex-col gap-4 bg-[#0a0a0a]/95 backdrop-blur-md">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  scrollToSection(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`satisfy-regular text-left text-sm uppercase tracking-widest ${
                  activeSection === link.id
                    ? "text-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Gavin Ginley"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20" />
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6 animate-fade-in">
            <span className="bg-gradient-to-r pirata-one-regular from-white via-purple-200 to-white bg-clip-text text-transparent">
              GAVIN GINLEY
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 tracking-[0.3em] uppercase animate-fade-in-delay">
            New era loading
          </p>
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection("music")}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium tracking-wider uppercase text-sm transition-all duration-300 hover:scale-105"
            >
              Listen Soon
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="px-8 py-3 border border-white/30 hover:border-white/60 text-white font-medium tracking-wider uppercase text-sm transition-all duration-300 hover:bg-white/10"
            >
              Discover
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => scrollToSection("about")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <svg
            className="w-6 h-6 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-8">
            About
          </h2>
          <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-gray-200">
            This comes from somewhere real... 🦅
          </p>
          <div className="mt-12 w-24 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" />
        </div>
      </section>

      {/* Music Coming Soon Section */}
      <section
        id="music"
        className="py-32 px-6 bg-gradient-to-b from-[#0a0a0a] via-purple-950/10 to-[#0a0a0a]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-8">
            Music
          </h2>
          <div className="relative">
            {/* Gramophone GIF */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/gramophone.png" // put your GIF path here
                alt="Gramophone"
                className="w-100 h-100 object-contain"
              />
            </div>

            <div className="relative z-10 py-20">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Debut Single
              </h3>
              <p className="text-xl text-gray-400 tracking-wider">
                Coming Soon
              </p>
              <div className="mt-8 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-100" />
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-200" />
              </div>
              <p className="mt-8 text-gray-500 text-sm uppercase tracking-widest">
                New music loading
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <section
        id="signup"
        className="py-32 px-6 bg-gradient-to-b from-[#0a0a0a] via-purple-950/20 to-[#0a0a0a]"
      >
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-4">
            Stay Connected
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Journey
          </h3>
          <p className="text-gray-400 mb-8">
            Be the first to hear new music, see exclusive content, and get
            updates on upcoming releases.
          </p>

          {subscriptionStatus === "success" ? (
            <div className="p-6 bg-purple-600/20 border border-purple-500/30 rounded-lg">
              <svg
                className="w-12 h-12 text-purple-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-lg text-white">{subscriptionMessage}</p>
            </div>
          ) : subscriptionStatus === "error" ? (
            <div className="space-y-4">
              <div className="p-6 bg-red-600/20 border border-red-500/30 rounded-lg">
                <svg
                  className="w-12 h-12 text-red-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-lg text-white">{subscriptionMessage}</p>
              </div>
              <button
                onClick={resetSubscriptionForm}
                className="px-6 py-3 text-purple-400 hover:text-purple-300 font-medium tracking-wider uppercase text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={subscriptionStatus === "loading"}
                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={subscriptionStatus === "loading"}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-medium tracking-wider uppercase text-sm transition-all duration-300 rounded-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {subscriptionStatus === "loading" ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Joining...</span>
                  </>
                ) : (
                  "Join"
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* YouTube Section */}
      <section id="youtube" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-12 text-center">
            YouTube
          </h2>

          <div className="relative group">
            <div className="aspect-video bg-[#111] rounded-lg overflow-hidden border border-white/10 relative">
              <img
                src={heroImage}
                alt="YouTube Channel"
                className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <a
                  href="https://www.youtube.com/@GavinGinleyOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-20 h-20 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group-hover:shadow-lg group-hover:shadow-red-600/30"
                >
                  <svg
                    className="w-8 h-8 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </a>
                <p className="mt-6 text-lg text-white/80">Watch on YouTube</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-6">
              Music videos, visuals & trailers coming soon
            </p>
            <a
              href="https://www.youtube.com/@GavinGinleyOfficial"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all duration-300"
            >
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span className="text-white">Subscribe to Channel</span>
            </a>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-8">
            Visuals
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["Music Video", "Behind the Scenes", "Live Performance"].map(
              (title, index) => (
                <div
                  key={index}
                  className="aspect-video bg-[#111] rounded-lg border border-white/5 flex items-center justify-center group hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-500/20 transition-colors">
                      <svg
                        className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className="text-gray-600 text-xs mt-1">Coming Soon</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-12 text-center">
            Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className="aspect-[3/4] overflow-hidden rounded-lg group relative"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt="Gallery enlarged"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Booking Section */}
      <section id="booking" className="py-32 px-6 bg-[#080808]">
        <div className="max-w-4xl mx-auto text-center">
          {/* <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-4">
            Booking
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Live Shows & Appearances
          </h3>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
            For live performances, festivals, private events, brand
            collaborations, and special appearances.
          </p> */}

          <button
            onClick={() => setIsBookingOpen(true)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-medium tracking-wider uppercase text-sm transition-all duration-300 rounded-lg hover:scale-105"
          >
            Booking
          </button>
        </div>
      </section>
      {isBookingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={() => setIsBookingOpen(false)}
        >
          {/* Modal */}
          <div
            className="relative w-full max-w-lg rounded-xl border border-white/10 bg-[#0a0a0a] p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              ✕
            </button>

            {/* Header */}
            <h3 className="mb-2 text-2xl font-bold text-white">
              Booking Request
            </h3>
            <p className="mb-6 text-gray-400">
              Fill in the details and management will get back to you.
            </p>

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <input
                name="name"
                required
                placeholder="Your Name"
                onChange={handleBookingChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-500"
              />

              <input
                name="email"
                type="email"
                required
                placeholder="Your Email"
                onChange={handleBookingChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-500"
              />

              <select
                name="eventType"
                required
                onChange={handleBookingChange}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-purple-500"
              >
                <option value="" className="text-gray-400">
                  Select Booking Type
                </option>
                
                <option className="bg-[#0a0a0a]">Private Appearance</option>
                
                <option className="bg-[#0a0a0a]">Brand Collaboration</option>
              </select>

              <input
                type="date"
                name="date"
                onChange={handleBookingChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-500"
              />

              <textarea
                name="message"
                rows={4}
                placeholder="Additional details"
                onChange={handleBookingChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-500"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-purple-600 py-4 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-purple-500 hover:scale-[1.02]"
              >
                Submit Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-4">
                Contact
              </h2>
              {/* <h3 className="text-2xl font-bold mb-4">
                Management & Inquiries
              </h3> */}
              {/* <p className="text-gray-400 mb-6">
                For booking, press, and business inquiries.
              </p> */}
              <a
                href="mailto:management@gavinginley.com"
                className="inline-flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                management@gavinginley.com
              </a>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-4">
                Location
              </h2>
              <h3 className="text-2xl font-bold mb-4">GLOBAL</h3>
              <p className="text-gray-400">Creating music without borders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl pirata-one-regular font-bold tracking-wider">
                GAVIN GINLEY
              </span>
            </div>
            <div className="flex items-center justify-center gap-8">
              {/* Instagram */}
              <a
                href="https://instagram.com/Gavin_Ginley"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <svg
                  className="w-6 h-6 text-red-500 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Spotify */}
              <a
                href="https://open.spotify.com/artist/YOUR_ARTIST_ID"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-green-600 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <svg
                  className="w-6 h-6 text-red-500 group-hover:text-white transition-colors"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.478 17.318a.748.748 0 0 1-1.03.248c-2.82-1.724-6.37-2.114-10.547-1.159a.75.75 0 0 1-.335-1.462c4.57-1.045 8.49-.6 11.63 1.32a.75.75 0 0 1 .282 1.053zm1.473-3.279a.936.936 0 0 1-1.287.31c-3.228-1.984-8.148-2.56-11.96-1.404a.938.938 0 0 1-.543-1.795c4.36-1.323 9.772-.684 13.502 1.623a.936.936 0 0 1 .288 1.266zm.127-3.414c-3.87-2.298-10.26-2.51-13.95-1.392a1.125 1.125 0 0 1-.65-2.152c4.24-1.287 11.31-1.04 15.77 1.622a1.125 1.125 0 0 1-1.17 1.922z" />
                </svg>
              </a>

              {/* Apple */}
              <a
                href="https://music.apple.com/artist/YOUR_ARTIST_ID"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-pink-500 hover:to-red-500 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <svg
                  className="w-6 h-6 text-red-500 group-hover:text-white transition-colors"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16.365 1.43c-.114-.01-.23.003-.344.034L7.16 3.53A2 2 0 0 0 5.7 5.47v11.33c-.37-.13-.77-.2-1.19-.2-1.93 0-3.5 1.34-3.5 3s1.57 3 3.5 3 3.5-1.34 3.5-3V9.02l7-1.56v7.14c-.37-.13-.77-.2-1.19-.2-1.93 0-3.5 1.34-3.5 3s1.57 3 3.5 3 3.5-1.34 3.5-3V3.43a2 2 0 0 0-1.955-2z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@gavinginley"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110 group border border-transparent hover:border-white/20"
              >
                <svg
                  className="w-6 h-6 text-red-500 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@GavinGinleyOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <svg
                  className="w-6 h-6 text-red-500 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 Gavin Ginley. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
