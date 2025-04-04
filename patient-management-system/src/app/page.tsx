import React from "react";
import { Users, Clock, Package, Stethoscope, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const LandingPage = () => {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Patient Management",
      description:
        "Efficiently manage and track patient records with comprehensive profiles and history.",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Queue System",
      description:
        "Streamline patient waiting times with our intelligent queue management system.",
    },
    {
      icon: <Package className="h-6 w-6 text-blue-600" />,
      title: "Inventory Control",
      description:
        "Keep track of medical supplies and equipment with real-time inventory management.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
      {/* Header with glass effect */}
      <header className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              MediPanel
            </span>
          </div>
          <Link href="/login">
            <button className="bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Login
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Healthcare Management
            <span className="text-blue-600"> Simplified</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your medical practice with our comprehensive patient
            management system. Designed for healthcare professionals who want to
            focus more on patient care.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href={"/dashboard"}>
                <button className="group w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600/90 backdrop-blur-sm hover:bg-blue-700 transition-all duration-300 md:py-4 md:text-lg md:px-10">
                  Dashboard{" "}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with glass cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow bg-white/50 backdrop-blur-sm border border-white/20"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100/80 backdrop-blur-sm mx-auto">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900 text-center">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2025 ColorNovels. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
