import React, { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Activity, Radio, AlertCircle, CheckCircle, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MissionControlPage() {
  const [selectedMission, setSelectedMission] = useState(null);

  const missions = [
    {
      id: "mars-rover",
      name: "Mars Rover Alpha",
      status: "active",
      statusLabel: "Active",
      progress: 85,
      telemetry: {
        altitude: "0 m",
        velocity: "0.5 m/s",
        temperature: "-63°C",
        power: "92%",
      },
      lastUpdate: "2 minutes ago",
    },
    {
      id: "lunar-orbiter",
      name: "Lunar Orbiter Beta",
      status: "active",
      statusLabel: "Active",
      progress: 65,
      telemetry: {
        altitude: "100 km",
        velocity: "1.68 km/s",
        temperature: "-120°C",
        power: "78%",
      },
      lastUpdate: "5 minutes ago",
    },
    {
      id: "deep-space",
      name: "Deep Space Probe",
      status: "nominal",
      statusLabel: "Nominal",
      progress: 45,
      telemetry: {
        distance: "2.5 AU",
        velocity: "15 km/s",
        temperature: "-200°C",
        power: "65%",
      },
      lastUpdate: "1 hour ago",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-400";
      case "nominal":
        return "text-blue-400";
      case "warning":
        return "text-yellow-400";
      case "critical":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
      case "nominal":
        return <CheckCircle size={16} />;
      case "warning":
        return <AlertCircle size={16} />;
      case "critical":
        return <AlertCircle size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="text-rose-400" size={32} />
            <h1 className="text-5xl font-bold text-white">Mission Control Center</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl">
            Real-time mission monitoring and control. Manage spacecraft operations, monitor
            telemetry, and execute commands for active missions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-8 h-full">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Activity size={20} className="text-rose-400" />
                Mission Status
              </h3>

              {selectedMission ? (
                <div className="space-y-6">
                  {/* Mission Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-2">{selectedMission.name}</h4>
                      <div
                        className={`flex items-center gap-2 ${getStatusColor(selectedMission.status)}`}
                      >
                        {getStatusIcon(selectedMission.status)}
                        <span className="font-semibold">{selectedMission.statusLabel}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock size={14} />
                        {selectedMission.lastUpdate}
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-300">Mission Progress</span>
                      <span className="text-sm font-semibold text-rose-400">
                        {selectedMission.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-rose-600 to-red-600 h-3 rounded-full"
                        style={{ width: `${selectedMission.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Telemetry */}
                  <div>
                    <h4 className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-3">
                      Telemetry Data
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedMission.telemetry).map(([key, value]) => (
                        <div key={key} className="bg-slate-900/50 rounded-lg p-3">
                          <div className="text-xs text-slate-400 capitalize mb-1">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </div>
                          <div className="text-lg font-bold text-rose-400">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold">
                      Send Command
                    </Button>
                    <Button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                      View Timeline
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-400">
                  <p>Select a mission to view details</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Mission List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Radio size={20} className="text-rose-400" />
                Active Missions
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {missions.map((mission) => (
                  <button
                    key={mission.id}
                    onClick={() => setSelectedMission(mission)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedMission?.id === mission.id
                        ? "bg-rose-600/20 border border-rose-500"
                        : "bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-white">{mission.name}</div>
                      <div
                        className={`flex items-center gap-1 text-xs ${getStatusColor(mission.status)}`}
                      >
                        {getStatusIcon(mission.status)}
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-rose-600 to-red-600 h-2 rounded-full"
                        style={{ width: `${mission.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-400">{mission.progress}% complete</div>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Network Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Signal Strength</span>
                <span className="text-sm font-bold text-green-400">Excellent</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Latency</span>
                <span className="text-sm font-bold text-green-400">45 ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Bandwidth</span>
                <span className="text-sm font-bold text-green-400">2.5 Mbps</span>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Ground Stations</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">DSN Madrid</span>
                <span className="text-xs font-bold text-green-400">●</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">DSN Canberra</span>
                <span className="text-xs font-bold text-green-400">●</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">DSN Goldstone</span>
                <span className="text-xs font-bold text-yellow-400">●</span>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">CPU Usage</span>
                <span className="text-sm font-bold text-green-400">34%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Memory</span>
                <span className="text-sm font-bold text-green-400">62%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Storage</span>
                <span className="text-sm font-bold text-green-400">78%</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Mission Control Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Real-time Telemetry",
                  description: "Monitor spacecraft systems and sensor data in real-time.",
                },
                {
                  title: "Command Sequencing",
                  description: "Create and execute complex command sequences for spacecraft.",
                },
                {
                  title: "Timeline Management",
                  description: "Plan and manage mission timelines with precision scheduling.",
                },
                {
                  title: "Data Analysis",
                  description: "Analyze mission data and generate comprehensive reports.",
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-rose-600/20 border border-rose-500/30">
                      <span className="text-rose-400 font-bold">✓</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
