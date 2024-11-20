export const analyzePackets = async (devices) => {
  // Simulated packet analysis logic
  const results = devices.map((device) => ({
    device,
    packetsAnalyzed: Math.floor(Math.random() * 1000) + 1, // Random packets
    suspiciousActivity: Math.random() > 0.8, // 20% chance
  }));

  return results;
};
