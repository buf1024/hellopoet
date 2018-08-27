const themes = {
  '#fff': {
    backgroundColor: '#fff',
    floatBackgroundColor: '#f0f0f0',
    borderColor: '#9c9c9c',
    color: '#6e6e6e',
  },
  '#d4c396': {
    backgroundColor: '#d4c396',
    floatBackgroundColor: '#d4d3a6',
    borderColor: '#3a5a60',
    color: '#6e6e6e',
  },
  '#bed0e2': {
    backgroundColor: '#bed0e2',
    floatBackgroundColor: '#bee0f2',
    borderColor: '#3a5a60',
    color: '#6e6e6e',
  },
  '#c7eac7': {
    backgroundColor: '#c7eac7',
    floatBackgroundColor: '#c7dad7',
    borderColor: '#3a5a60',
    color: '#6e6e6e',
  },
  '#e0e0e0': {
    backgroundColor: '#e0e0e0',
    floatBackgroundColor: '#e0d0d0',
    borderColor: '#3a5a60',
    color: '#6e6e6e',
  },
  '#ffb1a3': {
    backgroundColor: '#ffb1a3',
    floatBackgroundColor: '#ffe1b3',
    borderColor: '#3a5a60',
    color: '#6e6e6e',
  },
  '#1c262a': {
    backgroundColor: '#1c262a',
    floatBackgroundColor: '#1c363a',
    borderColor: '#3a5a60',
    color: '#6e6e6e',
  },
}

export const myTheme = (theme, nightMode) => {
  if (nightMode) {
    return themes['#1c262a']
  }
  if (themes[theme] === undefined) {
    return themes['#fff']
  }
  return themes[theme]
}