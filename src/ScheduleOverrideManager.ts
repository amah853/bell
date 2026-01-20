import cookieManager from './LocalForageCookieManager'
import Calendar from './Calendar'

interface IScheduleOverride {
  date: string
  scheduleName: string
  display: string | null
}

class ScheduleOverrideManager {
  
  private cache: IScheduleOverride[] = []
  private cacheLoaded: boolean = false

  constructor() {
    this.loadCache()
  }

  private async loadCache(): Promise<void> {
    this.cache = await cookieManager.get('schedule_overrides', [])
    this.cache = Array.isArray(this.cache) ? this.cache : []
    this.cacheLoaded = true
    await this.cleanupOldOverrides()
  }

  private async saveCache(): Promise<void> {
    await cookieManager.set('schedule_overrides', this.cache)
  }

  public async setOverrideForToday (scheduleName: string, display: string | null = null): Promise<void> {
    const today = Calendar.dateToString(new Date())
    
    // Remove any existing override for today
    this.cache = this.cache.filter(o => o.date !== today)
    
    // Add new override
    this.cache.push({
      date: today,
      scheduleName,
      display
    })
    
    await this.saveCache()
  }

  public async clearOverrideForToday (): Promise<void> {
    const today = Calendar.dateToString(new Date())
    this.cache = this.cache.filter(o => o.date !== today)
    await this.saveCache()
  }

  public getOverrideForDate (date: Date): IScheduleOverride | null {
    if (!this.cacheLoaded) return null
    const dateStr = Calendar.dateToString(date)
    return this.cache.find(o => o.date === dateStr) || null
  }

  public getTodayOverride(): IScheduleOverride | null {
    return this.getOverrideForDate(new Date())
  }

  public async cleanupOldOverrides (): Promise<void> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Keep only overrides for today or future dates
    this.cache = this.cache.filter(o => {
      const [month, day, year] = o.date.split('/').map(Number)
      const overrideDate = new Date(year, month - 1, day)
      overrideDate.setHours(0, 0, 0, 0)
      return overrideDate >= today
    })
    
    await this.saveCache()
  }
}

export default new ScheduleOverrideManager()
