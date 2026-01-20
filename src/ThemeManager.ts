import { ITheme } from './themes/timings/Timing'

import { dark as BluesDark, light as BluesLight } from './themes/Blues'
import { dark as DefaultDark, light as DefaultLight } from './themes/Default'
import * as GradientDark from './themes/GradientDark'
import * as GradientLight from './themes/GradientLight'
import { dark as GraysDark, light as GraysLight } from './themes/Grays'
import { dark as GreenDark, light as GreenLight } from './themes/Green'
import * as Halloween from './themes/Halloween'
import * as Jonathan from './themes/Jonathan'
import { dark as PurpleDark, light as PurpleLight } from './themes/Purple'
import { dark as PastelDark, light as PastelLight } from './themes/Pastel'
import { dark as RainbowDark, light as RainbowLight } from './themes/Rainbow'
import * as Winter from './themes/Winter'

const themes: ITheme[] = [
  Winter,
  Halloween,
  DefaultLight,
  DefaultDark,
  GradientLight,
  GradientDark,
  PastelLight,
  PastelDark,
  RainbowLight,
  RainbowDark,
  GraysLight,
  GraysDark,
  BluesLight,
  BluesDark,
  PurpleLight,
  PurpleDark,
  GreenLight,
  GreenDark,
  Jonathan
]

export default class ThemeManager {

  private secrets: string[]

  private themeName?: string
  private themes: { [themeName: string]: ITheme }

  constructor (themeName?: string, secrets?: string[]) {
    this.themeName = themeName
    this.secrets = secrets || []

    this.themes = {}
    for (const theme of themes) {
      this.themes[theme.name] = theme
    }
  }

  private isDebugMode (): boolean {
    if (typeof window === 'undefined') return false
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const urlParams = new URLSearchParams(window.location.search)
    return isLocalhost && urlParams.get('mode') === 'debug'
  }

  get defaultTheme (): ITheme {
    // The first available theme in the array is the default
    for (const theme of themes) {
      if (this.isAvailable(theme.name)) {
        return theme
      }
    }
    return DefaultLight
  }

  set currentThemeName (themeName: string) {
    this.themeName = themeName
  }

  get currentThemeName (): string {
    return this.themeName || this.defaultTheme.name
  }

  get currentTheme (): ITheme {
    const theme = this.themes[this.currentThemeName]
    if (!theme || !this.isAvailable(theme.name)) {
      this.currentThemeName = this.defaultTheme.name
      return this.themes[this.currentThemeName]
    }
    return theme
  }

  public isAvailable (themeName: string): boolean {
    if (this.isDebugMode()) return true
    return !this.themes[themeName].enabled
      || this.themes[themeName].enabled!(this.secrets)
  }

  get availableThemes () {
    const available: string[] = []

    for (const name in this.themes) {
      if (this.isAvailable(name)) {
        available.push(name)
      }
    }

    return available
  }
}
