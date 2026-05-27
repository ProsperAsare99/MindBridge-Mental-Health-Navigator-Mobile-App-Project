import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt?: string;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string | null;
  totalCheckIns: number;
  totalJournals: number;
  totalCrisisUses: number;
  totalPeerSupport: number;
  points: number;
  badges: string[];
}

const defaultStats: UserStats = {
  currentStreak: 0,
  longestStreak: 0,
  lastCheckInDate: null,
  totalCheckIns: 0,
  totalJournals: 0,
  totalCrisisUses: 0,
  totalPeerSupport: 0,
  points: 0,
  badges: [],
};

export const BADGE_DEFINITIONS: Record<string, Badge> = {
  'consistent': {
    id: 'consistent',
    name: 'Consistent',
    description: '7-day mood check-in streak',
    icon: 'Flame',
    color: '#F97316' // gentlePeach / orange
  },
  'reflective': {
    id: 'reflective',
    name: 'Reflective',
    description: '30 days of journaling',
    icon: 'BookOpen',
    color: '#8B5CF6' // softLilac
  },
  'self_advocate': {
    id: 'self_advocate',
    name: 'Self-Advocate',
    description: 'Used 10 crisis resources',
    icon: 'Shield',
    color: '#EF4444' // terracotta
  },
  'supporter': {
    id: 'supporter',
    name: 'Supporter',
    description: 'Given 5 peer supports',
    icon: 'Heart',
    color: '#EC4899' // dustyRose
  },
  'first_step': {
    id: 'first_step',
    name: 'First Step',
    description: 'Completed your first check-in',
    icon: 'Footprints',
    color: '#10B981' // eucalyptus
  }
};

const STATS_KEY = '@mindbridge_user_stats';

export class StreakManager {
  /**
   * Retrieves the current user stats from local storage.
   */
  static async getStats(): Promise<UserStats> {
    try {
      const data = await AsyncStorage.getItem(STATS_KEY);
      if (data) {
        return JSON.parse(data) as UserStats;
      }
      return { ...defaultStats };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { ...defaultStats };
    }
  }

  /**
   * Saves the user stats to local storage.
   */
  static async saveStats(stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  }

  /**
   * Checks if a specific badge should be unlocked and unlocks it if so.
   */
  private static checkBadges(stats: UserStats): UserStats {
    const newBadges = [...stats.badges];
    let pointsEarned = 0;

    const unlock = (badgeId: string, points: number) => {
      if (!newBadges.includes(badgeId)) {
        newBadges.push(badgeId);
        pointsEarned += points;
      }
    };

    if (stats.totalCheckIns >= 1) unlock('first_step', 50);
    if (stats.currentStreak >= 7) unlock('consistent', 200);
    if (stats.totalJournals >= 30) unlock('reflective', 300);
    if (stats.totalCrisisUses >= 10) unlock('self_advocate', 250);
    if (stats.totalPeerSupport >= 5) unlock('supporter', 200);

    return {
      ...stats,
      badges: newBadges,
      points: stats.points + pointsEarned
    };
  }

  /**
   * Logs a daily mood check-in, updating streaks and checking badges.
   */
  static async logCheckIn(): Promise<UserStats> {
    let stats = await this.getStats();
    
    const today = new Date().toISOString().split('T')[0];
    
    if (stats.lastCheckInDate === today) {
      // Already checked in today, do nothing to the streak but maybe add points
      return stats;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    stats.totalCheckIns += 1;
    stats.points += 10; // 10 points for check-in

    if (stats.lastCheckInDate === yesterdayStr) {
      // Checked in yesterday, streak continues
      stats.currentStreak += 1;
    } else {
      // Missed a day, streak resets
      stats.currentStreak = 1;
    }

    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }

    stats.lastCheckInDate = today;

    // Check for badges
    stats = this.checkBadges(stats);

    await this.saveStats(stats);
    return stats;
  }

  /**
   * Logs a journal entry.
   */
  static async logJournal(): Promise<UserStats> {
    let stats = await this.getStats();
    stats.totalJournals += 1;
    stats.points += 20; // 20 points for journaling
    stats = this.checkBadges(stats);
    await this.saveStats(stats);
    return stats;
  }

  /**
   * Logs crisis resource usage.
   */
  static async logCrisisUse(): Promise<UserStats> {
    let stats = await this.getStats();
    stats.totalCrisisUses += 1;
    stats.points += 15; // Point incentive to seek help
    stats = this.checkBadges(stats);
    await this.saveStats(stats);
    return stats;
  }

  /**
   * Generates mock data for testing purposes
   */
  static async seedMockData(): Promise<UserStats> {
    const today = new Date().toISOString().split('T')[0];
    const mockStats: UserStats = {
      currentStreak: 5,
      longestStreak: 12,
      lastCheckInDate: today,
      totalCheckIns: 42,
      totalJournals: 15,
      totalCrisisUses: 2,
      totalPeerSupport: 0,
      points: 1250,
      badges: ['first_step', 'consistent'],
    };
    await this.saveStats(mockStats);
    return mockStats;
  }
}
