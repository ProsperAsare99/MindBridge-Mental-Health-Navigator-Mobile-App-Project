import NetInfo from '@react-native-community/netinfo';
import { getUnsyncedMoodLogs, markMoodLogsAsSynced } from '../utils/database';
import api from './api';

class SyncEngine {
  private isSyncing = false;

  init() {
    // Listen for network state changes
    NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        this.syncOfflineData();
      }
    });

    // Also try syncing periodically
    setInterval(() => {
      this.syncOfflineData();
    }, 60000); // Check every minute
  }

  async syncOfflineData() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected || !state.isInternetReachable) {
        this.isSyncing = false;
        return;
      }

      // Sync Mood Logs
      const unsyncedMoods = await getUnsyncedMoodLogs() as any[];
      if (unsyncedMoods && unsyncedMoods.length > 0) {
        console.log(`Syncing ${unsyncedMoods.length} mood logs to Neon PostgreSQL...`);
        
        // Push to backend
        // This assumes backend route can handle batch inserts, or we loop
        const idsToMark: string[] = [];
        for (const log of unsyncedMoods) {
          try {
            const parsedEmotions = log.emotions ? JSON.parse(log.emotions) : [];
            await api.post('/mood', {
              score: log.score,
              emotions: parsedEmotions,
              note: log.note,
              createdAt: log.created_at,
            });
            idsToMark.push(log.id);
          } catch (e) {
            console.error('Failed to sync individual mood log', e);
          }
        }

        if (idsToMark.length > 0) {
          await markMoodLogsAsSynced(idsToMark);
          console.log(`Successfully synced ${idsToMark.length} mood logs.`);
        }
      }

    } catch (error) {
      console.error('Error during offline sync cycle', error);
    } finally {
      this.isSyncing = false;
    }
  }
}

export default new SyncEngine();
