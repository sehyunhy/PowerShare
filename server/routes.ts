import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertEnergyRequestSchema, insertEnergyProviderSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

interface WebSocketClient extends WebSocket {
  userId?: number;
  isAlive?: boolean;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocketClient>();

  // Heartbeat mechanism for WebSocket connections
  function heartbeat(this: WebSocketClient) {
    this.isAlive = true;
  }

  wss.on('connection', (ws: WebSocketClient) => {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    clients.add(ws);

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'auth' && data.userId) {
          ws.userId = data.userId;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Send updates to all connected clients
  function broadcastUpdate(type: string, data: any) {
    const message = JSON.stringify({ type, data });
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Clean up dead connections
  setInterval(() => {
    clients.forEach((ws) => {
      if (!ws.isAlive) {
        clients.delete(ws);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  // Authentication endpoints
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error });
    }
  });

  // User endpoints
  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error });
    }
  });

  // Energy provider endpoints
  app.get('/api/providers', async (req, res) => {
    try {
      const providers = await storage.getActiveEnergyProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get providers", error });
    }
  });

  app.post('/api/providers', async (req, res) => {
    try {
      const providerData = insertEnergyProviderSchema.parse(req.body);
      const provider = await storage.createEnergyProvider(providerData);
      res.json(provider);
      broadcastUpdate('provider_added', provider);
    } catch (error) {
      res.status(400).json({ message: "Invalid provider data", error });
    }
  });

  app.get('/api/providers/user/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const providers = await storage.getEnergyProvidersByUser(userId);
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user providers", error });
    }
  });

  app.put('/api/providers/:id/energy', async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { currentProduction, availableEnergy } = req.body;
      
      await storage.updateProviderEnergyData(providerId, currentProduction, availableEnergy);
      
      const updatedProvider = await storage.getEnergyProvider(providerId);
      res.json(updatedProvider);
      broadcastUpdate('energy_update', { providerId, currentProduction, availableEnergy });
    } catch (error) {
      res.status(500).json({ message: "Failed to update energy data", error });
    }
  });

  // Energy request endpoints
  app.get('/api/requests', async (req, res) => {
    try {
      const requests = await storage.getPendingEnergyRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to get requests", error });
    }
  });

  app.post('/api/requests', async (req, res) => {
    try {
      const requestData = insertEnergyRequestSchema.parse(req.body);
      const request = await storage.createEnergyRequest(requestData);
      
      // Trigger AI matching algorithm
      await performEnergyMatching(request.id);
      
      res.json(request);
      broadcastUpdate('new_request', request);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data", error });
    }
  });

  app.get('/api/requests/user/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const requests = await storage.getEnergyRequestsByUser(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user requests", error });
    }
  });

  // Transaction endpoints
  app.get('/api/transactions/user/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getTransactionsByUser(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transactions", error });
    }
  });

  app.get('/api/transactions/recent/:limit?', async (req, res) => {
    try {
      const limit = parseInt(req.params.limit || '10');
      const transactions = await storage.getRecentTransactions(limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent transactions", error });
    }
  });

  // Community stats endpoint
  app.get('/api/community/stats', async (req, res) => {
    try {
      let stats = await storage.getCommunityStats();
      if (!stats) {
        // Initialize community stats if they don't exist
        stats = await storage.updateCommunityStats({
          totalProduction: "0",
          totalConsumption: "0",
          activeProviders: 0,
          activeConsumers: 0,
          currentFlowRate: "0"
        });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community stats", error });
    }
  });

  // AI Matching Algorithm (simplified version)
  async function performEnergyMatching(requestId: number) {
    try {
      const request = await storage.getEnergyRequest(requestId);
      if (!request) return;

      const providers = await storage.getActiveEnergyProviders();
      
      // Simple matching algorithm based on available energy and proximity
      const suitableProviders = providers.filter(provider => 
        parseFloat(provider.availableEnergy || "0") >= parseFloat(request.energyAmount)
      );

      if (suitableProviders.length > 0) {
        // Select the provider with the most available energy
        const bestProvider = suitableProviders.reduce((prev, current) => 
          parseFloat(current.availableEnergy || "0") > parseFloat(prev.availableEnergy || "0") ? current : prev
        );

        // Update request with matched provider
        await storage.updateEnergyRequest(requestId, {
          status: "matched",
          matchedProviderId: bestProvider.id
        });

        // Create transaction
        const transaction = await storage.createEnergyTransaction({
          requestId: requestId,
          providerId: bestProvider.id,
          consumerId: request.userId,
          energyAmount: request.energyAmount,
          pricePerKwh: bestProvider.pricePerKwh || "0.15",
          totalPrice: (parseFloat(request.energyAmount) * parseFloat(bestProvider.pricePerKwh || "0.15")).toString(),
          status: "pending"
        });

        // Update provider's available energy
        const newAvailable = parseFloat(bestProvider.availableEnergy || "0") - parseFloat(request.energyAmount);
        await storage.updateProviderEnergyData(bestProvider.id, parseFloat(bestProvider.currentProduction || "0"), newAvailable);

        broadcastUpdate('match_found', { requestId, providerId: bestProvider.id, transaction });
      }
    } catch (error) {
      console.error('Matching algorithm error:', error);
    }
  }

  // Simulate real-time energy data updates
  setInterval(async () => {
    try {
      const providers = await storage.getActiveEnergyProviders();
      for (const provider of providers) {
        // Simulate fluctuating production and available energy
        const currentProduction = Math.max(0, parseFloat(provider.currentProduction || "0") + (Math.random() - 0.5) * 2);
        const maxCapacity = parseFloat(provider.maxCapacity || "0");
        const consumption = Math.random() * currentProduction * 0.3; // Random consumption
        const availableEnergy = Math.min(maxCapacity, Math.max(0, currentProduction - consumption));

        await storage.updateProviderEnergyData(provider.id, currentProduction, availableEnergy);
      }

      // Update community stats
      const totalProduction = providers.reduce((sum, p) => sum + parseFloat(p.currentProduction || "0"), 0);
      const totalAvailable = providers.reduce((sum, p) => sum + parseFloat(p.availableEnergy || "0"), 0);
      
      await storage.updateCommunityStats({
        totalProduction: totalProduction.toString(),
        totalConsumption: (totalProduction - totalAvailable).toString(),
        activeProviders: providers.length,
        activeConsumers: 47, // Simulated
        currentFlowRate: (totalProduction * 0.7).toString()
      });

      broadcastUpdate('energy_data_update', { 
        totalProduction, 
        totalAvailable,
        activeProviders: providers.length 
      });
    } catch (error) {
      console.error('Real-time update error:', error);
    }
  }, 5000); // Update every 5 seconds

  return httpServer;
}
